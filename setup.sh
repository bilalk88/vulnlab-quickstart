#!/usr/bin/env bash
# =============================================================================
#  setup.sh — VulnLab Control Center Full Setup
#  Supports: Linux, macOS, Git Bash on Windows
#
#  Usage:
#    chmod +x setup.sh && ./setup.sh
# =============================================================================

# Do NOT use set -e — we want the script to continue even when
# Docker is offline or unavailable.

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ── Detect OS ─────────────────────────────────────────────────────────────────
OS_TYPE="linux"
case "$(uname -s)" in
    Darwin*)  OS_TYPE="mac"     ;;
    MINGW*|MSYS*|CYGWIN*) OS_TYPE="windows" ;;
    Linux*)   OS_TYPE="linux"   ;;
esac

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo -e "${CYAN}  ===================================================${NC}"
echo -e "${CYAN}   VulnLab Control Center - Full Setup${NC}"
echo -e "${CYAN}   Platform: $OS_TYPE${NC}"
echo -e "${CYAN}  ===================================================${NC}"
echo ""

# ── 1. Check prerequisites ─────────────────────────────────────────────────────
echo "[1/7] Checking prerequisites..."

if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}  [FAIL] Node.js not found. Install from: https://nodejs.org${NC}"
    exit 1
fi
echo "       Node.js $(node --version) ... OK"

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}  [FAIL] npm not found. Install Node.js from: https://nodejs.org${NC}"
    exit 1
fi
echo "       npm $(npm --version) ... OK"

DOCKER_AVAILABLE=0
if command -v docker >/dev/null 2>&1; then
    # Also verify the daemon is actually running (not just installed)
    if docker info >/dev/null 2>&1; then
        DOCKER_AVAILABLE=1
        echo "       $(docker --version) ... OK"
    else
        echo -e "${YELLOW}  [WARN] Docker is installed but the daemon is not running.${NC}"
        echo -e "${YELLOW}         Start Docker Desktop and re-run to use lab containers.${NC}"
    fi
else
    echo -e "${YELLOW}  [WARN] Docker not found.${NC}"
    echo -e "${YELLOW}         Install from: https://www.docker.com/products/docker-desktop/${NC}"
fi

echo ""

# ── 2. Create .env files ───────────────────────────────────────────────────────
echo "[2/7] Creating environment config files..."

LAB_ENV="$ROOT/lab-api/.env"
LAB_ENV_EXAMPLE="$ROOT/lab-api/.env.example"
if [ ! -f "$LAB_ENV" ]; then
    if [ -f "$LAB_ENV_EXAMPLE" ]; then
        cp "$LAB_ENV_EXAMPLE" "$LAB_ENV"
    else
        printf "# Auto-generated\nPORT=4100\nLAB_DIR=\n" > "$LAB_ENV"
    fi
    echo "       Created lab-api/.env"
else
    echo "       lab-api/.env already exists. Skipping."
fi

WEBAPP_ENV="$ROOT/webapp/.env.local"
if [ ! -f "$WEBAPP_ENV" ]; then
    printf "NEXT_PUBLIC_LAB_API_URL=\nLAB_API_PORT=4100\n" > "$WEBAPP_ENV"
    echo "       Created webapp/.env.local"
else
    echo "       webapp/.env.local already exists. Skipping."
fi
echo ""

# ── 3. Install Lab API dependencies ───────────────────────────────────────────
echo "[3/7] Installing Lab API dependencies..."
cd "$ROOT/lab-api" || exit 1
npm install --silent
echo "       Done."
echo ""

# ── 4. Install Web Dashboard dependencies ─────────────────────────────────────
echo "[4/7] Installing Web Dashboard dependencies..."
cd "$ROOT/webapp" || exit 1
npm install --silent
echo "       Done."
echo ""

# ── 5. Docker containers ───────────────────────────────────────────────────────
if [ "$DOCKER_AVAILABLE" -eq 1 ]; then
    echo "[5/7] Starting Docker lab containers..."
    # Create the shared Docker network (ignore error if already exists)
    docker network create lab_net 2>/dev/null || true

    cd "$ROOT" || exit 1
    # Try modern plugin syntax, fall back to legacy standalone binary
    if docker compose version >/dev/null 2>&1; then
        docker compose up -d 2>&1 || echo -e "${YELLOW}  [WARN] Some containers failed to start. Check Docker logs.${NC}"
    elif command -v docker-compose >/dev/null 2>&1; then
        docker-compose up -d 2>&1 || echo -e "${YELLOW}  [WARN] Some containers failed to start. Check Docker logs.${NC}"
    else
        echo -e "${YELLOW}  [WARN] Neither 'docker compose' nor 'docker-compose' found.${NC}"
    fi
