"""
Intelliprivart API - DPDP Act 2023 Consent Registry & Data Safety
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from backend.app.database import get_db
from backend.app.models import Student, AuditLog

router = APIRouter(prefix="/consent", tags=["Privacy, Consent & Safety"])

class ConsentUpdateRequest(BaseModel):
    student_id: str
    purpose: str
    granted: bool

@router.get("/list")
@router.get("")
def list_consent_registry(
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    db: Session = Depends(get_db)
):
    """Lists students and their current DPDP Act Section 9 Parental Consent status from live DB."""
    effective_tenant = tenant_id or x_tenant_id or "INST_PATNA_01"
    if effective_tenant == "INST001":
        effective_tenant = "INST_PATNA_01"
    elif effective_tenant == "INST002":
        effective_tenant = "INST_KOTA_02"
    elif effective_tenant == "INST003":
        effective_tenant = "INST_LUCKNOW_03"

    students = db.query(Student).filter(Student.tenant_id == effective_tenant).limit(50).all()
    results = []
    for s in students:
        results.append({
            "id": f"CONS_{s.id}",
            "tenant_id": s.tenant_id,
            "student_id": s.id,
            "guardian_phone": s.pseudonymous_code or "+91 98765 00000",
            "consent_purpose": "Academic Performance Tracking & Diagnostic Remediation",
            "is_granted": bool(s.parent_contact_consent),
            "timestamp": s.created_at.strftime("%Y-%m-%d %H:%M:%S") if s.created_at else "2026-08-01 10:00:00"
        })
    return results

@router.post("/update")
def update_consent(
    req: ConsentUpdateRequest,
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    db: Session = Depends(get_db)
):
    """Updates DPDP Consent status in database with audit logging."""
    effective_tenant = tenant_id or x_tenant_id or "INST_PATNA_01"
    if effective_tenant == "INST001":
        effective_tenant = "INST_PATNA_01"
    elif effective_tenant == "INST002":
        effective_tenant = "INST_KOTA_02"
    elif effective_tenant == "INST003":
        effective_tenant = "INST_LUCKNOW_03"

    student = db.query(Student).filter(Student.id == req.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.parent_contact_consent = req.granted

    audit = AuditLog(
        tenant_id=effective_tenant,
        actor_role="Guardian",
        action="UPDATE_PARENTAL_CONSENT",
        resource_type="STUDENT_CONSENT",
        resource_id=req.student_id,
        details_json=json.dumps({"granted": req.granted, "purpose": req.purpose})
    )
    db.add(audit)
    db.commit()

    return {"status": "SUCCESS", "student_id": req.student_id, "is_granted": req.granted}

@router.post("/{student_id}/withdraw")
def withdraw_parent_consent(
    student_id: str,
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    db: Session = Depends(get_db)
):
    """1-Click Parent Consent Withdrawal under DPDP Act 2023."""
    effective_tenant = tenant_id or x_tenant_id or "INST_PATNA_01"
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.parent_contact_consent = False
    audit = AuditLog(
        tenant_id=effective_tenant,
        actor_role="Guardian",
        action="WITHDRAW_PARENTAL_CONSENT",
        resource_type="STUDENT_CONSENT",
        resource_id=student_id,
        details_json=json.dumps({"student_id": student_id, "status": "WITHDRAWN"})
    )
    db.add(audit)
    db.commit()
    return {"status": "SUCCESS", "message": f"Consent withdrawn for student {student_id}"}
