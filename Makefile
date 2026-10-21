.PHONY: setup seed test run run-backend run-frontend clean

setup:
	@echo "Installing Python and Node dependencies..."
	pip install -r requirements.txt
	cd frontend && npm install

seed:
	@echo "Generating synthetic benchmark dataset and calibrating ML models..."
	python data/generate.py
	python -m backend.app.database

test:
	@echo "Running backend API and ML tests..."
	python -m pytest backend/tests/test_api.py -v

run-backend:
	@echo "Starting FastAPI backend on http://127.0.0.1:8000..."
	uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

run-frontend:
	@echo "Starting Next.js frontend on http://127.0.0.1:3000..."
	cd frontend && npm run dev

run:
	@echo "To run both services in separate terminals, use:"
	@echo "  make run-backend"
	@echo "  make run-frontend"
	@echo "Or run with docker: docker compose up --build"

clean:
	@echo "Cleaning caches and temporary artifacts..."
	rm -rf __pycache__ .pytest_cache backend/app/__pycache__ ml/__pycache__ frontend/.next
