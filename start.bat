@echo off
REM ============================================================================
REM  start.bat — VulnLab Control Center Quick Launcher (Windows)
REM  Starts both the Lab API server and the Web Dashboard in parallel.
REM  Usage: Double-click this file or run from Command Prompt.
REM ============================================================================

title VulnLab Control Center — Launcher
color 0A

echo.
echo  ===================================================
echo   VulnLab Control Center — Quick Start
echo  ===================================================
echo.

REM ── Check prerequisites ───────────────────────────────────────────────────
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed. Download it from https://nodejs.org
    pause
    exit /b 1
)

where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Docker is not installed. Labs will not start without Docker Desktop.
    echo           Download it from https://www.docker.com/products/docker-desktop/
    echo.
)

REM ── Install dependencies if needed ────────────────────────────────────────
echo [1/4] Installing Lab API dependencies...
cd /d "%~dp0lab-api"
if not exist "node_modules" (
    call npm install
) else (
    echo       Already installed. Skipping.
)

echo [2/4] Installing Web Dashboard dependencies...
cd /d "%~dp0webapp"
if not exist "node_modules" (
    call npm install
) else (
    echo       Already installed. Skipping.
)

REM ── Copy .env if missing ──────────────────────────────────────────────────
cd /d "%~dp0lab-api"
if not exist ".env" (
    echo [3/4] Creating .env from .env.example...
    copy .env.example .env >nul
) else (
    echo [3/4] .env already exists. Skipping.
)

REM ── Launch both servers ───────────────────────────────────────────────────
echo [4/4] Starting servers...
echo.
echo       Lab API   : http://localhost:4100
echo       Dashboard : http://localhost:3000
echo.
echo  Press Ctrl+C in either window to stop.
echo  ===================================================
echo.

cd /d "%~dp0"

REM Start Lab API in a new window
start "VulnLab API Server" cmd /k "cd /d "%~dp0lab-api" && node server.js"

REM Start Web Dashboard in a new window
start "VulnLab Dashboard" cmd /k "cd /d "%~dp0webapp" && npm run dev"

REM Wait a moment then open the browser
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo  Both servers are running in separate windows.
echo  Close this window or press any key to exit this launcher.
echo.
pause
