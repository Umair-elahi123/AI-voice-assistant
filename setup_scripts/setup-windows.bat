@echo off
echo ========================================
echo   AI Voice Assistant Setup
echo   By Umair Elahi
echo ========================================
echo.

REM -------------------------------
REM Check Python
REM -------------------------------
echo [1/4] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.9+ from https://python.org
    pause
    exit /b 1
)
echo Python found!

REM -------------------------------
REM Check Node.js
REM -------------------------------
echo [2/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js found!

REM -------------------------------
REM Check for C++ Build Tools
REM -------------------------------
echo [2b/4] Checking for Microsoft C++ Build Tools...
REM cl >nul 2>&1
REM if %errorlevel% neq 0 (
REM     echo WARNING: Microsoft C++ Build Tools not found!
REM    echo chromadb requires a C++ compiler to build native extensions.
REM    echo Please install it from:
REM    echo https://visualstudio.microsoft.com/visual-cpp-build-tools/
REM   echo After installation, restart your PC and re-run this script.
REM    pause
REM    exit /b 1
REM)
REM echo C++ Build Tools found!

REM -------------------------------
REM Setup Backend
REM -------------------------------
echo [3/4] Setting up backend...
cd backend

REM Create .env if not exists
if not exist .env (
    echo Creating .env file...
    type nul > .env
    echo OPENROUTER_API_KEY=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 > .env
    echo.
    echo IMPORTANT: Your OpenRouter API key has been added to backend/.env
)

echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt --default-timeout=100 --trusted-host pypi.org --trusted-host files.pythonhosted.org
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

cd ..

REM -------------------------------
REM Setup Frontend
REM -------------------------------
echo [4/4] Setting up frontend...
cd frontend

REM Create .env.local if not exists
if not exist .env.local (
    echo Creating .env.local...
    type nul > .env.local
)

echo Installing Node dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: start-windows.bat
echo.
pause
