@echo off
echo =======================================================
echo Intelliprivart - One-Command Setup
echo Nextute x Finance Club, IIT Patna Case Competition 2026
echo =======================================================

echo [1/3] Installing Python ML & Backend Dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing Python dependencies.
    exit /b %errorlevel%
)

echo [2/3] Seeding 1,200 Student Synthetic Cohort Database...
python data/generate.py
python -c "from backend.app.database import init_db; init_db()"
if %errorlevel% neq 0 (
    echo Error initializing database.
    exit /b %errorlevel%
)

echo [3/3] Installing Next.js Frontend Dependencies...
cd frontend
call npm install
cd ..

echo =======================================================
echo Setup Complete!
echo Run 'run.bat' or 'npm run dev' to start the application.
echo =======================================================
