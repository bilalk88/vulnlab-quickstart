# VulnLab Dashboard — Walkthrough & Deployment Guide

## What Was Built

A full-stack web dashboard for managing vulnerable pentest lab containers, built on top of the existing [pentest-lab-setup.sh](file:///c:/Users/khanb/OneDrive/Documents/GitHub/vulnlab-quickstart/pentest-lab-setup.sh) script.

### Architecture

```
Team Browser → Vercel (Next.js UI) → ngrok tunnel → Lab API Server → Docker Compose
```

---

## Project Structure

```
vulnlab-quickstart/
├── pentest-lab-setup.sh        ← original setup script (unchanged)
├── docker-compose.yml          ← committed compose file (used by lab-api)
├── lab-api/
│   ├── server.js               ← Express.js REST + SSE API server
│   ├── package.json
│   ├── .env.example
│   └── start-with-ngrok.sh     ← one-shot launcher for API + ngrok tunnel
└── webapp/                     ← Next.js 14 app (deployed to Vercel)
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx              ← Dashboard with lab cards grid
    │   │   ├── tools/page.tsx        ← Security tools reference
    │   │   └── proxy-guide/page.tsx  ← Burp/ZAP proxy setup guide
    │   ├── components/
    │   │   ├── NavBar.tsx            ← Sticky navbar
    │   │   ├── LabCard.tsx           ← Lab card with start/stop/restart/logs
    │   │   ├── StatusBadge.tsx       ← Animated status indicator
    │   │   └── LogViewer.tsx         ← SSE live log terminal drawer
    │   └── lib/
    │       ├── labs.ts               ← Lab metadata + TypeScript types
    │       └── api.ts                ← API client (calls lab-api over ngrok)
    ├── .env.local.example
    └── vercel.json
```

---

## Dashboard Features

| Feature | Description |
|---|---|
| **Lab Cards Grid** | 10 labs shown as cards with status, tags, creds |
| **Start / Stop / Restart** | One-click Docker container control per lab |
| **Start All / Stop All** | Bulk actions in toolbar |
| **Live Logs** | SSE-streamed terminal drawer per container |
| **Status Badges** | Animated: Running 🟢 / Stopped ⚫ / Restarting 🟡 / Exited 🔴 |
| **Category Filter** | Filter by Web App / Database |
| **Stats Hero** | Live count of running/stopped/unknown labs |
| **API Health Indicator** | Shows if lab-api is reachable from Vercel |
| **Tools Reference** | All Go/Python/system tools installed by setup script |
| **Proxy Guide** | Burp Suite + ZAP setup steps with port conflict warnings |

---

## Build Verification

```
✓ Next.js build: exit code 0
✓ Routes compiled: / (dashboard), /tools, /proxy-guide
✓ TypeScript: no errors
✓ heroicons installed
✓ Browser walkthrough: all 3 pages load correctly
✓ API-unreachable warning shows as designed (expected when lab-api not running)
```

![VulnLab Dashboard Recording](file:///C:/Users/khanb/.gemini/antigravity/brain/a297e6ba-162f-46a6-b4c3-2aa3489850bf/vulnlab_dashboard_demo_1774350630184.webp)

---

## Deployment Guide

### Step 1 — Prepare the Docker host machine (Linux)

The lab machine must be a Linux box with Docker installed. This can be:
- Your own Linux laptop/desktop
- A cloud VPS (DigitalOcean, AWS EC2, etc.)
- A local VM

```bash
# Clone the repo
git clone https://github.com/<your-username>/vulnlab-quickstart.git
cd vulnlab-quickstart

# Copy the docker-compose.yml to ~/pentest-lab
mkdir -p ~/pentest-lab
cp docker-compose.yml ~/pentest-lab/

# Install Node.js (if not present)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install ngrok
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install -y ngrok
```

### Step 2 — Configure the Lab API Server

```bash
cd lab-api
npm install
cp .env.example .env
# Edit .env:
#   API_SECRET=<strong_random_string>   ← choose something random!
#   LAB_DIR=/root/pentest-lab           ← or wherever docker-compose.yml lives
nano .env
```

### Step 3 — Start the API server + ngrok tunnel

```bash
NGROK_AUTHTOKEN=<your_ngrok_token> bash start-with-ngrok.sh
```

The script will print:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅  VulnLab API is LIVE at:
      https://abc123.ngrok-free.app
  Set: NEXT_PUBLIC_LAB_API_URL=https://abc123.ngrok-free.app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Copy the ngrok URL — needed for the next step.

### Step 4 — Deploy the webapp to Vercel

```bash
cd webapp

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

During deploy, set these environment variables in the Vercel dashboard (or with `vercel env add`):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_LAB_API_URL` | `https://abc123.ngrok-free.app` (your ngrok URL) |
| `NEXT_PUBLIC_API_SECRET` | Same value as `API_SECRET` in `lab-api/.env` |

### Step 5 — Share the Vercel URL

Give team members the Vercel URL. They can:
- View live container status
- Start/stop/restart any lab with one click
- Stream live container logs in-browser
- Reference tools and proxy setup guides

---

## Notes

> **ngrok free tier**: The public URL changes every time the tunnel restarts.  
> Update `NEXT_PUBLIC_LAB_API_URL` in Vercel when this happens.  
> Upgrade to ngrok paid plan for a static domain to avoid this.

> **Security**: Keep `API_SECRET` strong and secret. Do not commit `.env` files.
> Consider adding IP allowlisting in production.
