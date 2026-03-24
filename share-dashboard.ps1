# share-dashboard.ps1
# Starts the entire VulnLab stack AND exposes the Dashboard UI via ngrok.
# Usage: .\share-dashboard.ps1

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# ── 1. Stop Existing Processes on 4100 and 3000 ──
$P4100 = Get-NetTCPConnection -LocalPort 4100 -State Listen -ErrorAction SilentlyContinue
if ($P4100) { Stop-Process -Id $P4100.OwningProcess -Force -ErrorAction SilentlyContinue }

$P3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($P3000) { Stop-Process -Id $P3000.OwningProcess -Force -ErrorAction SilentlyContinue }

# ── 2. Start Lab API (Port 4100) ──
Write-Host "[1/3] Starting backend Lab API (Port 4100)..." -ForegroundColor Cyan
Set-Location "$ScriptDir\lab-api"
$ApiProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow
Start-Sleep -Seconds 2

# ── 3. Start Next.js Web UI (Port 3000) ──
Write-Host "[2/3] Starting Next.js Web Dashboard (Port 3000)..." -ForegroundColor Cyan
Set-Location "$ScriptDir\webapp"
$WebProcess = Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 6 # Give Next.js time to compile

# ── 4. Start ngrok tunnel for Port 3000 ──
Write-Host "[3/3] Creating ngrok tunnel to the Dashboard..." -ForegroundColor Cyan
$NgrokProcess = Start-Process -FilePath "ngrok" -ArgumentList "http 3000" -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 4

# ── 5. Fetch ngrok URL ──
$NgrokUrl = ""
try {
    $tunnelsResponse = Invoke-WebRequest -Uri "http://127.0.0.1:4040/api/tunnels" -UseBasicParsing -ErrorAction SilentlyContinue
    $tunnelsData = $tunnelsResponse.Content | ConvertFrom-Json
    foreach ($tunnel in $tunnelsData.tunnels) {
        if ($tunnel.proto -eq "https") {
            $NgrokUrl = $tunnel.public_url
            break
        }
    }
} catch {
    Write-Host "WARNING: Could not automatically grab ngrok URL. Check http://127.0.0.1:4040 manually." -ForegroundColor Yellow
}

if ($NgrokUrl) {
    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Green
    Write-Host "  [SUCCESS] VulnLab Dashboard is LIVE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Send this link to your friend so they can access the UI:"
    Write-Host "  ==> $NgrokUrl <==" -ForegroundColor Cyan
    Write-Host "=======================================================" -ForegroundColor Green
    Write-Host ""
}

Write-Host "⚠️  IMPORTANT LIMITATION:" -ForegroundColor Red
Write-Host "Your friend can use the dashboard to start/stop the labs and view logs." -ForegroundColor Gray
Write-Host "HOWEVER, because free ngrok only forwards one port, they cannot actually visit the underlying lab apps (like DVWA on port 8080) if they are outside your network." -ForegroundColor Gray
Write-Host ""

Write-Host "[*] System running. Press Ctrl+C in this window to shut down the tunnel and servers." -ForegroundColor Yellow

try {
    Wait-Process -Id $ApiProcess.Id
} finally {
    Write-Host "Shutting down servers and tunnels..." -ForegroundColor Yellow
    if ($ApiProcess) { Stop-Process -Id $ApiProcess.Id -Force -ErrorAction SilentlyContinue }
    if ($WebProcess) { Stop-Process -Id $WebProcess.Id -Force -ErrorAction SilentlyContinue }
    if ($NgrokProcess) { Stop-Process -Id $NgrokProcess.Id -Force -ErrorAction SilentlyContinue }
}
