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
    auth, ingest, mastery, risk, predictions, reports,
    owner, consent, audit, model_report, simulate, demo
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Intelliprivart AI-Powered Coaching Institute Intelligence Platform (Round 2 Prototype API)"
)

@app.on_event("startup")
def startup_db_init():
    """Initializes database schema tables gracefully without failing process startup if database is temporarily unreachable."""
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables verified and initialized successfully.")
    except Exception as exc:
        print(f"⚠️ Notice: Database initialization could not connect immediately ({exc}).")
        print("The server will remain online and serve requests; database will reconnect when reachable.")

# CORS Configuration allowing local Next.js frontend, PWA and external clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all feature routers
app.include_router(auth.router)
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

from backend.app.models import Institute
from backend.app.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

@app.get("/api/institutes")
@app.get("/institutes")
def list_institutes(db: Session = Depends(get_db)):
    """Returns active institute tenants stored directly in the database."""
    insts = db.query(Institute).all()
    return [
        {
            "id": i.id,
            "name": i.name,
            "city": i.city,
            "city_tier": i.city_tier,
            "exam_focus": i.exam_focus,
            "annual_fee_per_student": i.annual_fee_per_student
        }
        for i in insts
    ]

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
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)
