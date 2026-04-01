$ErrorActionPreference = "Continue"

$Host.UI.RawUI.WindowTitle = "VulnLab Control Center - Setup"

Write-Host ""
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host "   VulnLab Control Center - Full Setup" -ForegroundColor Cyan
Write-Host "  ===================================================" -ForegroundColor Cyan
Write-Host ""

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "[1/7] Checking prerequisites..." -ForegroundColor Yellow
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) { Write-Host "Node.js not installed"; exit 1 }
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) { Write-Host "npm not installed"; exit 1 }

$dockerAvailable = $false
if (Get-Command "docker" -ErrorAction SilentlyContinue) { $dockerAvailable = $true }

Write-Host "[2/7] Configs..." -ForegroundColor Yellow
$envFile = Join-Path $ROOT "lab-api\.env"
if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $ROOT "lab-api\.env.example") $envFile -ErrorAction SilentlyContinue
}

Write-Host "[3/7] Installing Lab API deps..." -ForegroundColor Yellow
Set-Location (Join-Path $ROOT "lab-api")
npm install --silent

Write-Host "[4/7] Installing Webapp deps..." -ForegroundColor Yellow
Set-Location (Join-Path $ROOT "webapp")
npm install --silent

if ($dockerAvailable) {
    Write-Host "[5/7] Starting Docker containers..." -ForegroundColor Yellow
    docker network create lab_net 2>$null
    Set-Location $ROOT
    docker compose up -d
} else {
    Write-Host "[5/7] [WARN] Docker is missing! Docker is required to run the vulnerable containers." -ForegroundColor Red
    Write-Host "       Please install Docker. Skipping container initialization..." -ForegroundColor Yellow
}

Write-Host "[6/7] Starting Lab API server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k node server.js" -WorkingDirectory "$ROOT\lab-api"

Write-Host "[7/7] Starting Web Dashboard..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm run dev" -WorkingDirectory "$ROOT\webapp"

Start-Sleep -Seconds 5
Start-Process "http://localhost:3000" -ErrorAction SilentlyContinue

Write-Host "  ===================================================" -ForegroundColor Green
Write-Host "   Setup complete! Servers running in new windows." -ForegroundColor Green
Write-Host "  ===================================================" -ForegroundColor Green
Read-Host "Press Enter to exit"
