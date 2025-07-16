#!/bin/bash

# Rutgers Dashboard Development Script
# Usage: ./dev.sh [frontend|backend|both]

echo "🚀 Rutgers Dashboard Development Script"
echo "========================================"

case "${1:-both}" in
    "frontend")
        echo "Starting frontend development server..."
        npm run dev
        ;;
    "backend")
        echo "Starting backend development server..."
        cd server && npm run dev
        ;;
    "both")
        echo "Starting both frontend and backend servers..."
        echo "Frontend will be available at: http://localhost:5173"
        echo "Backend API will be available at: http://localhost:4000"
        echo ""
        echo "Press Ctrl+C to stop both servers"
        echo ""
        
        # Start backend in background
        cd server && npm run dev &
        BACKEND_PID=$!
        
        # Start frontend
        npm run dev &
        FRONTEND_PID=$!
        
        # Wait for both processes
        wait $BACKEND_PID $FRONTEND_PID
        ;;
    *)
        echo "Usage: ./dev.sh [frontend|backend|both]"
        echo "  frontend - Start only the Vite frontend server"
        echo "  backend  - Start only the Express backend server"
        echo "  both     - Start both servers (default)"
        exit 1
        ;;
esac 