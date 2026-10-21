"""
Data Moat - Audit Logging Service
Tracks sensitive data operations, imports, policy adjustments, and interventions.
"""

from datetime import datetime
from sqlalchemy.orm import Session
from src.database.models import AuditLog

def record_audit_event(
    db: Session,
    institute_id: str,
    user_role: str,
    action: str,
    entity_type: str,
    entity_id: str,
    details: str
) -> AuditLog:
    """Creates a permanent audit record for administrative compliance."""
    log = AuditLog(
        institute_id=institute_id,
        user_role=user_role,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    return log
