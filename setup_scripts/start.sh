#!/bin/bash

echo "========================================"
echo "  Starting AI Voice Assistant"
echo "  By Umair Elahi"
echo "========================================"
echo ""

# Check if tmux is available
if command -v tmux &> /dev/null; then
    echo "Using tmux for session management..."
    
    # Create new tmux session
    tmux new-session -d -s ai-assistant
    
    # Start backend in first pane
    tmux send-keys -t ai-assistant "cd backend && python3 main.py" C-m
    
    # Split window and start frontend
    tmux split-window -h -t ai-assistant
    tmux send-keys -t ai-assistant "cd frontend && npm run dev" C-m
    
    echo ""
    echo "Servers started in tmux session!"
    echo ""
    echo "To attach to session: tmux attach -t ai-assistant"
    echo "To detach: Ctrl+B then D"
    echo "To stop servers: tmux kill-session -t ai-assistant"
    echo ""
    
    # Attach to session
    tmux attach -t ai-assistant
else
    echo "Starting servers..."
    echo ""
    echo "Backend:  http://localhost:8000"
    echo "Frontend: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop"
    echo ""
    
    # Start backend in background
    cd backend
    python3 main.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait a bit
    sleep 3
    
    # Start frontend
    cd frontend
    npm run dev
    
    # Cleanup
    kill $BACKEND_PID
fi