#!/bin/bash

echo "========================================"
echo "  AI Voice Assistant Setup"
echo "  By Umair Elahi"
echo "========================================"
echo ""

# Check Python
echo "[1/4] Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed!"
    echo "Please install Python 3.9+ from https://python.org"
    exit 1
fi
echo "Python found!"

# Check Node.js
echo "[2/4] Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo "Node.js found!"

# Setup Backend
echo "[3/4] Setting up backend..."
cd backend

# Create .env if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Edit backend/.env and add your OpenRouter API key!"
    echo "Get your free API key from: https://openrouter.ai/"
    echo ""
    read -p "Press enter to continue..."
fi

echo "Installing Python dependencies..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Python dependencies"
    exit 1
fi

cd ..

# Setup Frontend
echo "[4/4] Setting up frontend..."
cd frontend

# Create .env.local if not exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local
fi

echo "Installing Node dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Node dependencies"
    exit 1
fi

cd ..

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your OpenRouter API key"
echo "2. Run: ./start.sh"
echo ""