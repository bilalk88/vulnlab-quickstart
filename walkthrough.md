# PentestGround — Walkthrough & Deployment Guide

## Project Vision & Architecture

**PentestGround** is a self-contained, automated security lab environment. It provides a professional "Command Center" dashboard to manage multiple vulnerable web applications and databases without having to interact directly with Docker Compose or CLI tools for every action.

### Portable Architecture
```
User Dashboard (WebApp) → Node.js Lab API (Port 4000) → Docker Compose (Labs)
```

By default, the **Lab API** automatically detects its environment. If you run it from the cloned repository, it finds the `docker-compose.yml` in the parent directory instantly. No hardcoded absolute paths or complex environment setup required.

---

## Features Breakdown

| Feature | Description |
|---|---|
| **One-Click Control** | Start, stop, or restart any lab from a high-performance grid UI. |
| **Log Streaming** | Real-time terminal logs delivered to the UI for immediate feedback. |
| **Animated Status** | Visual badges that reflect the live state of every Docker container. |
| **Security Toolkit** | Searchable database of installed Go, Python, and system tools. |
| **Proxy Guide** | Interactive guide for setting up Burp Suite and OWASP ZAP locally. |

---

## Quick Deployment (Local/Portable)

### Step 1 — Start the Stack
The simplest way to start the entire application is to use the included `start.bat` (Windows) or start the processes manually.

**From the project root:**
```bash
# Start backend
cd lab-api && npm install && node server.js

# Start frontend (New terminal)
cd webapp && npm install && npm run dev
```

### Step 2 — Configuration (Zero-Token)
The application is pre-configured to work out of the box. 

1. **LAB_DIR:** Automatically detected as the parent of the `lab-api` folder.
2. **API_SECRET:** Authentication is disabled in portable mode to simplify team access.
3. **API_BASE:** Defaults to `localhost:4000` for a seamless local experience.

---

## Verification Checklist

- [ ] All 3 pages (Dashboard, Tools, Proxy) load at `localhost:3000`.
- [ ] Clicking "Start" on a lab initiates the Docker container.
- [ ] Live log drawer opens and displays real-time container output.
- [ ] Status badges change from ⚫ (Stopped) to 🟡 (Restarting) to 🟢 (Running).

---

> [!NOTE]
> For production deployments (e.g., VPS), you can still override the `LAB_DIR` and `NEXT_PUBLIC_LAB_API_URL` environment variables in your `.env` or Vercel dashboard.

*Last Updated: 2026*
