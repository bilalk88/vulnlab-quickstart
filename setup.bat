@echo off
REM ============================================================================
REM  setup.bat — VulnLab Control Center Full Setup (Windows)
REM  First-time setup: installs deps, creates .env, pulls Docker images,
REM  starts lab containers, then launches the dashboard.
REM  Usage: Double-click this file or run from Command Prompt.
REM ============================================================================

title VulnLab Control Center — Full Setup
color 0B

echo.
echo  ===================================================
echo   VulnLab Control Center — Full Setup
echo  ===================================================
echo.

REM ── Check prerequisites ───────────────────────────────────────────────────
echo [1/7] Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo        [FAIL] Node.js is not installed.
    echo        Download from: https://nodejs.org
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo        Node.js %%i ... OK
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo        [FAIL] npm is not installed.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo        npm %%i ... OK
)

where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo        [WARN] Docker is not installed. Lab containers will not work.
    echo        Download from: https://www.docker.com/products/docker-desktop/
    echo.
    set DOCKER_AVAILABLE=0
) else (
    for /f "tokens=*" %%i in ('docker --version') do echo        %%i ... OK
    set DOCKER_AVAILABLE=1
)

echo.

REM ── Create .env files ─────────────────────────────────────────────────────
echo [2/7] Creating environment config files...

cd /d "%~dp0lab-api"
if not exist ".env" (
    copy .env.example .env >nul
    echo        Created lab-api/.env
) else (
    echo        lab-api/.env already exists. Skipping.
)

cd /d "%~dp0"
echo.

REM ── Install Lab API dependencies ──────────────────────────────────────────
echo [3/7] Installing Lab API dependencies...
cd /d "%~dp0lab-api"
call npm install
echo.

REM ── Install Web Dashboard dependencies ────────────────────────────────────
echo [4/7] Installing Web Dashboard dependencies...
cd /d "%~dp0webapp"
call npm install
echo.

REM ── Pull and start Docker containers ──────────────────────────────────────
if "%DOCKER_AVAILABLE%"=="1" (
    echo [5/7] Pulling and starting Docker lab containers...
    echo        This may take several minutes on first run.
    cd /d "%~dp0"
    docker compose up -d
    echo.
) else (
    echo [5/7] Skipping Docker containers (Docker not available).
    echo.
)

REM ── Start Lab API ─────────────────────────────────────────────────────────
echo [6/7] Starting Lab API server...
cd /d "%~dp0"
start "VulnLab API Server" cmd /k "cd /d "%~dp0lab-api" && node server.js"
echo.

REM ── Start Web Dashboard ───────────────────────────────────────────────────
echo [7/7] Starting Web Dashboard...
start "VulnLab Dashboard" cmd /k "cd /d "%~dp0webapp" && npm run dev"
echo.

REM ── Open the browser ──────────────────────────────────────────────────────
timeout /t 8 /nobreak >nul
start http://localhost:3000

echo  ===================================================
echo   Setup complete!
echo.
echo   Dashboard : http://localhost:3000
echo   Lab API   : http://localhost:4100
echo  ===================================================
echo.
pause