else
    echo -e "${YELLOW}[5/7] Skipping Docker containers (Docker unavailable).${NC}"
    echo -e "${YELLOW}       Install & start Docker Desktop to use lab containers.${NC}"
fi
echo ""

# ── 6. Start Lab API server ────────────────────────────────────────────────────
echo "[6/7] Starting Lab API server (port 4100)..."
cd "$ROOT/lab-api" || exit 1

if [ "$OS_TYPE" = "mac" ]; then
    # macOS: open a new Terminal window
    osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT/lab-api' && node server.js\"" 2>/dev/null || {
        node server.js &
        LAB_API_PID=$!
    }
elif [ "$OS_TYPE" = "windows" ]; then
    # Git Bash on Windows: use start cmd
    cmd.exe /c "start \"VulnLab API\" cmd /k \"cd /d $(cygpath -w "$ROOT/lab-api") && node server.js\"" 2>/dev/null || {
        node server.js &
        LAB_API_PID=$!
    }
else
    # Linux: try common terminal emulators, fall back to background process
    if command -v gnome-terminal >/dev/null 2>&1; then
        gnome-terminal -- bash -c "cd '$ROOT/lab-api' && node server.js; exec bash" 2>/dev/null &
    elif command -v xterm >/dev/null 2>&1; then
        xterm -title "VulnLab API" -e "cd '$ROOT/lab-api' && node server.js" &
    else
        node server.js &
        LAB_API_PID=$!
    fi
fi

sleep 2
echo "       Lab API starting on http://localhost:4100"
echo ""

# ── 7. Start Web Dashboard ─────────────────────────────────────────────────────
echo "[7/7] Starting Web Dashboard (port 3000)..."
cd "$ROOT/webapp" || exit 1

if [ "$OS_TYPE" = "mac" ]; then
    osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT/webapp' && npm run dev\"" 2>/dev/null || {
        npm run dev &
        WEBAPP_PID=$!
    }
elif [ "$OS_TYPE" = "windows" ]; then
    cmd.exe /c "start \"VulnLab Dashboard\" cmd /k \"cd /d $(cygpath -w "$ROOT/webapp") && npm run dev\"" 2>/dev/null || {
        npm run dev &
        WEBAPP_PID=$!
    }
else
    if command -v gnome-terminal >/dev/null 2>&1; then
        gnome-terminal -- bash -c "cd '$ROOT/webapp' && npm run dev; exec bash" 2>/dev/null &
    elif command -v xterm >/dev/null 2>&1; then
        xterm -title "VulnLab Dashboard" -e "cd '$ROOT/webapp' && npm run dev" &
    else
        npm run dev &
        WEBAPP_PID=$!
    fi
fi

sleep 4
echo ""

# ── Open browser ───────────────────────────────────────────────────────────────
echo "Opening browser..."
if [ "$OS_TYPE" = "mac" ]; then
    open "http://localhost:3000" 2>/dev/null || true
elif [ "$OS_TYPE" = "windows" ]; then
    cmd.exe /c "start http://localhost:3000" 2>/dev/null || true
else
    xdg-open "http://localhost:3000" 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}  ===================================================${NC}"
echo -e "${GREEN}   Setup complete!${NC}"
echo -e "${GREEN}${NC}"
echo -e "${GREEN}   Dashboard : http://localhost:3000${NC}"
echo -e "${GREEN}   Lab API   : http://localhost:4100${NC}"
echo -e "${GREEN}${NC}"
echo -e "${GREEN}   Servers are running in separate windows.${NC}"
echo -e "${GREEN}   Close this window or press Ctrl+C to exit.${NC}"
echo -e "${GREEN}  ===================================================${NC}"
echo ""

# If we have PIDs from background processes (headless mode), wait for them
if [ -n "${LAB_API_PID:-}" ] && [ -n "${WEBAPP_PID:-}" ]; then
    echo "   Running in headless mode. Press Ctrl+C to stop servers."
    wait "$LAB_API_PID" "$WEBAPP_PID"
fi
