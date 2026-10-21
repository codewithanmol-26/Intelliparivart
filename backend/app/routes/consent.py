"""
Intelliprivart API - DPDP Act 2023 Consent Registry & Data Safety
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from backend.app.database import get_db
from backend.app.models import Student, AuditLog
from backend.app.schemas import StudentOut

router = APIRouter(prefix="/consent", tags=["Privacy, Consent & Safety"])

@router.get("", response_model=List[StudentOut])
def list_consent_registry(
    tenant_id: str = "INST_PATNA_01",
    db: Session = Depends(get_db)
):
    """Lists students and their current DPDP Act Section 9 Parental Consent status."""
    return db.query(Student).filter(Student.tenant_id == tenant_id).limit(100).all()

@router.post("/{student_id}/withdraw")
def withdraw_parent_consent(
    student_id: str,
    tenant_id: str = "INST_PATNA_01",
    db: Session = Depends(get_db)
):
    """
    1-Click Parent Consent Withdrawal under DPDP Act 2023.
    Immediately sets parent_contact_consent = False, removing the student
    from early-warning alert queues, risk models, and parent report generators.
    """
    student = db.query(Student).filter(Student.id == student_id, Student.tenant_id == tenant_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.parent_contact_consent = False

    # Log immutably in Audit Logs
    audit = AuditLog(
        tenant_id=tenant_id,
        actor_role="Parent",
        action="WITHDRAW_PARENTAL_CONSENT",
        resource_type="STUDENT_CONSENT",
        resource_id=student_id,
        details_json=json.dumps({
            "student_id": student_id,
            "pseudonymous_code": student.pseudonymous_code,
            "policy": "DPDP Act 2023 Section 9 (Minors Data Protection)",
            "impact": "Student removed from risk scoring alerts and automated parent report exports"
        })
    )
    db.add(audit)
    db.commit()

    return {
        "status": "SUCCESS",
        "student_id": student_id,
        "name": student.name,
        "parent_contact_consent": False,
        "message": "Parental consent successfully withdrawn. Profile placed in protected educational mode."
    }
