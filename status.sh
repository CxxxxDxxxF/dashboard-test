#!/bin/bash

echo "🔍 Rutgers Dashboard Status Check"
echo "================================="

# Check frontend (Vite)
echo -n "Frontend (Vite): "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Running at http://localhost:5173"
else
    echo "❌ Not running"
fi

# Check backend (Express)
echo -n "Backend (Express): "
if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo "✅ Running at http://localhost:4000"
    echo "   Health: $(curl -s http://localhost:4000/health | jq -r '.status' 2>/dev/null || echo 'OK')"
else
    echo "❌ Not running"
fi

echo ""
echo "🚀 Quick Start:"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:4000/api"
echo "  Health Check: http://localhost:4000/health"
echo ""
echo "💡 Use './dev.sh' to start both servers" 