"""
Intelliprivart Backend - Main FastAPI Application
End-to-End API server for Round 2 Working Prototype:
Nextute EdTech × Finance Club, IIT Patna (Case B: The Data Moat)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.routes import (
    ingest, mastery, risk, predictions, reports,
    owner, consent, audit, model_report, simulate, demo
)

# Initialize database schema tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Intelliprivart AI-Powered Coaching Institute Intelligence Platform (Round 2 Prototype API)"
)

# CORS Configuration allowing local Next.js frontend, PWA and external clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all feature routers
app.include_router(ingest.router)
app.include_router(mastery.router)
app.include_router(risk.router)
app.include_router(predictions.router)
app.include_router(reports.router)
app.include_router(owner.router)
app.include_router(consent.router)
app.include_router(audit.router)
app.include_router(model_report.router)
app.include_router(simulate.router)
app.include_router(demo.router)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "docs_url": "/docs",
        "health_check": "/api/health",
        "rubric_focus": "70% Technology & Architecture | 30% EdTech Market & GTM"
    }

@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "online", "platform": settings.PROJECT_NAME, "version": settings.PROJECT_VERSION}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
