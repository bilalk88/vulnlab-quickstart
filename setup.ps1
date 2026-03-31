# ============================================================================
#  setup.ps1 — VulnLab Control Center Full Setup (PowerShell)
#  First-time setup: installs deps, creates .env, pulls Docker images,
#  starts lab containers, then launches the dashboard.
#
#  Usage: PowerShell -ExecutionPolicy Bypass -File .\setup.ps1
# ============================================================================

$Host.UI.RawUI.WindowTitle = "VulnLab Control Center — Setup"

Write-Host ""
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host "   VulnLab Control Center — Full Setup" -ForegroundColor Cyan
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host ""

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Definition

# ── 1. Check prerequisites ─────────────────────────────────────────────────
Write-Host "[1/7] Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = $null
try { $nodeVersion = (node --version 2>$null) } catch {}
if ($nodeVersion) {
    Write-Host "       Node.js $nodeVersion ... OK" -ForegroundColor Green
} else {
    Write-Host "       [FAIL] Node.js is not installed." -ForegroundColor Red
    Write-Host "       Download from: https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$npmVersion = $null
try { $npmVersion = (npm --version 2>$null) } catch {}
if ($npmVersion) {
    Write-Host "       npm $npmVersion ... OK" -ForegroundColor Green
} else {
    Write-Host "       [FAIL] npm is not installed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$dockerAvailable = $false
try {
    $dockerVersion = (docker --version 2>$null)
    if ($dockerVersion) {
        Write-Host "       $dockerVersion ... OK" -ForegroundColor Green
        $dockerAvailable = $true
    }
} catch {}
if (-not $dockerAvailable) {
    Write-Host "       [WARN] Docker is not installed. Lab containers will not work." -ForegroundColor Yellow
    Write-Host "       Download from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
}

Write-Host ""

# ── 2. Create .env files ───────────────────────────────────────────────────
Write-Host "[2/7] Creating environment config files..." -ForegroundColor Yellow

$envFile = Join-Path $ROOT "lab-api\.env"
$envExample = Join-Path $ROOT "lab-api\.env.example"
if (-not (Test-Path $envFile)) {
    Copy-Item $envExample $envFile
    Write-Host "       Created lab-api/.env" -ForegroundColor Green
} else {
    Write-Host "       lab-api/.env already exists. Skipping." -ForegroundColor Gray
}

Write-Host ""

# ── 3. Install Lab API dependencies ────────────────────────────────────────
Write-Host "[3/7] Installing Lab API dependencies..." -ForegroundColor Yellow
Set-Location (Join-Path $ROOT "lab-api")
npm install
Write-Host ""

# ── 4. Install Web Dashboard dependencies ──────────────────────────────────
Write-Host "[4/7] Installing Web Dashboard dependencies..." -ForegroundColor Yellow
Set-Location (Join-Path $ROOT "webapp")
npm install
Write-Host ""

# ── 5. Pull and start Docker containers ────────────────────────────────────
if ($dockerAvailable) {
    Write-Host "[5/7] Pulling and starting Docker lab containers..." -ForegroundColor Yellow
    Write-Host "       This may take several minutes on first run." -ForegroundColor Gray
    Set-Location $ROOT
    docker compose up -d
    Write-Host ""
} else {
    Write-Host "[5/7] Skipping Docker containers (Docker not available)." -ForegroundColor Gray
    Write-Host ""
}

# ── 6. Start Lab API ──────────────────────────────────────────────────────
Write-Host "[6/7] Starting Lab API server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$(Join-Path $ROOT 'lab-api')`" && node server.js" -WindowStyle Normal
Write-Host ""

# ── 7. Start Web Dashboard ────────────────────────────────────────────────
Write-Host "[7/7] Starting Web Dashboard..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$(Join-Path $ROOT 'webapp')`" && npm run dev" -WindowStyle Normal
Write-Host ""

# ── Open browser ──────────────────────────────────────────────────────────
Start-Sleep -Seconds 8
Start-Process "http://localhost:3000"

Write-Host "  ===================================================" -ForegroundColor Green
Write-Host "   Setup complete!" -ForegroundColor Green
Write-Host "" -ForegroundColor Green
Write-Host "   Dashboard : http://localhost:3000" -ForegroundColor Green
Write-Host "   Lab API   : http://localhost:4100" -ForegroundColor Green
Write-Host "  ===================================================" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to close this window"
