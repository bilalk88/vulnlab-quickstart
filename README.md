# VulnLab Control Center

![VulnLab Control Center Dashboard](./assets/dashboard_walkthrough.webp)

Professional web dashboard to manage vulnerable Docker lab containers, APIs, and AI/LLM training targets for security research.

> **⚠️ For educational use only.** Do not expose these containers to the public internet.

---

## Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Option 1 — Automated Setup (Recommended)

**Windows (Command Prompt):**
```cmd
git clone https://github.com/bilalk88/vulnlab-quickstart.git
cd vulnlab-quickstart
setup.bat
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/bilalk88/vulnlab-quickstart.git
cd vulnlab-quickstart
PowerShell -ExecutionPolicy Bypass -File .\setup.ps1
```

**Linux / macOS:**
```bash
git clone https://github.com/bilalk88/vulnlab-quickstart.git
cd vulnlab-quickstart
chmod +x setup.sh && ./setup.sh
```

That's it. The script handles everything automatically. Open **http://localhost:3000** when it finishes.

### Option 2 — Quick Launch (Already Set Up)

If you've already run the setup once, just double-click **`start.bat`** (Windows) or run the servers manually:

```bash
# Terminal 1 — Lab API
cd lab-api && npm install && node server.js

# Terminal 2 — Dashboard
cd webapp && npm install && npm run dev
```

---

## What the Setup Scripts Do

| Step | What it does |
|------|--------------|
| Checks prereqs | Verifies `node`, `npm`, and `docker` are installed |
| Creates `.env` files | Auto-generates config without hardcoded paths |
| `npm install` | Installs dependencies for both `lab-api` and `webapp` |
| `docker compose up -d` | Pulls and starts all vulnerable lab containers |
| Starts Lab API | `node lab-api/server.js` on port 4100 |
| Starts Dashboard | `npm run dev` in `webapp/` on port 3000 |

---

## Lab Ports

| Lab | URL | Default Credentials |
|-----|-----|---------------------|
| Dashboard | http://localhost:3000 | — |
| DVWA | http://localhost:8088 | admin / password |
| OWASP Juice Shop | http://localhost:3001 | (self-register) |
| WebGoat | http://localhost:8085 | (self-register) |
| bWAPP | http://localhost:8082 | bee / bug |
| Hackazon | http://localhost:8083 | (self-register) |
| VAmPI | http://localhost:8087/ui/ | — |
| vAPI | External (http://vapi.apisec.ai/) | — |
| crAPI | External (https://github.com/OWASP/crAPI) | — |
| DVLLM | External (https://github.com/harishsg993010/DamnVulnerableLLMProject) | — |
| phpMyAdmin | http://localhost:8084 | root / root |
| MySQL | localhost:3306 | root / root |
| PostgreSQL | localhost:5432 | postgres / postgres |
| MongoDB | localhost:27017 | — |
| Redis | localhost:6379 | — |

---

## Project Structure

```
vulnlab-quickstart/
├── start.bat                   ← Quick launcher (Windows, double-click)
├── setup.bat                   ← Full first-time setup (Windows CMD)
├── setup.ps1                   ← Full first-time setup (Windows PowerShell)
├── setup.sh                    ← Full first-time setup (Linux/macOS)
├── docker-compose.yml          ← All vulnerable lab containers
├── package.json                ← Root scripts (npm start runs both servers)
├── lab-api/
│   ├── server.js               ← Express API that controls Docker
│   ├── .env.example            ← Config template (auto-copied by setup scripts)
│   └── .env                    ← Your local config (auto-created)
└── webapp/
    ├── src/
    │   ├── app/page.tsx         ← Main dashboard page
    │   ├── components/          ← LabCard, LogViewer, NavBar, StatusBadge
    │   └── lib/                 ← API client + lab metadata
    └── next.config.ts           ← Next.js config (proxies /api to lab-api)
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `node` or `npm` not found | Install Node.js 20+ from [nodejs.org](https://nodejs.org) |
| `docker` not found | Install Docker Desktop and make sure it's running |
| Port already in use | Stop the conflicting app or change the port in `lab-api/.env` |
| Dashboard can't connect to API | Make sure Lab API is running on port 4100 |

---

> 📖 For a detailed walkthrough including architecture, features, and verification checklist, see [HowToStart.md](./HowToStart.md).