"""
Intelliprivart Backend - Intervention Tracker Routes
Connects diagnostic analytics to supportive faculty/mentor actions.
Manages 1-on-1 mentorship, remedial worksheets, doubt sessions, and outcome tracking.
"""

from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date

from backend.app.database import get_db
from backend.app.models import Intervention, Student, Batch

router = APIRouter(prefix="", tags=["Intervention Tracker"])

class InterventionCreate(BaseModel):
    student_id: str
    intervention_type: str = Field(..., example="1-on-1 Faculty Mentorship")
    reason: str = Field(..., example="Topic deficit in Rotational Dynamics & Torque")
    assigned_to: Optional[str] = "Er. R. K. Verma (Physics)"
    follow_up_date: Optional[str] = None # YYYY-MM-DD
    outcome_notes: Optional[str] = None

class InterventionUpdate(BaseModel):
    status: Optional[str] = None # ASSIGNED, IN_PROGRESS, COMPLETED
    follow_up_date: Optional[str] = None
    outcome_notes: Optional[str] = None
    assigned_to: Optional[str] = None

@router.get("/interventions")
@router.get("/api/interventions")
def get_interventions(
    status: Optional[str] = Query(None, description="Filter by status: ASSIGNED, IN_PROGRESS, COMPLETED, OVERDUE, ALL"),
    student_id: Optional[str] = Query(None, description="Filter by student ID"),
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    db: Session = Depends(get_db)
):
    """
    Returns all logged interventions for the active institute tenant.
    Includes student names, batch information, overdue flags, and summary counts.
    """
    effective_tenant = tenant_id or x_tenant_id or "INST_PATNA_01"
    if effective_tenant == "INST001":
        effective_tenant = "INST_PATNA_01"
    elif effective_tenant == "INST002":
        effective_tenant = "INST_KOTA_02"
    elif effective_tenant == "INST003":
        effective_tenant = "INST_LUCKNOW_03"

    query = db.query(Intervention).filter(Intervention.tenant_id == effective_tenant)
    if student_id:
        query = query.filter(Intervention.student_id == student_id)

    records = query.order_by(Intervention.created_at.desc()).all()

    # Pre-fetch students and batches for efficient join
    student_map = {s.id: s for s in db.query(Student).filter(Student.tenant_id == effective_tenant).all()}
    batch_map = {b.id: b.name for b in db.query(Batch).filter(Batch.tenant_id == effective_tenant).all()}

    today = date.today()
    intervention_list = []
    active_count = 0
    in_progress_count = 0
    completed_count = 0
    overdue_count = 0

    for item in records:
        st = student_map.get(item.student_id)
        st_name = st.name if st else item.student_id
        batch_name = batch_map.get(st.batch_id, "Standard Batch") if st else "Standard Batch"

        is_overdue = False
        if item.follow_up_date and item.status != "COMPLETED":
            f_date = item.follow_up_date if isinstance(item.follow_up_date, date) else datetime.strptime(str(item.follow_up_date), "%Y-%m-%d").date()
            if f_date < today:
                is_overdue = True
                overdue_count += 1

        if item.status == "ASSIGNED":
            active_count += 1
        elif item.status == "IN_PROGRESS":
            in_progress_count += 1
        elif item.status == "COMPLETED":
            completed_count += 1

        # Check status filter
        if status and status.upper() != "ALL":
            if status.upper() == "OVERDUE" and not is_overdue:
                continue
            elif status.upper() != "OVERDUE" and item.status.upper() != status.upper():
                continue

        intervention_list.append({
            "id": item.id,
            "tenant_id": item.tenant_id,
            "student_id": item.student_id,
            "student_name": st_name,
            "batch_name": batch_name,
            "intervention_type": item.intervention_type,
            "reason": item.reason,
            "assigned_to": item.assigned_to or "Faculty Mentor",
            "status": item.status or "ASSIGNED",
            "follow_up_date": str(item.follow_up_date) if item.follow_up_date else None,
            "is_overdue": is_overdue,
            "outcome_notes": item.outcome_notes,
            "created_at": item.created_at.strftime("%Y-%m-%d %H:%M") if item.created_at else str(today)
        })

    return {
        "tenant_id": effective_tenant,
        "interventions": intervention_list,
        "summary": {
            "total": len(records),
            "assigned": active_count,
            "in_progress": in_progress_count,
            "completed": completed_count,
            "overdue": overdue_count
        }
    }

