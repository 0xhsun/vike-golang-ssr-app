#!/bin/bash

# Start both Go backend and Express frontend

echo "Starting Go backend on :8080..."
cd go-backend && go run main.go &
GO_PID=$!

echo "Waiting for Go backend to start..."
sleep 2

echo "Starting Express frontend on :3000..."
cd .. && npm run dev &
EXPRESS_PID=$!

echo "Services started:"
echo "- Go Backend: http://localhost:8080"
echo "- Express Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup background processes
cleanup() {
    echo "Stopping services..."
    kill $GO_PID 2>/dev/null
    kill $EXPRESS_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait