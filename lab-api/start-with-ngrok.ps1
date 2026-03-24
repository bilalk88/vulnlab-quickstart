# start-with-ngrok.ps1
# Starts the VulnLab API server and creates an ngrok HTTPS tunnel on Windows.
#
# Usage:
#   .\start-with-ngrok.ps1
#
# After startup, copy the printed ngrok URL into:
#   - webapp/.env.local  -> NEXT_PUBLIC_LAB_API_URL=<ngrok_url>

$ErrorActionPreference = "Stop"

# Navigate to the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# 1. Preflight Checks
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "X Node.js not found. Install it first." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command "ngrok" -ErrorAction SilentlyContinue)) {
    Write-Host "X ngrok not found. Install from https://ngrok.com/download" -ForegroundColor Red
    Write-Host "Make sure to add ngrok to your PATH or run this from the folder containing ngrok.exe" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "$ScriptDir\.env")) {
    Write-Host "⚠️ No .env found - copying .env.example -> .env" -ForegroundColor Yellow
    Copy-Item "$ScriptDir\.env.example" "$ScriptDir\.env"
}

if (-not (Test-Path "$ScriptDir\node_modules")) {
    Write-Host "[*] Installing npm dependencies..." -ForegroundColor Cyan
    npm install
}

# 2. Get PORT from .env (default 4100)
$PORT = 4100
if (Test-Path "$ScriptDir\.env") {
    $envContent = Get-Content "$ScriptDir\.env"
    foreach ($line in $envContent) {
        if ($line -match "^PORT=(.*)") {
            $PORT = $matches[1]
        }
    }
}

# 3. Clear port if in use
$PortProcess = Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue
if ($PortProcess) {
    Write-Host "[*] Port $PORT is in use. Stopping existing process..." -ForegroundColor Yellow
    Stop-Process -Id $PortProcess.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# 4. Start API Server
Write-Host "[*] Starting VulnLab API server on port $PORT..." -ForegroundColor Cyan
$ApiProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow
Start-Sleep -Seconds 2

try {
    $response = Invoke-WebRequest -Uri "http://localhost:$PORT/api/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "[+] API server running (PID: $($ApiProcess.Id))" -ForegroundColor Green
} catch {
    Write-Host "X API server failed to start." -ForegroundColor Red
    if ($ApiProcess) { Stop-Process -Id $ApiProcess.Id -Force -ErrorAction SilentlyContinue }
    exit 1
}

# 5. Start ngrok
Write-Host "[*] Creating ngrok tunnel -> http://localhost:$PORT ..." -ForegroundColor Cyan
$NgrokProcess = Start-Process -FilePath "ngrok" -ArgumentList "http $PORT" -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 4

# 6. Extract URL via ngrok local API
$NgrokUrl = ""
try {
    $tunnelsResponse = Invoke-WebRequest -Uri "http://127.0.0.1:4040/api/tunnels" -UseBasicParsing -ErrorAction Stop
    $tunnelsData = $tunnelsResponse.Content | ConvertFrom-Json
    foreach ($tunnel in $tunnelsData.tunnels) {
        if ($tunnel.proto -eq "https") {
            $NgrokUrl = $tunnel.public_url
            break
        }
    }
} catch {
    Write-Host "WARNING: Could not auto-detect ngrok URL. Check http://localhost:4040 in your browser." -ForegroundColor Yellow
}

if ($NgrokUrl) {
    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Green
    Write-Host "  [SUCCESS] VulnLab API is LIVE at:" -ForegroundColor Green
    Write-Host ""
    Write-Host "      $NgrokUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Copy this URL and set:"
    Write-Host "    NEXT_PUBLIC_LAB_API_URL=$NgrokUrl"
    Write-Host '  in your Vercel dashboard env vars or webapp/.env.local'
    Write-Host "=======================================================" -ForegroundColor Green
    Write-Host ""
}

Write-Host "[*] Tunnel is active. Press Ctrl+C in this window to stop both API server and ngrok." -ForegroundColor Yellow

try {
    Wait-Process -Id $ApiProcess.Id
} finally {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    if ($ApiProcess) { Stop-Process -Id $ApiProcess.Id -Force -ErrorAction SilentlyContinue }
    if ($NgrokProcess) { Stop-Process -Id $NgrokProcess.Id -Force -ErrorAction SilentlyContinue }
}
