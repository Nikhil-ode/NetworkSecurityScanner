@echo off
cd /d "C:\Project-Network Security Scanner"

echo ========================================
echo Network Security Scanner - Starting
echo ========================================

echo Starting Backend (Daphne HTTPS 8443)...
start "Backend" /min cmd /c "cd /d "C:\Project-Network Security Scanner" && venv\Scripts\python.exe -m daphne -e "ssl:8443:privateKey=cert.key:certKey=cert.pem" config.asgi:application"

echo Starting Frontend (Node HTTPS 3001)...
start "Frontend" /min cmd /c "cd /d "C:\Project-Network Security Scanner\NetworkSecurityScanner\frontend" && node https-frontend-server.js"

echo ========================================
echo Backend:  https://localhost:8443
echo Frontend: https://localhost:3001
echo ========================================
echo Both servers are starting in background windows.
echo Close the background windows to stop the servers.
echo ========================================
pause