@router.post("/interventions")
@router.post("/api/interventions")
def create_intervention(
    payload: InterventionCreate,
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    db: Session = Depends(get_db)
):
    """
    Creates a new supportive intervention linked to a student.
    Persists directly to database and updates intervention audit lineage.
    """
    effective_tenant = tenant_id or x_tenant_id or "INST_PATNA_01"
    if effective_tenant == "INST001":
        effective_tenant = "INST_PATNA_01"
    elif effective_tenant == "INST002":
        effective_tenant = "INST_KOTA_02"
    elif effective_tenant == "INST003":
        effective_tenant = "INST_LUCKNOW_03"

    f_date = None
    if payload.follow_up_date:
        try:
            f_date = datetime.strptime(payload.follow_up_date, "%Y-%m-%d").date()
        except ValueError:
            f_date = None

    rec = Intervention(
        tenant_id=effective_tenant,
        student_id=payload.student_id,
        intervention_type=payload.intervention_type,
        reason=payload.reason,
        assigned_to=payload.assigned_to or "Er. R. K. Verma (Physics)",
        status="ASSIGNED",
        follow_up_date=f_date,
        outcome_notes=payload.outcome_notes,
        created_at=datetime.utcnow()
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    # Fetch student name
    st = db.query(Student).filter(Student.id == payload.student_id).first()

    return {
        "status": "success",
        "message": f"Supportive intervention assigned to {st.name if st else payload.student_id}.",
        "intervention": {
            "id": rec.id,
            "tenant_id": rec.tenant_id,
            "student_id": rec.student_id,
            "student_name": st.name if st else rec.student_id,
            "intervention_type": rec.intervention_type,
            "reason": rec.reason,
            "assigned_to": rec.assigned_to,
            "status": rec.status,
            "follow_up_date": str(rec.follow_up_date) if rec.follow_up_date else None,
            "outcome_notes": rec.outcome_notes,
            "created_at": rec.created_at.strftime("%Y-%m-%d %H:%M")
        }
    }

@router.patch("/interventions/{intervention_id}")
@router.patch("/api/interventions/{intervention_id}")
def update_intervention(
    intervention_id: int,
    payload: InterventionUpdate,
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    db: Session = Depends(get_db)
):
    """
    Updates the status, outcome notes, mentor or follow-up date for an existing intervention.
    """
    effective_tenant = tenant_id or x_tenant_id or "INST_PATNA_01"
    if effective_tenant == "INST001":
        effective_tenant = "INST_PATNA_01"
    elif effective_tenant == "INST002":
        effective_tenant = "INST_KOTA_02"
    elif effective_tenant == "INST003":
        effective_tenant = "INST_LUCKNOW_03"

    rec = db.query(Intervention).filter(
        Intervention.id == intervention_id,
        Intervention.tenant_id == effective_tenant
    ).first()

    if not rec:
        raise HTTPException(status_code=404, detail="Intervention record not found")

    if payload.status:
        rec.status = payload.status.upper()
    if payload.outcome_notes is not None:
        rec.outcome_notes = payload.outcome_notes
    if payload.assigned_to:
        rec.assigned_to = payload.assigned_to
    if payload.follow_up_date:
        try:
            rec.follow_up_date = datetime.strptime(payload.follow_up_date, "%Y-%m-%d").date()
        except ValueError:
            pass

    db.commit()
    db.refresh(rec)

    return {
        "status": "success",
        "message": f"Intervention #{rec.id} updated successfully.",
        "intervention": {
            "id": rec.id,
            "student_id": rec.student_id,
            "status": rec.status,
            "follow_up_date": str(rec.follow_up_date) if rec.follow_up_date else None,
            "outcome_notes": rec.outcome_notes,
            "assigned_to": rec.assigned_to
        }
    }

@router.delete("/interventions/{intervention_id}")
@router.delete("/api/interventions/{intervention_id}")
def delete_intervention(
    intervention_id: int,
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    db: Session = Depends(get_db)
):
    """
    Deletes an intervention record.
    """
    effective_tenant = tenant_id or x_tenant_id or "INST_PATNA_01"
    if effective_tenant == "INST001":
        effective_tenant = "INST_PATNA_01"
    elif effective_tenant == "INST002":
        effective_tenant = "INST_KOTA_02"
    elif effective_tenant == "INST003":
        effective_tenant = "INST_LUCKNOW_03"

    rec = db.query(Intervention).filter(
        Intervention.id == intervention_id,
        Intervention.tenant_id == effective_tenant
    ).first()

    if not rec:
        raise HTTPException(status_code=404, detail="Intervention record not found")

    db.delete(rec)
    db.commit()

    return {"status": "success", "message": f"Intervention #{intervention_id} deleted."}
