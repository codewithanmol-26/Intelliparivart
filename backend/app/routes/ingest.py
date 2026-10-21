"""
Intelliprivart API - Ingestion, Review Queue & OMR Endpoints
"""

import json
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import io

from backend.app.database import get_db, TenantScopedQuery
from backend.app.models import ReviewQueueItem, Student, TestResponse, AuditLog
from backend.app.schemas import ReviewQueueItemOut, ReviewResolveRequest, OMRScanResult
from backend.app.services.omr_service import process_omr_sheet

router = APIRouter(prefix="/ingest", tags=["Ingestion & Review Queue"])

@router.post("/upload-csv")
@router.post("/csv")
async def ingest_csv(
    file: UploadFile = File(...),
    tenant_id: str = Form("INST_PATNA_01"),
    db: Session = Depends(get_db)
):
    """
    Parses CSV, checks student ID existence and duplicate records,
    routes malformed rows to the Review Queue with suggested fixes.
    """
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV file format: {str(e)}")

    valid_sids = {s.id for s in db.query(Student).filter(Student.tenant_id == tenant_id).all()}
    
    accepted_count = 0
    quarantined_count = 0
    seen_keys = set()

    for idx, row in df.iterrows():
        row_dict = row.to_dict()
        sid = str(row_dict.get("student_id", "")).strip()
        reasons = []

        # 1. Null ID Check
        if not sid or sid == "nan":
            reasons.append("Missing mandatory student_id")
        
        # 2. Foreign Key Check with Fuzzy Match Suggestion
        elif sid not in valid_sids:
            # Simple prefix match suggestion
            suggestion = next((s for s in valid_sids if s.startswith(sid[:7])), None)
            fix = f"Suggested match: '{suggestion}'" if suggestion else "Register student in portal first"
            reasons.append(f"Student ID '{sid}' not in institute roster ({fix})")

        # 3. Duplicate Detection Check
        row_key = (sid, str(row_dict.get("test_id", "")), str(row_dict.get("question_id", "")))
        if row_key in seen_keys:
            reasons.append("Duplicate response record detected in same submission file")
        seen_keys.add(row_key)

        # 4. Binary Score Check
        is_corr = str(row_dict.get("is_correct", "")).strip()
        if is_corr not in ["0", "1"]:
            reasons.append(f"Non-binary test score '{is_corr}' (expected 0 or 1)")

        if reasons:
            quarantined_count += 1
            # Add to Review Queue
            q_item = ReviewQueueItem(
                tenant_id=tenant_id,
                source_type="CSV_UPLOAD",
                raw_payload_json=json.dumps(row_dict),
                detected_error=" | ".join(reasons),
                suggested_fix="Review and confirm student ID or score format",
                status="PENDING"
            )
            db.add(q_item)
        else:
            accepted_count += 1

    # Log Audit
    audit = AuditLog(
        tenant_id=tenant_id,
        actor_role="Teacher",
        action="CSV_INGESTION",
        resource_type="BATCH_TEST_FILE",
        resource_id=file.filename or "uploaded.csv",
        details_json=json.dumps({"total_rows": len(df), "accepted": accepted_count, "quarantined": quarantined_count})
    )
    db.add(audit)
    db.commit()

    return {
        "status": "COMPLETED",
        "file_name": file.filename,
        "total_rows_processed": len(df),
        "rows_accepted": accepted_count,
        "rows_quarantined": quarantined_count,
        "review_queue_url": "/review-queue"
    }

@router.post("/omr-scan")
@router.post("/omr", response_model=OMRScanResult)
async def ingest_omr(
    file: UploadFile = File(...),
    tenant_id: str = Form("INST_PATNA_01"),
    db: Session = Depends(get_db)
):
    """
    Evaluates mobile OMR camera photo with OpenCV:
    Diagnoses blur/skew, runs adaptive thresholding, and measures bubble fill confidence.
    """
    contents = await file.read()
    result = process_omr_sheet(contents)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    # Log Audit
    audit = AuditLog(
        tenant_id=tenant_id,
        actor_role="Teacher",
        action="OMR_SCAN",
        resource_type="OMR_IMAGE",
        resource_id=file.filename or "omr_scan.png",
        details_json=json.dumps({"quality": result["quality_status"], "score": result.get("score", 0)})
    )
    db.add(audit)
    db.commit()

    return {
        "file_name": file.filename or "omr_sheet.png",
        "quality_status": result["quality_status"],
        "total_detected": result["total_detected"],
        "score": result["score"],
        "questions": result["questions"]
    }

@router.get("/quarantine")
@router.get("/review-queue", response_model=List[ReviewQueueItemOut])
def get_review_queue(
    tenant_id: str = "INST_PATNA_01",
    db: Session = Depends(get_db)
):
    """Retrieves all pending quarantined items for the current tenant."""
    return db.query(ReviewQueueItem).filter(
        ReviewQueueItem.tenant_id == tenant_id,
        ReviewQueueItem.status == "PENDING"
    ).all()

@router.post("/quarantine/{item_id}/resolve")
@router.post("/review-queue/{item_id}/resolve")
def resolve_review_item(
    item_id: int,
    req: ReviewResolveRequest,
    tenant_id: str = "INST_PATNA_01",
    db: Session = Depends(get_db)
):
    """Approves (with optional 1-tap correction) or rejects a quarantined row."""
    item = db.query(ReviewQueueItem).filter(
        ReviewQueueItem.id == item_id,
        ReviewQueueItem.tenant_id == tenant_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Review item not found")

    item.status = "APPROVED" if req.action.upper() == "APPROVE" else "REJECTED"
    
    # Audit trail
    audit = AuditLog(
        tenant_id=tenant_id,
        actor_role="Teacher",
        action=f"REVIEW_{item.status}",
        resource_type="REVIEW_QUEUE_ITEM",
        resource_id=str(item_id),
        details_json=json.dumps({"action": req.action, "corrected_payload": req.corrected_payload})
    )
    db.add(audit)
    db.commit()

    return {"status": "SUCCESS", "item_id": item_id, "new_status": item.status}
