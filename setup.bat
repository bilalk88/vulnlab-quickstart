@echo off
title VulnLab Control Center - Full Setup
color 0B

echo.
echo  ===================================================
echo   VulnLab Control Center - Full Setup
echo  ===================================================
echo.

echo [1/7] Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo        [FAIL] Node.js is not installed.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo        [FAIL] npm is not installed.
    pause
    exit /b 1
)

set DOCKER_AVAILABLE=0
where docker >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set DOCKER_AVAILABLE=1
    echo        Docker is available.
)

echo [2/7] Creating environment config files...
if not exist "%~dp0lab-api\.env" (
    copy "%~dp0lab-api\.env.example" "%~dp0lab-api\.env" >nul
)

echo [3/7] Installing Lab API dependencies...
cd /d "%~dp0lab-api"
call npm install --silent

echo [4/7] Installing Web Dashboard dependencies...
cd /d "%~dp0webapp"
call npm install --silent

if "%DOCKER_AVAILABLE%"=="1" (
    echo [5/7] Pulling and starting Docker lab containers...
    docker network create lab_net >nul 2>&1
    cd /d "%~dp0"
    docker compose up -d
) else (
    echo [5/7] [WARN] Docker is missing! Docker is required to run the vulnerable containers.
    echo        Please install Docker. Skipping container initialization...
)

echo [6/7] Starting Lab API server...
start "VulnLab API Server" /D "%~dp0lab-api" cmd /k node server.js

echo [7/7] Starting Web Dashboard...
start "VulnLab Dashboard" /D "%~dp0webapp" cmd /k npm run dev

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo  ===================================================
echo   Setup complete! Close this window.
echo  ===================================================
pause
