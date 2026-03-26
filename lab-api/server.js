#!/usr/bin/env node
/**
 * VulnLab API Server
 * Wraps Docker Compose to provide live container control to the local dashboard.
 * Runs on the same host machine as Docker — no authentication required (local use only).
 *
 * All routes: /api/*
 */

'use strict';

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const { execFile, spawn } = require('child_process');
const path      = require('path');

require('dotenv').config();

const PORT    = process.env.PORT    || 4100;
const LAB_DIR = process.env.LAB_DIR || path.join(__dirname, '..');

// ── Lab manifest (mirrors docker-compose.yml) ─────────────────────────────────
const LABS = [
  {
    id:           'dvwa',
    name:         'DVWA',
    description:  'Damn Vulnerable Web Application – the classic PHP/MySQL training target.',
    category:     'Web App',
    port:         8088,
    url:          'http://localhost:8088',
    setupPath:    '/setup.php',
    defaultCreds: { user: 'admin', password: 'password' },
    tags:         ['SQLi','XSS','CSRF','File Upload','Brute Force'],
  },
  {
    id:           'juice-shop',
    name:         'OWASP Juice Shop',
    description:  'Modern intentionally insecure Node.js/Angular e-commerce app covering OWASP Top 10.',
    category:     'Web App',
    port:         3001,
    url:          'http://localhost:3001',
    defaultCreds: { user: '(self-register)', password: '' },
    tags:         ['SQLi','XSS','Broken Auth','IDOR','XXE'],
  },
  {
    id:           'webgoat',
    name:         'WebGoat',
    description:  'OWASP WebGoat — deliberate insecure Java EE web application for learning.',
    category:     'Web App',
    port:         8085,
    url:          'http://localhost:8085/WebGoat',
    defaultCreds: { user: '(self-register)', password: '' },
    tags:         ['SQL Injection','Path Traversal','XXE','JWT','IDOR'],
  },
  {
    id:           'bwapp',
    name:         'bWAPP',
    description:  'Buggy Web App — PHP app with over 100 web vulnerabilities.',
    category:     'Web App',
    port:         8082,
    url:          'http://localhost:8082',
    setupPath:    '/install.php',
    defaultCreds: { user: 'bee', password: 'bug' },
    tags:         ['HTML Injection','iFrame Injection','OS Command Injection'],
  },
  {
    id:           'hackazon',
    name:         'Hackazon',
    description:  'A complex vulnerable e-commerce platform for assessment practice.',
    category:     'Web App',
    port:         8083,
    url:          'http://localhost:8083',
    defaultCreds: { user: '(self-register)', password: '' },
    tags:         ['SQLi','SSRF','Business Logic','IDOR'],
  },
  {
    id:           'vapi',
    name:         'vAPI',
    description:  'Vulnerable API based on OWASP API Top 10.',
    category:     'API Labs',
    port:         8086,
    url:          'http://localhost:8086/vapi/',
    tags:         ['API Security'],
  },
  {
    id:           'vampi',
    name:         'VAmPI',
    description:  'Vulnerable API based on Flask.',
    category:     'API Labs',
    port:         8087,
    url:          'http://localhost:8087/ui/',
    tags:         ['API Security'],
  },
  {
    id:           'crapi',
    name:         'crAPI (OWASP)',
    description:  'Completely Ridiculous API.',
    category:     'API Labs',
    url:          'https://github.com/OWASP/crAPI',
    tags:         ['API Security'],
    status:       'external',
  },
  {
    id:           'dvllm',
    name:         'DVLLM',
    description:  'Damn Vulnerable LLM testing framework.',
    category:     'AI/LLM',
    url:          'https://github.com/harishsg993010/DamnVulnerableLLMProject',
    tags:         ['LLM Security'],
    status:       'external',
  },
  {
    id:           'phpmyadmin',
    name:         'phpMyAdmin',
    description:  'Web UI for the MySQL test database.',
    category:     'Database',
    port:         8084,
    url:          'http://localhost:8084',
    defaultCreds: { user: 'root', password: 'root' },
    tags:         ['MySQL','Database'],
  },
  {
    id:           'mysql',
    name:         'MySQL',
    description:  'MySQL 5.7 test database (root/root).',
    category:     'Database',
    port:         3306,
    url:          'mysql://localhost:3306',
    defaultCreds: { user: 'root', password: 'root' },
    tags:         ['MySQL','Database'],
  },
  {
    id:           'postgres',
    name:         'PostgreSQL',
    description:  'PostgreSQL 13 test database.',
    category:     'Database',
    port:         5432,
    url:          'postgresql://localhost:5432',
    defaultCreds: { user: 'postgres', password: 'postgres' },
    tags:         ['PostgreSQL','Database'],
  },
  {
    id:           'mongo',
    name:         'MongoDB',
    description:  'MongoDB latest — NoSQL test database.',
    category:     'Database',
    port:         27017,
    url:          'mongodb://localhost:27017',
    defaultCreds: { user: '', password: '' },
    tags:         ['MongoDB','NoSQL'],
  },
  {
    id:           'redis',
    name:         'Redis',
    description:  'Redis in-memory data store — test for misconfigs & RCE.',
    category:     'Database',
    port:         6379,
    url:          'redis://localhost:6379',
    defaultCreds: { user: '', password: '' },
    tags:         ['Redis','In-Memory'],
  },
];

