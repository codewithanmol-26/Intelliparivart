"""
Data Moat - FastAPI REST Backend Service
Provides documented, modular REST endpoints for Institutes, Students, Tests,
Topic Mastery, Early Warning Risk, Interventions, Bilingual Parent Reports, and OMR.
"""

import numpy as np
if not hasattr(np, "bool8"):
    np.bool8 = np.bool_

from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from src.config import settings
from src.database.connection import get_db, check_db_health
from src.database.models import Institute, Student, Batch, Question, TestResponse, Attendance, Fee, Intervention
from src.ml.early_warning import generate_at_risk_triage_roster
from src.ml.performance import predict_student_percentile_interval
from src.ai.prompts import generate_bilingual_parent_report
from src.data.omr import process_omr_image
from src.services.roi import calculate_institute_roi

app = FastAPI(
    title="Data Moat API",
    description="AI-Powered Institute Intelligence Platform REST API (IIT Patna × Nextute Case B)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["System"])
def health_check():
    """Returns database connection status and application configuration."""
    db_status = check_db_health()
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status
    }

@app.get("/api/v1/institutes", tags=["Institutes"])
def get_institutes(db: Session = Depends(get_db)):
    """Lists registered coaching institutes."""
    institutes = db.query(Institute).all()
    return [
        {
            "institute_id": inst.institute_id,
            "name": inst.name,
            "city": inst.city,
            "city_tier": inst.city_tier,
            "exam_focus": inst.exam_focus,
            "student_count": inst.student_count,
            "plan": inst.plan
        }
        for inst in institutes
    ]

@app.get("/api/v1/students", tags=["Students"])
def get_students(
    institute_id: str = Query(..., description="Tenant Institute ID"),
    batch_id: Optional[str] = Query(None),
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Retrieves students belonging strictly to the specified institute."""
    query = db.query(Student).filter(Student.institute_id == institute_id)
    if batch_id:
        query = query.filter(Student.batch_id == batch_id)
    students = query.limit(limit).all()

    return [
        {
            "student_id": s.student_id,
            "name": s.name,
            "batch_id": s.batch_id,
            "class_level": s.class_level,
            "join_date": str(s.join_date),
            "fee_plan": s.fee_plan,
            "parent_contact_consent": s.parent_contact_consent
        }
        for s in students
    ]

@app.get("/api/v1/early-warning/{institute_id}", tags=["Early Warning"])
def get_early_warning_triage(
    institute_id: str,
    db: Session = Depends(get_db)
):
    """Returns prioritized at-risk triage roster for the institute."""
    roster_df = generate_at_risk_triage_roster(db, institute_id)
    return roster_df.to_dict(orient="records")

@app.get("/api/v1/performance-prediction/{student_id}", tags=["ML Predictions"])
def get_performance_prediction(
    student_id: str,
    db: Session = Depends(get_db)
):
    """Computes honest percentile prediction interval [P10, P90] with uncertainty bounds."""
    import pandas as pd
    responses_df = pd.read_sql(
        db.query(TestResponse).filter(TestResponse.student_id == student_id).statement, db.bind
    )
    questions_df = pd.read_sql(db.query(Question).statement, db.bind)

    if len(responses_df) == 0:
        raise HTTPException(status_code=404, detail="No test responses found for student.")

    result = predict_student_percentile_interval(student_id, responses_df, questions_df)
    return result

@app.post("/api/v1/omr-scan", tags=["Data Ingestion"])
async def scan_omr_sheet(file: UploadFile = File(...)):
    """Processes uploaded paper OMR bubble sheet using OpenCV."""
    contents = await file.read()
    try:
        results = process_omr_image(contents)
        # Exclude raw image bytes from JSON response
        results.pop("annotated_image_bytes", None)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OMR Processing Error: {str(e)}")

@app.get("/api/v1/roi-calculator", tags=["Institute Analytics"])
def get_roi_calculation(
    active_students: int = 400,
    annual_fee: float = 60000.0,
    attrition_rate: float = 0.15,
    preventable_share: float = 0.25
):
    """Computes institute financial ROI metrics."""
    return calculate_institute_roi(
        active_students=active_students,
        annual_fee_per_student=annual_fee,
        baseline_attrition_rate=attrition_rate,
        preventable_attrition_share=preventable_share
    )
