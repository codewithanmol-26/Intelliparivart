"""
Intelliprivart API - Early-Warning Risk & Remedial Triage
Data-driven risk pipeline using calibrated Gradient Boosting model.
Pure empirical feature vectors. Real feature explanations and mentor action pipeline.
"""

from typing import Dict, Any, List, Optional
import json
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.app.database import get_db
from backend.app.models import (
    Student, Batch, Attendance, Fee, Intervention, AuditLog,
    ComputedRisk, RecomputeRun
)
from backend.app.services.recompute_service import recompute

router = APIRouter(prefix="/risk", tags=["Early Warning & Risk Triage"])

class RemedialAssignRequest(BaseModel):
    student_id: str
    intervention_type: str = "1-on-1 Mentorship"
    reason: str = "Academic support"
    assigned_to: str = "Er. R. K. Verma"
    status: str = "ASSIGNED"

@router.get("/prioritized")
@router.get("/at-risk")
def get_at_risk_students(
    target_exam: Optional[str] = None,
    batch_id: Optional[str] = None,
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    db: Session = Depends(get_db)
):
    """
    Returns prioritized at-risk students derived strictly from ComputedRisk.
    Strictly empirical pipeline.
    Real feature-contribution explanations and mentor intervention pipeline.
    """
    effective_tenant = tenant_id or x_tenant_id or "INST_PATNA_01"
    if effective_tenant == "INST001":
        effective_tenant = "INST_PATNA_01"
    elif effective_tenant == "INST002":
        effective_tenant = "INST_KOTA_02"
    elif effective_tenant == "INST003":
        effective_tenant = "INST_LUCKNOW_03"

    # Check if student has attendance data
    att_count = db.query(Attendance).filter(Attendance.tenant_id == effective_tenant).count()
    if att_count == 0:
        return {
            "status": "insufficient_data",
            "needs": ["attendance"],
            "message": "No attendance records found for this tenant. Upload attendance log to evaluate disengagement risk.",
            "students": [],
            "lineage": None
        }

    # Fetch latest recompute run
    latest_run = db.query(RecomputeRun).filter(
        RecomputeRun.tenant_id == effective_tenant,
        RecomputeRun.status == "SUCCESS"
    ).order_by(RecomputeRun.computed_at.desc()).first()

    if not latest_run:
        recompute(effective_tenant, db, source_file="system_initial_sync")
        latest_run = db.query(RecomputeRun).filter(
            RecomputeRun.tenant_id == effective_tenant,
            RecomputeRun.status == "SUCCESS"
        ).order_by(RecomputeRun.computed_at.desc()).first()

    query = db.query(ComputedRisk).filter(
        ComputedRisk.tenant_id == effective_tenant,
        ComputedRisk.run_id == latest_run.id
    )

    if batch_id and batch_id != "all":
        query = query.filter(ComputedRisk.batch_id == batch_id)

    risk_records = query.order_by(ComputedRisk.risk_score.desc()).all()

    # Get batch and student metadata
    batches = {b.id: b for b in db.query(Batch).filter(Batch.tenant_id == effective_tenant).all()}
    consent_map = {s.id: s.parent_contact_consent for s in db.query(Student).filter(Student.tenant_id == effective_tenant).all()}

    results = []
    for r in risk_records:
        batch = batches.get(r.batch_id)
        batch_name = batch.name if batch else "JEE Main Foundation"
        exam = batch.target_exam if batch else "JEE Main"

        if target_exam and target_exam != "All" and exam != target_exam:
            continue

        reasons = json.loads(r.top_reasons_json) if r.top_reasons_json else []
        primary_driver = reasons[0] if reasons else "Academic trajectory monitoring"

        # Supportive intervention recommendation based on risk band
        if r.risk_tier == "HIGH":
            remedial = "Schedule 1:1 Mentor Session + Foundational Concept Booster Pack"
        elif r.risk_tier == "MODERATE":
            remedial = "Assign Timed Speed-Drill Worksheet + Doubt Desk Walkthrough"
        else:
            remedial = "Continue Regular Syllabus + Olympiad Advance Problem Set"

        results.append({
            "student_id": r.student_id,
            "full_name": r.student_name,
            "batch_name": batch_name,
            "target_exam": exam,
            "predicted_risk_proba": r.risk_score,
            "risk_score": r.risk_score,
            "risk_band": r.risk_tier.capitalize(),
            "risk_tier": r.risk_tier,
            "primary_driver": primary_driver,
            "top_reasons": reasons,
            "recommended_remedial": remedial,
            "attendance_rate": r.attendance_rate,
            "attendance_slope": r.attendance_slope,
            "fee_payment_lag_days": r.fee_delay_days,
            "mock_accuracy": r.mock_accuracy,
            "intervention_status": r.intervention_status or "UNASSIGNED",
            "parent_contact_consent": consent_map.get(r.student_id, True)
        })

    lineage_info = {
        "run_id": latest_run.id,
        "source_files": latest_run.source_files_json,
        "rows_used": latest_run.rows_used,
        "computed_at": latest_run.computed_at.isoformat()
    }

    return {
        "status": "ready",
        "students": results,
        "lineage": lineage_info
    }

@router.post("/assign-remedial")
@router.post("/actions")
def assign_remedial_action(
    req: RemedialAssignRequest,
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    db: Session = Depends(get_db)
):
    """
    Creates or updates supportive intervention in database and updates mentor pipeline.
    """
    effective_tenant = tenant_id or x_tenant_id or "INST_PATNA_01"

    # Insert intervention record
    intervention = Intervention(
        tenant_id=effective_tenant,
        student_id=req.student_id,
        intervention_type=req.intervention_type,
        reason=req.reason,
        assigned_to=req.assigned_to,
        status=req.status.upper()
    )
    db.add(intervention)

    # Update latest computed risk row status
    latest_risk = db.query(ComputedRisk).filter(
        ComputedRisk.tenant_id == effective_tenant,
        ComputedRisk.student_id == req.student_id
    ).order_by(ComputedRisk.computed_at.desc()).first()

    if latest_risk:
        latest_risk.intervention_status = req.status.upper()

    db.add(AuditLog(
        tenant_id=effective_tenant,
        actor_role="Mentor",
        action="ASSIGN_INTERVENTION",
        resource_type="STUDENT",
        resource_id=req.student_id,
        details_json=json.dumps({"type": req.intervention_type, "status": req.status})
    ))
    db.commit()

    return {
        "status": "SUCCESS",
        "message": f"Intervention successfully assigned to student {req.student_id}",
        "student_id": req.student_id,
        "new_status": req.status.upper()
    }
