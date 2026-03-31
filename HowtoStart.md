# VulnLab Control Center — How to Start

> **⚠️ For educational use only.** Do not expose these containers to the public internet.

---

## Prerequisites

Before you begin, make sure the following are installed on your machine:

| Requirement | Download Link |
|---|---|
| **Node.js 20+** | [https://nodejs.org](https://nodejs.org) |
| **Docker Desktop** | [https://docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) |

---

## Quick Start (Recommended)

### Option A — One-Click Setup (First Time)

If this is your **first time** setting up the project, use the full setup script. It will install all dependencies, pull Docker images, start lab containers, and launch the dashboard automatically.

**Windows (Command Prompt):**
```cmd
setup.bat
```

**Windows (PowerShell):**
```powershell
PowerShell -ExecutionPolicy Bypass -File .\setup.ps1
```

**Linux / macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option B — Quick Launch (Already Set Up)

If you've already run the setup once and just want to start the servers:

**Windows:**
```cmd
start.bat
```

---

## Manual Start (Step-by-Step)

If you prefer to start things manually, follow these steps:

### Step 1 — Install Dependencies (first time only)

```bash
# From the project root directory:
cd lab-api && npm install
cd ../webapp && npm install
```

### Step 2 — Start the Lab API Server

Open a terminal in the project root and run:
```bash
cd lab-api
node server.js
```
The API will start on **http://localhost:4100**.

### Step 3 — Start the Web Dashboard

Open a **second terminal** in the project root and run:
```bash
cd webapp
npm run dev
```
The dashboard will start on **http://localhost:3000**.

### Step 4 — Start Docker Lab Containers (optional)

Open a **third terminal** in the project root and run:
```bash
docker compose up -d
```
This pulls and starts all the vulnerable lab containers defined in `docker-compose.yml`.

> You can also start individual labs from the Dashboard UI using the "Start" button on each lab card.

---

## Architecture Overview

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│   Web Dashboard      │────▶│   Lab API Server     │────▶│   Docker Compose     │
│   (Next.js)          │     │   (Node.js/Express)  │     │   (Lab Containers)   │
│   Port 3000          │     │   Port 4100          │     │   Various Ports      │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
```

- The **Web Dashboard** is the user interface where you manage labs.
- The **Lab API Server** talks to Docker to start/stop/restart containers.
- **Docker Compose** runs the actual vulnerable applications and databases.

The Lab API automatically detects the `docker-compose.yml` file in the parent directory — no hardcoded paths or complex environment setup required.

---

## Configuration

The application is pre-configured to work out of the box. No tokens or API keys needed.

| Setting | Default | Notes |
|---|---|---|
| `PORT` | `4100` | Lab API server port (set in `lab-api/.env`) |
| `LAB_DIR` | Auto-detected | Path to `docker-compose.yml` (parent of `lab-api/`) |
| Dashboard URL | `http://localhost:3000` | Next.js dev server |

> To customize, copy `lab-api/.env.example` to `lab-api/.env` and edit the values.

---

## Lab Ports Reference

| Lab | URL | Default Credentials |
|---|---|---|
| **Dashboard** | http://localhost:3000 | — |
| **DVWA** | http://localhost:8088 | admin / password |
| **OWASP Juice Shop** | http://localhost:3001 | (self-register) |
| **WebGoat** | http://localhost:8085 | (self-register) |
| **bWAPP** | http://localhost:8082 | bee / bug |
| **Hackazon** | http://localhost:8083 | (self-register) |
| **VAmPI** | http://localhost:8087/ui/ | — |
| **vAPI** | http://vapi.apisec.ai/ | External |
| **crAPI** | https://github.com/OWASP/crAPI | External |
| **DVLLM** | https://github.com/harishsg993010/DamnVulnerableLLMProject | External |
| **phpMyAdmin** | http://localhost:8084 | root / root |
| **MySQL** | localhost:3306 | root / root |
| **PostgreSQL** | localhost:5432 | postgres / postgres |
| **MongoDB** | localhost:27017 | — |
| **Redis** | localhost:6379 | — |

---

## Features

| Feature | Description |
|---|---|
| **One-Click Control** | Start, stop, or restart any lab from the dashboard grid UI. |
| **Log Streaming** | Real-time terminal logs delivered to the UI for immediate feedback. |
| **Animated Status** | Visual badges that reflect the live state of every Docker container. |
| **Security Toolkit** | Searchable database of installed Go, Python, and system tools. |
| **Proxy Guide** | Interactive guide for setting up Burp Suite and OWASP ZAP locally. |

---

## Verification Checklist

After starting, verify everything is working:

- [ ] Dashboard loads at `http://localhost:3000`
- [ ] Lab API health check returns OK at `http://localhost:4100/api/health`
- [ ] Clicking "Start" on a lab initiates the Docker container
- [ ] Status badges change from ⚫ (Stopped) → 🟡 (Starting) → 🟢 (Running)
- [ ] Live log drawer opens and displays real-time container output

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `node` or `npm` not found | Install Node.js 20+ from [nodejs.org](https://nodejs.org) |
| `docker` not found | Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/) |
| Port already in use | Another app is using the port. Stop it or change the port in `.env` |
| Docker containers won't start | Make sure Docker Desktop is running before starting labs |
| Dashboard shows "Cannot connect" | Make sure the Lab API is running on port 4100 |

---

## Project Structure

```
vulnlab-quickstart/
├── start.bat                   ← Quick launcher (Windows)
├── setup.bat                   ← Full first-time setup (Windows CMD)
├── setup.ps1                   ← Full first-time setup (Windows PowerShell)
├── setup.sh                    ← Full first-time setup (Linux/macOS)
├── docker-compose.yml          ← All vulnerable lab containers
├── package.json                ← Root scripts (npm start runs both servers)
├── lab-api/
│   ├── server.js               ← Express API that controls Docker
│   ├── .env.example            ← Config template
│   └── .env                    ← Your local config (auto-created by setup)
└── webapp/
    ├── src/
    │   ├── app/page.tsx         ← Main dashboard page
    │   ├── components/          ← LabCard, LogViewer, NavBar, StatusBadge
    │   └── lib/                 ← API client + lab metadata
    └── next.config.ts           ← Next.js config (proxies /api to lab-api)
```

---

> **Note:** For production deployments (e.g., VPS), you can override the `LAB_DIR` and `NEXT_PUBLIC_LAB_API_URL` environment variables in your `.env` files.

*Last Updated: March 2026*
