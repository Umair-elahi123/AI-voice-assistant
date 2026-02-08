@echo off
echo ========================================
echo   Starting AI Voice Assistant
echo   By Umair Elahi
echo ========================================
echo.

REM -------------------------------
REM Start backend in new window
REM -------------------------------
echo Starting backend server...
start "AI Assistant Backend" cmd /k "cd backend && python main.py"

REM Wait 3 seconds to allow backend to start
timeout /t 3 /nobreak >nul

REM -------------------------------
REM Start frontend in new window
REM -------------------------------
echo Starting frontend...
start "AI Assistant Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Close this window to keep servers running.
echo To stop servers, close the backend and frontend windows.
echo.
pause
