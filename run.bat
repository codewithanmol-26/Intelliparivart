@echo off
echo =======================================================
echo Starting Intelliprivart Full-Stack Web Application
echo =======================================================

echo Launching FastAPI Backend on http://127.0.0.1:8000...
start "Intelliprivart Backend" cmd /k "uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Launching Next.js Frontend on http://127.0.0.1:3000...
start "Intelliprivart Frontend" cmd /k "cd frontend && npm run dev"

echo Both services launched!
echo Open your browser at http://localhost:3000
