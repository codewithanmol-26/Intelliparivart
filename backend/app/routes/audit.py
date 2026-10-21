"""
Intelliprivart API - Immutable Audit Log Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import AuditLog
from backend.app.schemas import AuditLogOut

router = APIRouter(prefix="/audit", tags=["Governance & Audit Trail"])

@router.get("", response_model=List[AuditLogOut])
def get_audit_trail(
    tenant_id: str = "INST_PATNA_01",
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Returns immutable audit logs showing who viewed what, ingestion events,
    consent updates, and remedial actions.
    """
    return db.query(AuditLog).filter(
        AuditLog.tenant_id == tenant_id
    ).order_by(AuditLog.timestamp.desc()).limit(limit).all()
