@echo off
echo Starting Lab API...
cd lab-api
start "Lab API" cmd /c "title Lab API & npm run dev || node server.js"
cd ..

echo Starting WebApp...
cd webapp
start "WebApp" cmd /c "title WebApp & npm run dev"
cd ..

echo =======================================================
echo Started both Lab API and WebApp in separate windows!
echo - WebApp running on http://localhost:3000
echo - Lab API running on backend port
echo.
echo You can close this window now. The apps are running in the new windows.
echo =======================================================
