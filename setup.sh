#!/bin/bash
# ============================================================================
#  setup.sh — VulnLab Control Center Full Setup (Linux / macOS)
#  First-time setup: installs deps, creates .env, pulls Docker images,
#  starts lab containers, then launches the dashboard.
#
#  Usage: chmod +x setup.sh && ./setup.sh
# ============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${CYAN}[*]${NC} $1"; }
success() { echo -e "${GREEN}[+]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
fail()    { echo -e "${RED}[-]${NC} $1"; exit 1; }

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo -e "${CYAN}  ===================================================${NC}"
echo -e "${CYAN}   VulnLab Control Center — Full Setup${NC}"
echo -e "${CYAN}  ===================================================${NC}"
echo ""

# ── 1. Check prerequisites ─────────────────────────────────────────────────
info "[1/7] Checking prerequisites..."

command -v node &>/dev/null || fail "Node.js is not installed. Download from: https://nodejs.org"
success "       Node.js $(node --version) ... OK"

command -v npm &>/dev/null || fail "npm is not installed."
success "       npm $(npm --version) ... OK"

DOCKER_AVAILABLE=0
if command -v docker &>/dev/null; then
    success "       $(docker --version) ... OK"
    DOCKER_AVAILABLE=1
else
    warn "       Docker is not installed. Lab containers will not work."
    warn "       Download from: https://docs.docker.com/engine/install/"
fi

echo ""

# ── 2. Create .env files ───────────────────────────────────────────────────
info "[2/7] Creating environment config files..."

if [ ! -f "$ROOT/lab-api/.env" ]; then
    cp "$ROOT/lab-api/.env.example" "$ROOT/lab-api/.env"
    success "       Created lab-api/.env"
else
    info "       lab-api/.env already exists. Skipping."
fi

echo ""

# ── 3. Install Lab API dependencies ────────────────────────────────────────
info "[3/7] Installing Lab API dependencies..."
cd "$ROOT/lab-api"
npm install
echo ""

# ── 4. Install Web Dashboard dependencies ──────────────────────────────────
info "[4/7] Installing Web Dashboard dependencies..."
cd "$ROOT/webapp"
npm install
echo ""

# ── 5. Pull and start Docker containers ────────────────────────────────────
if [ "$DOCKER_AVAILABLE" -eq 1 ]; then
    info "[5/7] Pulling and starting Docker lab containers..."
    info "       This may take several minutes on first run."
    cd "$ROOT"
    docker compose up -d || docker-compose up -d
    echo ""
else
    info "[5/7] Skipping Docker containers (Docker not available)."
    echo ""
fi

# ── 6. Start Lab API ──────────────────────────────────────────────────────
info "[6/7] Starting Lab API server..."
cd "$ROOT/lab-api"
node server.js &
LAB_API_PID=$!
echo ""

# ── 7. Start Web Dashboard ────────────────────────────────────────────────
info "[7/7] Starting Web Dashboard..."
cd "$ROOT/webapp"
npm run dev &
WEBAPP_PID=$!
echo ""

# ── Open browser (best-effort) ───────────────────────────────────────────
sleep 5
if command -v xdg-open &>/dev/null; then
    xdg-open "http://localhost:3000" 2>/dev/null || true
elif command -v open &>/dev/null; then
    open "http://localhost:3000" 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}  ===================================================${NC}"
echo -e "${GREEN}   Setup complete!${NC}"
echo -e "${GREEN}${NC}"
echo -e "${GREEN}   Dashboard : http://localhost:3000${NC}"
echo -e "${GREEN}   Lab API   : http://localhost:4100${NC}"
echo -e "${GREEN}  ===================================================${NC}"
echo ""
echo "  Press Ctrl+C to stop both servers."
echo ""

# Wait for background processes
wait $LAB_API_PID $WEBAPP_PID
