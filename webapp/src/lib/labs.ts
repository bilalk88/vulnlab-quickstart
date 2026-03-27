// Lab metadata – mirrors the LABS array in lab-api/server.js
// This is client-side only; no Docker calls happen here.

export interface LabCredentials {
  user: string;
  password: string;
}

export type LabStatus = 'running' | 'stopped' | 'restarting' | 'exited' | 'unknown' | 'external';

export interface Lab {
  id: string;
  name: string;
  description: string;
  category: 'Web App' | 'Database' | 'API Labs' | 'AI/LLM';
  port?: number;
  url: string;
  setupPath?: string;
  defaultCreds?: LabCredentials;
  tags: string[];
  status?: LabStatus;
}

export const LABS: Lab[] = [
  {
    id: 'dvwa',
    name: 'DVWA',
    description: 'Damn Vulnerable Web Application — classic PHP/MySQL training target covering SQLi, XSS, CSRF and more.',
    category: 'Web App',
    port: 8088,
    url: 'http://localhost:8088',
    setupPath: '/setup.php',
    defaultCreds: { user: 'admin', password: 'password' },
    tags: ['SQLi', 'XSS', 'CSRF', 'File Upload', 'Brute Force'],
  },
  {
    id: 'juice-shop',
    name: 'OWASP Juice Shop',
    description: 'Modern intentionally insecure Node.js/Angular e-commerce app covering the full OWASP Top 10.',
    category: 'Web App',
    port: 3001,
    url: 'http://localhost:3001',
    defaultCreds: { user: '(self-register)', password: '' },
    tags: ['SQLi', 'XSS', 'Broken Auth', 'IDOR', 'XXE'],
  },
  {
    id: 'webgoat',
    name: 'WebGoat',
    description: 'OWASP WebGoat — deliberate insecure Java EE application for interactive security lessons.',
    category: 'Web App',
    port: 8085,
    url: 'http://localhost:8085/WebGoat',
    defaultCreds: { user: '(self-register)', password: '' },
    tags: ['SQL Injection', 'Path Traversal', 'XXE', 'JWT', 'IDOR'],
  },
  {
    id: 'bwapp',
    name: 'bWAPP',
    description: 'Buggy Web App — PHP app with over 100 web vulnerabilities for testing.',
    category: 'Web App',
    port: 8082,
    url: 'http://localhost:8082',
    setupPath: '/install.php',
    defaultCreds: { user: 'bee', password: 'bug' },
    tags: ['HTML Injection', 'iFrame Injection', 'OS Command Injection'],
  },
  {
    id: 'hackazon',
    name: 'Hackazon',
    description: 'Complex vulnerable e-commerce platform for realistic web assessment practice.',
    category: 'Web App',
    port: 8083,
    url: 'http://localhost:8083',
    defaultCreds: { user: '(self-register)', password: '' },
    tags: ['SQLi', 'SSRF', 'Business Logic', 'IDOR'],
  },
  {
    id: 'vapi',
    name: 'vAPI',
    description: 'Vulnerable API (vAPI) — highly interactive API security training ground based on OWASP API Top 10.',
    category: 'API Labs',
    port: 8086,
    url: 'http://localhost:8086/vapi/',
    tags: ['API Security', 'BOLA', 'BFLA', 'Mass Assignment'],
  },
  {
    id: 'vampi',
    name: 'VAmPI',
    description: 'Vulnerable API based on Flask. Includes OpenAPI spec and intentionally vulnerable endpoints.',
    category: 'API Labs',
    port: 8087,
    url: 'http://localhost:8087/ui/',
    tags: ['API Security', 'Injection', 'Broken Auth'],
  },
  {
    id: 'crapi',
    name: 'crAPI (OWASP)',
    description: 'Completely Ridiculous API — complex microservice architecture designed to teach API security.',
    category: 'API Labs',
    url: 'http://crapi.apisec.ai/login',
    tags: ['API Security', 'Microservices', 'GraphQL'],
    status: 'external',
  },
  {
    id: 'dvllm',
    name: 'DVLLM',
    description: 'Damn Vulnerable LLM — exploring vulnerabilities in Large Language Models (Prompt Injection, Exfiltration).',
    category: 'AI/LLM',
    url: 'https://dvllm.com/',
    tags: ['LLM Security', 'Prompt Injection', 'AI'],
    status: 'external',
  },
  {
    id: 'phpmyadmin',
    name: 'phpMyAdmin',
    description: 'Web UI for the MySQL test database.',
    category: 'Web App',
    port: 8084,
    url: 'http://localhost:8084',
    defaultCreds: { user: 'root', password: 'root' },
    tags: ['MySQL', 'Database UI'],
  },
  {
    id: 'mysql',
    name: 'MySQL 5.7',
    description: 'MySQL test database — practice SQL injection and privilege escalation.',
    category: 'Database',
    port: 3306,
    url: 'mysql://localhost:3306',
    defaultCreds: { user: 'root', password: 'root' },
    tags: ['MySQL', 'Database'],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL 13',
    description: 'PostgreSQL test database.',
    category: 'Database',
    port: 5432,
    url: 'postgresql://localhost:5432',
    defaultCreds: { user: 'postgres', password: 'postgres' },
    tags: ['PostgreSQL', 'Database'],
  },
  {
    id: 'mongo',
    name: 'MongoDB',
    description: 'MongoDB — NoSQL test database, practice NoSQL injection.',
    category: 'Database',
    port: 27017,
    url: 'mongodb://localhost:27017',
    defaultCreds: { user: '', password: '(no auth)' },
    tags: ['MongoDB', 'NoSQL'],
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'Redis in-memory store — test for misconfiguration and RCE via RESP protocol.',
    category: 'Database',
    port: 6379,
    url: 'redis://localhost:6379',
    defaultCreds: { user: '', password: '(no auth)' },
    tags: ['Redis', 'In-Memory'],
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Web App': 'emerald',
  'Database': 'sky',
  'API Labs': 'fuchsia',
  'AI/LLM': 'purple',
};
