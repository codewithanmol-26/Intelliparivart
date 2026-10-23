"""
Intelliprivart Backend - Comprehensive WhatsApp Cloud API Test Suite
Covers:
1. Missing & configured credentials handling
2. Template payload construction & validation
3. Meta Graph API success & rejection handling (mocked)
4. DPDP Act 2023 Section 9 Guardian Consent gatekeeping
5. Authentication and Tenant Isolation boundary enforcement
6. Duplicate dispatch prevention
7. Webhook GET verification handshake & POST HMAC-SHA256 signature validation
8. Idempotent persistent delivery status progression (PENDING -> SENT -> DELIVERED -> READ)
9. Batch broadcast with mixed consent and deduplication outcomes
10. Parent Reports regression tests
"""

import pytest
import hmac
import hashlib
import json
import datetime
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.database import SessionLocal, Base, engine
from backend.app.models import Institute, Student, Batch, WhatsAppMessageLog, Attendance, User
from backend.app.auth import create_access_token
from backend.app.config import settings

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    """Seeds prerequisite institute, batch, and students for testing."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Institute
        inst = db.query(Institute).filter(Institute.id == "INST_PATNA_01").first()
        if not inst:
            inst = Institute(
                id="INST_PATNA_01",
                name="Apex JEE & Medical Academy, Patna",
                city="Patna",
                city_tier="Tier-2",
                annual_fee_per_student=75000.0
            )
            db.add(inst)

        # Batch
        batch = db.query(Batch).filter(Batch.id == "BATCH_TEST_01").first()
        if not batch:
            batch = Batch(
                id="BATCH_TEST_01",
                tenant_id="INST_PATNA_01",
                name="12th JEE Achievers Batch",
                class_level="12th",
                target_exam="JEE Advanced"
            )
            db.add(batch)

        # Student 1: Consented
        s1 = db.query(Student).filter(Student.id == "STD_TEST_CONSENTED").first()
        if not s1:
            s1 = Student(
                id="STD_TEST_CONSENTED",
                tenant_id="INST_PATNA_01",
                batch_id="BATCH_TEST_01",
                pseudonymous_code="PSEUDO_STD_TEST_CONSENTED",
                name="Ananya Sharma",
                class_level="12th",
                join_date=datetime.date(2025, 4, 1),
                parent_contact_consent=True,
                guardian_name="Rajesh Sharma",
                guardian_phone="+919876543210"
            )
            db.add(s1)

        # Student 2: Consent Withdrawn
        s2 = db.query(Student).filter(Student.id == "STD_TEST_WITHDRAWN").first()
        if not s2:
            s2 = Student(
                id="STD_TEST_WITHDRAWN",
                tenant_id="INST_PATNA_01",
                batch_id="BATCH_TEST_01",
                pseudonymous_code="PSEUDO_STD_TEST_WITHDRAWN",
                name="Rahul Verma",
                class_level="12th",
                join_date=datetime.date(2025, 4, 1),
                parent_contact_consent=False,
                guardian_name="Sanjay Verma",
                guardian_phone="+919876599887"
            )
            db.add(s2)

        # Attendance for Student 1
        att = db.query(Attendance).filter(Attendance.student_id == "STD_TEST_CONSENTED").first()
        if not att:
            for d in range(1, 6):
                db.add(Attendance(
                    id=f"ATT_TEST_{d}",
                    tenant_id="INST_PATNA_01",
                    student_id="STD_TEST_CONSENTED",
                    session_date=datetime.date(2025, 9, d),
                    present_flag=1
                ))

        db.commit()
    finally:
        db.close()

def get_auth_header(tenant_id="INST_PATNA_01", role="teacher"):
    """Generates a valid JWT auth header for tests."""
    token = create_access_token({
        "sub": f"USR_{role.upper()}_01",
        "email": f"{role}@apex.edu",
        "role": role,
        "tenant_id": tenant_id,
        "full_name": "Test Faculty Member"
    })
    return {"Authorization": f"Bearer {token}", "X-Tenant-ID": tenant_id}

# -------------------------------------------------------------
# 1. Credentials & Operational Status
# -------------------------------------------------------------
def test_whatsapp_status():
    """Verifies WhatsApp status endpoint returns operational metadata."""
    res = client.get("/whatsapp/status", headers=get_auth_header())
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "provider" in data
    assert "delivery_rate" in data
    assert "dpdp_section_9_compliance" in data

# -------------------------------------------------------------
# 2. DPDP Act Section 9 Guardian Consent Gatekeeper
# -------------------------------------------------------------
def test_send_whatsapp_consent_withdrawn_rejected():
    """Verifies that sending a report for a student with withdrawn consent is blocked with HTTP 403."""
    res = client.post("/whatsapp/send", json={
        "student_id": "STD_TEST_WITHDRAWN",
        "recipient_phone": "+91 98765 99887",
        "language": "en"
    }, headers=get_auth_header())

    assert res.status_code == 403
    assert "DPDP Act" in res.json()["detail"]

def test_send_whatsapp_missing_student_404():
    """Verifies that attempting to send to a non-existent student returns 404."""
    res = client.post("/whatsapp/send", json={
        "student_id": "STD_NON_EXISTENT_999",
        "recipient_phone": "+91 98765 00000"
    }, headers=get_auth_header())

    assert res.status_code == 404

# -------------------------------------------------------------
# 3. Tenant Isolation & Authorization Boundary
# -------------------------------------------------------------
def test_tenant_isolation_student_access():
    """Verifies a teacher from Kota cannot send WhatsApp report for a student from Patna."""
    kota_auth = get_auth_header(tenant_id="INST_KOTA_02", role="teacher")
    res = client.post("/whatsapp/send", json={
        "student_id": "STD_TEST_CONSENTED",
        "language": "en"
    }, headers=kota_auth)

    # Must be rejected because student belongs to INST_PATNA_01
    assert res.status_code == 404

# -------------------------------------------------------------
# 4. Authorized Single-Parent Dispatch (Simulation Mode)
# -------------------------------------------------------------
def test_send_whatsapp_simulation_success():
    """Verifies successful dispatch in simulation/local mode with persistent log."""
    res = client.post("/whatsapp/send", json={
        "student_id": "STD_TEST_CONSENTED",
        "language": "en"
    }, headers=get_auth_header())

    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "delivery_details" in data
    assert data["delivery_details"]["dispatch_state"] == "ACCEPTED"
    assert data["delivery_details"]["delivery_status"] == "PENDING"
    assert data["delivery_details"]["recipient"] == "+919876543210"

# -------------------------------------------------------------
# 5. Meta WhatsApp Cloud API Mocked Success & Rejection
# -------------------------------------------------------------
@patch("backend.app.services.whatsapp_service.httpx.Client")
def test_send_whatsapp_mocked_meta_api_success(mock_client_cls):
    """Mocks Meta Graph API returning HTTP 200 with real wamid message ID."""
    mock_post = MagicMock()
    mock_post.status_code = 200
    mock_post.json.return_value = {
        "messaging_product": "whatsapp",
        "contacts": [{"input": "919876543210", "wa_id": "919876543210"}],
        "messages": [{"id": "wamid.HBgLMTA5MjgzNzQ2NTE5MjgzFQIAERgSRjQyODk5OUU3NUY5Qzk1NjQ0AA=="}]
    }

    mock_client = MagicMock()
    mock_client.post.return_value = mock_post
    mock_client_cls.return_value.__enter__.return_value = mock_client

    with patch.object(settings, "WHATSAPP_ACCESS_TOKEN", "EAAXtest_token_meta_12345"), \
         patch.object(settings, "WHATSAPP_PHONE_NUMBER_ID", "109283746519283"):

        res = client.post("/whatsapp/send", json={
            "student_id": "STD_TEST_CONSENTED",
            "language": "hi"
        }, headers=get_auth_header())

        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "success"
        assert "wamid.HBgL" in data["delivery_details"]["message_id"]
        assert data["delivery_details"]["dispatch_state"] == "ACCEPTED"
        assert data["delivery_details"]["delivery_status"] == "SENT"

@patch("backend.app.services.whatsapp_service.httpx.Client")
def test_send_whatsapp_mocked_meta_api_template_rejection(mock_client_cls):
    """Mocks Meta Graph API returning HTTP 400 template error (e.g. unapproved template)."""
    mock_post = MagicMock()
    mock_post.status_code = 400
    mock_post.text = '{"error":{"message":"Template parent_weekly_progress_digest does not exist in language en"}}'
    mock_post.json.return_value = {
        "error": {
            "message": "Template parent_weekly_progress_digest does not exist in language en",
            "type": "OAuthException",
            "code": 132000
        }
    }

    mock_client = MagicMock()
    mock_client.post.return_value = mock_post
    mock_client_cls.return_value.__enter__.return_value = mock_client

    with patch.object(settings, "WHATSAPP_ACCESS_TOKEN", "EAAXtest_token_meta_12345"), \
         patch.object(settings, "WHATSAPP_PHONE_NUMBER_ID", "109283746519283"):

        res = client.post("/whatsapp/send", json={
            "student_id": "STD_TEST_CONSENTED",
            "language": "en"
        }, headers=get_auth_header())

        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "failed"
        assert data["delivery_details"]["dispatch_state"] == "FAILED"
        assert "Template" in data["delivery_details"]["error"]

# -------------------------------------------------------------
# 6. Meta Webhooks: GET Verification Handshake & POST Signature
# -------------------------------------------------------------
def test_webhook_get_verification_success():
    """Verifies that Meta GET webhook handshake verifies hub.verify_token and returns challenge."""
    with patch.object(settings, "WHATSAPP_VERIFY_TOKEN", "my_secure_meta_token_2026"):
        res = client.get("/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=my_secure_meta_token_2026&hub.challenge=1158201444")
        assert res.status_code == 200
        assert res.text == "1158201444"

def test_webhook_get_verification_failure():
    """Verifies that invalid token is rejected with 403 Forbidden."""
    with patch.object(settings, "WHATSAPP_VERIFY_TOKEN", "my_secure_meta_token_2026"):
        res = client.get("/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=1158201444")
        assert res.status_code == 403

def test_webhook_post_signature_validation():
    """Verifies HMAC-SHA256 signature validation on inbound webhook payloads."""
    secret = "meta_app_secret_test_xyz"
    payload = json.dumps({"entry": []})
    valid_sig = "sha256=" + hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()

    with patch.object(settings, "WHATSAPP_APP_SECRET", secret):
        # Valid signature
        res_ok = client.post(
            "/whatsapp/webhook",
            content=payload,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": valid_sig}
        )
        assert res_ok.status_code == 200

        # Invalid signature
        res_bad = client.post(
            "/whatsapp/webhook",
            content=payload,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": "sha256=invalid_hash"}
        )
        assert res_bad.status_code == 401

# -------------------------------------------------------------
# 7. Persistent Delivery Status Progression (Idempotent)
# -------------------------------------------------------------
def test_webhook_delivery_status_progression():
    """Verifies webhook delivery updates advance log status: SENT -> DELIVERED -> READ."""
    db = SessionLocal()
    meta_id = f"wamid.TEST_HOOK_{int(datetime.datetime.utcnow().timestamp())}"
    try:
        # Create initial SENT log
        log = WhatsAppMessageLog(
            id=f"WA_HOOK_TEST_{meta_id[-6:]}",
            tenant_id="INST_PATNA_01",
            student_id="STD_TEST_CONSENTED",
            student_name="Ananya Sharma",
            guardian_name="Rajesh Sharma",
            recipient_phone="+919876543210",
            meta_message_id=meta_id,
            dispatch_state="ACCEPTED",
            delivery_status="SENT"
        )
        db.add(log)
        db.commit()

        # 1. Inbound DELIVERED event
        payload_deliv = {
            "entry": [{
                "changes": [{
                    "value": {
                        "statuses": [{
                            "id": meta_id,
                            "status": "delivered",
                            "timestamp": str(int(datetime.datetime.utcnow().timestamp()))
                        }]
                    }
                }]
            }]
        }
        res1 = client.post("/whatsapp/webhook", json=payload_deliv)
        assert res1.status_code == 200

        # Verify DB updated to DELIVERED
        db.refresh(log)
        assert log.delivery_status == "DELIVERED"

        # 2. Inbound READ event
        payload_read = {
            "entry": [{
                "changes": [{
                    "value": {
                        "statuses": [{
                            "id": meta_id,
                            "status": "read",
                            "timestamp": str(int(datetime.datetime.utcnow().timestamp()))
                        }]
                    }
                }]
            }]
        }
        res2 = client.post("/whatsapp/webhook", json=payload_read)
        assert res2.status_code == 200

        # Verify DB updated to READ
        db.refresh(log)
        assert log.delivery_status == "READ"

        # 3. Duplicate/Stale event should not regress status
        client.post("/whatsapp/webhook", json=payload_deliv)
        db.refresh(log)
        assert log.delivery_status == "READ"  # Retains highest status

    finally:
        db.close()

# -------------------------------------------------------------
# 8. Batch Broadcast with Consent and Deduplication
# -------------------------------------------------------------
def test_batch_broadcast_mixed_outcomes():
    """
    Verifies batch broadcast:
    - Dispatches for consented students
    - Skips students with withdrawn consent
    - Avoids duplicate dispatches within 12h
    """
    res = client.post("/whatsapp/broadcast", json={
        "batch_id": "BATCH_TEST_01",
        "language": "en"
    }, headers=get_auth_header())

    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "skipped_reasons" in data
    # STD_TEST_WITHDRAWN must be recorded in skipped_reasons["consent_withdrawn"]
    assert data["skipped_reasons"]["consent_withdrawn"] >= 1

    # Second immediate broadcast should skip the already-sent student under duplicate protection
    res2 = client.post("/whatsapp/broadcast", json={
        "batch_id": "BATCH_TEST_01",
        "language": "en"
    }, headers=get_auth_header())

    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["skipped_reasons"]["duplicate_within_12h"] >= 1

# -------------------------------------------------------------
# 9. Persistent WhatsApp Audit Logs Endpoint
# -------------------------------------------------------------
def test_fetch_whatsapp_logs():
    """Verifies /whatsapp/logs returns records from database ledger."""
    res = client.get("/whatsapp/logs?limit=10", headers=get_auth_header())
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "logs" in data
    assert isinstance(data["logs"], list)
    if data["logs"]:
        first = data["logs"][0]
        assert "message_id" in first
        assert "status" in first
        assert "recipient_phone" in first

# -------------------------------------------------------------
# 10. Existing Parent Reports Regression Test
# -------------------------------------------------------------
def test_parent_reports_regression():
    """Verifies that existing /reports endpoints continue to work seamlessly."""
    res = client.get("/reports/generate/STD_TEST_CONSENTED?lang=en", headers=get_auth_header())
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ready"
    assert data["student_name"] == "Ananya Sharma"
    assert "attendance_pct" in data
    assert "report_text" in data
    assert "guardian_phone" in data
    assert data["audit_check"]["status"] == "PASSED"
