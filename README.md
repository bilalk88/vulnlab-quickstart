# 🔐 PentestGround (formerly vulnlab-quickstart)

> **Portable. Automated. Powerful.**  
> A self-contained, Docker-based penetration testing environment and management dashboard. Spin up labs, monitor status, and stream logs—no complex configuration required.

---

## 🚀 Quick Start (Portable Mode)

The application is now fully portable and requires zero-token configuration for local use.

### 1. Prerequisites
- **Windows / Linux / macOS**
- **Docker & Docker Compose**
- **Node.js 20+**

### 2. Start the Application
Simply run the included batch file (Windows) or start the components manually:

**Windows:**
```batch
.\start.bat
```

**Manual (Linux/macOS):**
```bash
# 1. Start the Backend API
cd lab-api && npm install && npm run dev

# 2. Start the Web Dashboard (New Terminal)
cd webapp && npm install && npm run dev
```

The Dashboard will be live at **http://localhost:3000**.

---

## 📖 Project Overview

**PentestGround** is designed for security teams and researchers who need a reliable, isolated environment for practicing penetration testing. It bridges the gap between raw Docker commands and a professional management interface.

### The Problem it Solves
Managing multiple vulnerable containers (DVWA, Juice Shop, etc.) usually requires juggling multiple terminals, port numbers, and `docker-compose` commands. PentestGround provides a **centralized Command Center** to control everything with one click.

### Architecture
- **Web Dashboard (Next.js 14):** A premium, dark-themed UI for lab management.
- **Lab API (Node.js/Express):** A lightweight controller that auto-detects your `docker-compose.yml` and wraps Docker commands into a REST API.
- **Docker Stack:** 10+ industry-standard vulnerable apps and databases running in isolated containers.

---

## ✨ Key Features

### 🎮 Lab Management
- **One-Click Control:** Start, stop, or restart any lab container instantly.
- **Bulk Actions:** "Start All" or "Stop All" labs with a single click.
- **Live Status:** Real-time animated status badges (Running 🟢, Stopped ⚫, Transitioning 🟡).
- **Auto-Discovery:** The API automatically finds your labs by looking for the `docker-compose.yml` in the parent directory.

### 📜 Real-Time Monitoring
- **Live Log Stream:** Integrated terminal drawer that streams container logs directly to your browser using Server-Sent Events (SSE).
- **Health Checks:** Visual indicators showing the connectivity between the Dashboard and the Lab API.

### 🛠️ Integrated Security Toolkit
- **Tools Reference:** A categorized guide to 20+ pre-installed tools (nmap, nuclei, sqlmap, etc.) including purpose and usage examples.
- **Proxy Guide:** Built-in walkthrough for configuring Burp Suite and OWASP ZAP, including CA certificate installation.

### 📂 Portable & User-Friendly
- **Zero-Token Setup:** No more API secrets to manage for local deployments.
- **Portable Paths:** Uses relative path detection so you can run it from any folder.

---

## 🧪 Included Labs

| Lab App | Category | Purpose |
|---|---|---|
| **DVWA** | Web App | Classic PHP/MySQL vulnerabilities (SQLi, XSS) |
| **Juice Shop** | Web App | Modern JS/Angular app (JWT flaws, NoSQLi) |
| **WebGoat** | Web App | Guided Java EE security lessons |
| **bWAPP** | Web App | 100+ vulnerabilities for broad practice |
| **Hackazon** | Web App | Complex e-commerce logic testing |
| **MySQL / Postgres**| Database | Practice DB exploitation and injection |
| **MongoDB / Redis** | NoSQL | Unauthenticated access & data leakage tests |

---

## 🛠️ Port Reference

- **Dashboard:** `3000`
- **Lab API:** `4000`
- **DVWA:** `8080`
- **Juice Shop:** `3000` (internal)
- **WebGoat:** `8081`
- **phpMyAdmin:** `8084`

---

> [!IMPORTANT]
> **Educational Use Only.**  
> This project is strictly for authorized security testing and learning. Never expose these vulnerable containers to the public internet.

*Maintained by the Security Team · 2026*