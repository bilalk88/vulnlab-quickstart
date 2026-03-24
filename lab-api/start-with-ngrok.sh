#!/bin/bash
# =============================================================================
# start-with-ngrok.sh
# Starts the VulnLab API server and creates an ngrok HTTPS tunnel.
# Run this on the Docker host before deploying/using the Vercel dashboard.
#
# Usage:
#   chmod +x start-with-ngrok.sh
#   NGROK_AUTHTOKEN=<your_token> ./start-with-ngrok.sh
#
# After startup, copy the printed ngrok URL into:
#   - webapp/.env.local  → NEXT_PUBLIC_LAB_API_URL=<ngrok_url>
#   - Vercel dashboard   → NEXT_PUBLIC_LAB_API_URL env var
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-4000}"
NGROK_AUTHTOKEN="${NGROK_AUTHTOKEN:-}"

# ── Preflight ─────────────────────────────────────────────────────────────────
command -v node  &>/dev/null || { echo "❌ Node.js not found. Install it first."; exit 1; }
command -v ngrok &>/dev/null || { echo "❌ ngrok not found. Install: https://ngrok.com/download"; exit 1; }

if [[ ! -f "$SCRIPT_DIR/.env" ]]; then
  echo "⚠️  No .env found — copying .env.example → .env"
  cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
  echo "   Edit $SCRIPT_DIR/.env before continuing."
fi

# ── Install dependencies if needed ───────────────────────────────────────────
if [[ ! -d "$SCRIPT_DIR/node_modules" ]]; then
  echo "[*] Installing npm dependencies..."
  cd "$SCRIPT_DIR" && npm install
fi

# ── Set ngrok authtoken if provided ──────────────────────────────────────────
if [[ -n "$NGROK_AUTHTOKEN" ]]; then
  ngrok config add-authtoken "$NGROK_AUTHTOKEN"
fi

# ── Start API server in background ───────────────────────────────────────────
echo "[*] Starting VulnLab API server on port $PORT..."
cd "$SCRIPT_DIR"
node server.js &
API_PID=$!
sleep 2

# Verify it started
curl -sf "http://localhost:$PORT/api/health" > /dev/null || {
  echo "❌ API server failed to start. Check node server.js output."
  kill $API_PID 2>/dev/null || true
  exit 1
}
echo "[+] API server running (PID: $API_PID)"

# ── Start ngrok tunnel ────────────────────────────────────────────────────────
echo "[*] Creating ngrok tunnel → http://localhost:$PORT ..."
ngrok http "$PORT" --log=stdout &
NGROK_PID=$!
sleep 3

# Extract public URL from ngrok API
NGROK_URL=$(curl -sf http://127.0.0.1:4040/api/tunnels 2>/dev/null \
  | python3 -c "import sys,json; tunnels=json.load(sys.stdin)['tunnels']; \
    https=[t for t in tunnels if t['proto']=='https']; \
    print(https[0]['public_url'] if https else '')" 2>/dev/null || true)

if [[ -z "$NGROK_URL" ]]; then
  echo "⚠️  Could not auto-detect ngrok URL. Check http://localhost:4040 in your browser."
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ✅  VulnLab API is LIVE at:"
  echo ""
  echo "      $NGROK_URL"
  echo ""
  echo "  Copy this URL and set:"
  echo "    NEXT_PUBLIC_LAB_API_URL=$NGROK_URL"
  echo "  in your Vercel dashboard env vars (or webapp/.env.local)."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
fi

echo "[*] Press Ctrl+C to stop both API server and ngrok."
echo ""

# ── Wait / cleanup ────────────────────────────────────────────────────────────
trap "echo ''; echo 'Stopping...'; kill $API_PID $NGROK_PID 2>/dev/null || true; exit 0" INT TERM

wait $API_PID
