# VulnLab Control Center

![VulnLab Control Center Dashboard]

Professional web dashboard to manage vulnerable Docker lab containers, APIs, and AI/LLM training targets for security research.

## Team Quickstart (Windows)

```powershell
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/vulnlab-quickstart.git
cd vulnlab-quickstart

# 2. Run the setup script (first time — installs dependencies, starts everything)
PowerShell -ExecutionPolicy Bypass -File .\setup.ps1
```

That's it. The script handles everything automatically. Open **http://localhost:3000** when it finishes.

---

## What the Setup Script Does

| Step | What it does |
|------|--------------|
| Checks prereqs | Verifies `node`, `npm`, and `docker` are installed |
| Creates `.env` files | Auto-generates config without hardcoded paths |
| `npm install` | Installs dependencies for both `lab-api` and `webapp` |
| `docker compose up -d` | Pulls and starts all vulnerable lab containers |
| Starts Lab API | `node lab-api/server.js` on port 4100 |
| Starts Dashboard | `npm run dev` in `webapp/` on port 3000 |

---

## Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Lab Ports

| Lab | URL |
|-----|-----|
| Dashboard | http://localhost:3000 |
| DVWA | http://localhost:8088 |
| OWASP Juice Shop | http://localhost:3001 |
| WebGoat | http://localhost:8085 |
| bWAPP | http://localhost:8082 |
| vAPI | External (http://vapi.apisec.ai/) |
| VAmPI | http://localhost:8087/ui/ |
| crAPI | External (https://github.com/OWASP/crAPI) |
| DVLLM | External (https://dvllm.com/) |
| phpMyAdmin | http://localhost:8084 |
| MySQL | localhost:3306 |
| PostgreSQL | localhost:5432 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |

---

## Project Structure

```
vulnlab-quickstart/
├── setup.ps1                   ← Run this first (Windows)
├── docker-compose.yml          ← All vulnerable lab containers
├── lab-api/
│   ├── server.js               ← Express API that controls Docker
│   └── .env.example            ← Config template (auto-copied by setup.ps1)
└── webapp/
    ├── src/
    │   ├── app/page.tsx         ← Main dashboard
    │   ├── components/          ← LabCard, LogViewer, NavBar, StatusBadge
    │   └── lib/                 ← API client + lab metadata
    └── next.config.ts           ← Next.js (proxies /api to lab-api)
```

---

> **⚠️ For educational use only.** Do not expose these containers to the public internet.