// Map service id → container name (as defined in compose file)
const CONTAINER_NAMES = {
  dvwa:        'dvwa',
  'juice-shop':'juice-shop',
  webgoat:     'webgoat',
  bwapp:       'bwapp',
  hackazon:    'hackazon',
  vapi:        'vapi',
  vampi:       'vampi',
  phpmyadmin:  'phpmyadmin',
  mysql:       'mysql-test',
  postgres:    'postgres-test',
  mongo:       'mongo-test',
  redis:       'redis-test',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function dockerCompose(args) {
  return new Promise((resolve, reject) => {
    execFile('docker', ['compose', ...args], { cwd: LAB_DIR, maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      resolve(stdout.trim());
    });
  });
}

async function getContainerStatus(containerId) {
  return new Promise((resolve) => {
    execFile(
      'docker', ['inspect', '--format', '{{.State.Status}}', containerId],
      (err, stdout) => {
        if (err) return resolve('stopped');
        resolve(stdout.trim() || 'stopped');
      }
    );
  });
}

async function enrichLabsWithStatus(labList) {
  return Promise.all(
    labList.map(async (lab) => {
      if (lab.status === 'external') return lab;
      const containerName = CONTAINER_NAMES[lab.id] || lab.id;
      const status = await getContainerStatus(containerName);
      return { ...lab, status };
    })
  );
}

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','OPTIONS']
}));

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', labDir: LAB_DIR, timestamp: new Date().toISOString() });
});

// List all labs with live status
app.get('/api/labs', async (_req, res) => {
  try {
    const labs = await enrichLabsWithStatus(LABS);
    res.json(labs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single lab status
app.get('/api/labs/:id', async (req, res) => {
  const lab = LABS.find(l => l.id === req.params.id);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });
  if (lab.status === 'external') return res.json(lab);
  
  const containerName = CONTAINER_NAMES[lab.id] || lab.id;
  const status = await getContainerStatus(containerName);
  res.json({ ...lab, status });
});

// Start ALL labs
app.post('/api/labs/all/start', async (_req, res) => {
  try {
    await dockerCompose(['up', '-d']);
    res.json({ success: true, message: 'All labs started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop ALL labs
app.post('/api/labs/all/stop', async (_req, res) => {
  try {
    await dockerCompose(['stop']);
    res.json({ success: true, message: 'All labs stopped' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start a lab
app.post('/api/labs/:id/start', async (req, res) => {
  const lab = LABS.find(l => l.id === req.params.id);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });
  try {
    await dockerCompose(['up', '-d', lab.id]);
    res.json({ success: true, message: `${lab.name} started` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop a lab
app.post('/api/labs/:id/stop', async (req, res) => {
  const lab = LABS.find(l => l.id === req.params.id);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });
  try {
    await dockerCompose(['stop', lab.id]);
    res.json({ success: true, message: `${lab.name} stopped` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Restart a lab
app.post('/api/labs/:id/restart', async (req, res) => {
  const lab = LABS.find(l => l.id === req.params.id);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });
  try {
    await dockerCompose(['restart', lab.id]);
    res.json({ success: true, message: `${lab.name} restarted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Live log streaming (Server-Sent Events)
app.get('/api/labs/:id/logs', (req, res) => {
  const lab = LABS.find(l => l.id === req.params.id);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });

  const lines = parseInt(req.query.lines || '100', 10);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const child = spawn('docker', ['compose', 'logs', '-f', `--tail=${lines}`, lab.id], {
    cwd: LAB_DIR,
  });

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  child.stdout.on('data', (chunk) => {
    chunk.toString().split('\n').filter(Boolean).forEach(line => send({ line }));
  });
  child.stderr.on('data', (chunk) => {
    chunk.toString().split('\n').filter(Boolean).forEach(line => send({ line }));
  });
  child.on('close', () => {
    res.write('event: close\ndata: {}\n\n');
    res.end();
  });

  req.on('close', () => child.kill());
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔐 VulnLab API Server`);
  console.log(`   Listening on  : http://localhost:${PORT}`);
  console.log(`   Lab directory : ${LAB_DIR}`);
  console.log(`   Auth          : none (local lab mode)\n`);
});
