"""
Test suite for new Round 2 Working Prototype Features:
1. Overview Dashboard API
2. Student Analytics & 6-Tab Profile
3. Intervention Tracker CRUD
4. CSV Reports & Data Exports
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_overview_dashboard_kpis():
    resp = client.get("/api/overview", headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert resp.status_code == 200
    data = resp.json()
    assert "kpis" in data
    assert "total_active_students" in data["kpis"]
    assert "tests_processed" in data["kpis"]
    assert "students_requiring_support" in data["kpis"]
    assert "average_topic_mastery_pct" in data["kpis"]
    assert "priority_actions" in data
    assert len(data["priority_actions"]) > 0
    assert "recent_activities" in data

def test_students_list_and_filter():
    resp = client.get("/api/students?limit=10", headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert resp.status_code == 200
    data = resp.json()
    assert "students" in data
    assert "total" in data
    assert len(data["students"]) <= 10
    if len(data["students"]) > 0:
        first = data["students"][0]
        assert "student_id" in first
        assert "name" in first
        assert "batch_name" in first
        assert "risk_tier" in first

def test_student_detail_six_tabs():
    resp = client.get("/api/students/STD_PAT_001", headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert resp.status_code == 200
    data = resp.json()
    assert "overview" in data
    assert "test_history" in data
    assert "topic_mastery" in data
    assert "attendance_engagement" in data
    assert "recommendations" in data
    assert "intervention_history" in data
    assert data["overview"]["student_id"] == "STD_PAT_001"

def test_interventions_crud_workflow():
    # 1. List
    resp = client.get("/api/interventions", headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert resp.status_code == 200
    data = resp.json()
    assert "interventions" in data
    assert "summary" in data

    # 2. Create
    create_payload = {
        "student_id": "STD_PAT_001",
        "intervention_type": "1-on-1 Faculty Mentorship",
        "reason": "Test Suite Validation of Mentorship",
        "assigned_to": "Er. R. K. Verma (Physics)",
        "follow_up_date": "2026-11-01",
        "outcome_notes": "Initial diagnostic assigned"
    }
    c_resp = client.post("/api/interventions", json=create_payload, headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert c_resp.status_code == 200
    created = c_resp.json()["intervention"]
    int_id = created["id"]
    assert created["student_id"] == "STD_PAT_001"
    assert created["status"] == "ASSIGNED"

    # 3. Update
    update_payload = {
        "status": "COMPLETED",
        "outcome_notes": "Student score increased by 18% in subsequent mock test"
    }
    u_resp = client.patch(f"/api/interventions/{int_id}", json=update_payload, headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert u_resp.status_code == 200
    updated = u_resp.json()["intervention"]
    assert updated["status"] == "COMPLETED"
    assert "18%" in updated["outcome_notes"]

    # 4. Delete
    d_resp = client.delete(f"/api/interventions/{int_id}", headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert d_resp.status_code == 200

def test_exports_endpoints():
    # Test Topic Mastery CSV
    r_mastery = client.get("/api/exports/mastery.csv", headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert r_mastery.status_code == 200
    assert "text/csv" in r_mastery.headers["content-type"]
    assert "Student_ID" in r_mastery.text

    # Test Risk Alerts CSV
    r_risk = client.get("/api/exports/risk-alerts.csv", headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert r_risk.status_code == 200
    assert "text/csv" in r_risk.headers["content-type"]
    assert "Calibrated_Risk_Score" in r_risk.text

def test_genai_endpoints():
    # 1. GenAI Status Check
    r_status = client.get("/api/genai/status")
    assert r_status.status_code == 200
    status_data = r_status.json()
    assert "status" in status_data
    assert "default_model" in status_data
    assert status_data["has_api_key"] is True

    # 2. Worksheet Generation Check
    worksheet_payload = {
        "topic": "Rotational Dynamics",
        "subject": "Physics",
        "target_exam": "JEE Advanced",
        "student_name": "Ananya Pandey",
        "weakness_reason": "Topic mastery slump after Milestone 4"
    }
    r_worksheet = client.post("/api/genai/worksheet", json=worksheet_payload, headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert r_worksheet.status_code == 200
    ws_data = r_worksheet.json()
    assert "worksheet" in ws_data
    assert "practice_questions" in ws_data["worksheet"]
    assert len(ws_data["worksheet"]["practice_questions"]) >= 1

    # 3. Copilot Consultation Check
    copilot_payload = {
        "message": "How do I help a student struggling with torque and moment of inertia?",
        "context": "Physics Faculty"
    }
    r_copilot = client.post("/api/genai/copilot", json=copilot_payload, headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert r_copilot.status_code == 200
    copilot_data = r_copilot.json()
    assert "reply" in copilot_data
    assert len(copilot_data["reply"]) > 20

def test_auth_register_endpoint():
    import uuid
    random_email = f"director_{uuid.uuid4().hex[:6]}@vidyapeeth.edu"
    payload = {
        "institute_name": "Vidyapeeth Career Institute, Patna",
        "admin_name": "Prof. Alok Mukherjee",
        "email": random_email,
        "password": "secure_password_123",
        "phone": "+91 98765 00112",
        "city": "Patna",
        "city_tier": "Tier-2",
        "exam_focus": "JEE Advanced",
        "cohort_size": 750,
        "role": "owner"
    }
    r_reg = client.post("/api/auth/register", json=payload)
    assert r_reg.status_code == 200
    data = r_reg.json()
    assert "access_token" in data
    assert data["token_type"] == "Bearer"
    user = data["user"]
    assert user["email"] == random_email
    assert user["full_name"] == "Prof. Alok Mukherjee"
    assert "INST_" in user["tenant_id"]

def test_whatsapp_endpoints():
    # Status must distinguish live configuration from simulation.
    r_status = client.get("/api/whatsapp/status")
    assert r_status.status_code == 200
    st_data = r_status.json()
    assert st_data["status"] in {"configured", "invalid_configuration", "simulation_only"}

    # A send without a roster student cannot pass the parental-consent gate.
    send_payload = {
        "recipient_phone": "+91 98765 43210",
        "student_name": "Synthetic test student",
        "guardian_name": "Synthetic guardian",
        "language": "en"
    }
    r_send = client.post("/api/whatsapp/send", json=send_payload, headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert r_send.status_code == 422

    # Batch broadcasts are unavailable until live contacts and consent are supported.
    bcast_payload = {"batch_id": "INST_PATNA_01_B1_JEE_12", "language": "hi"}
    r_bcast = client.post("/api/whatsapp/broadcast", json=bcast_payload, headers={"X-Tenant-ID": "INST_PATNA_01"})
    assert r_bcast.status_code == 200
    assert r_bcast.json()["status"] == "unavailable"
    assert r_bcast.json()["total_dispatched"] == 0


def test_whatsapp_status_reports_unavailable_database(monkeypatch):
    from sqlalchemy.exc import OperationalError
    from backend.app.database import get_db

    class BrokenDatabase:
        def execute(self, *_args, **_kwargs):
            raise OperationalError("SELECT 1", {}, OSError("database unavailable"))

        def rollback(self):
            pass

    def override_db():
        yield BrokenDatabase()

    app.dependency_overrides[get_db] = override_db
    try:
        response = client.get("/api/whatsapp/status", headers={"X-Tenant-ID": "INST_TEST"})
        assert response.status_code == 200
        assert response.json()["database_status"] == "unavailable"
    finally:
        app.dependency_overrides.pop(get_db, None)


def test_whatsapp_send_fails_closed_when_database_unavailable(monkeypatch):
    from sqlalchemy.exc import OperationalError
    from backend.app.database import get_db
    from backend.app.services import whatsapp_service

    class BrokenDatabase:
        def query(self, *_args, **_kwargs):
            raise OperationalError("SELECT students", {}, OSError("database unavailable"))

        def rollback(self):
            pass

    def override_db():
        yield BrokenDatabase()

    def should_not_send(**_kwargs):
        pytest.fail("WhatsApp send must not happen unless consent can be checked")

    monkeypatch.setattr(whatsapp_service, "send_whatsapp_message", should_not_send)
    app.dependency_overrides[get_db] = override_db
    try:
        response = client.post(
            "/api/whatsapp/send",
            json={"recipient_phone": "+919876543210", "student_id": "STD_TEST"},
            headers={"X-Tenant-ID": "INST_TEST"},
        )
        assert response.status_code == 503
        assert "consent" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.pop(get_db, None)


def test_whatsapp_simulation_never_claims_delivery(monkeypatch):
    from backend.app.services import whatsapp_service

    monkeypatch.setattr(whatsapp_service, "get_whatsapp_config", lambda: {
        "has_live_token": False,
        "api_token": None,
        "phone_number_id": None,
        "account_id": None,
        "provider": "WhatsApp Simulation Gateway",
        "mode": "VERIFICATION_SIMULATION",
    })
    result = whatsapp_service.send_whatsapp_message(
        to_phone="9876543210",
        message_text="Synthetic test message",
        student_id="SYNTHETIC_TEST_STUDENT",
        student_name="Synthetic test student",
        tenant_id="SYNTHETIC_TEST_TENANT",
    )
    assert result["status"] == "simulated"
    assert result["delivery_status"] == "SIMULATED"
    assert result["message_id"] is None

def test_omr_ocr_endpoint():
    with open("data/omr_samples/sample_omr_clean.png", "rb") as f:
        img_bytes = f.read()

    files = {"file": ("sample_omr_clean.png", img_bytes, "image/png")}
    data = {"tenant_id": "INST_PATNA_01"}
    r_omr = client.post("/api/ingest/omr-scan", files=files, data=data)
    assert r_omr.status_code == 200
    omr_data = r_omr.json()
    assert "student_id" in omr_data
    assert "ocr_confidence" in omr_data
    assert "annotated_image" in omr_data
    assert len(omr_data["questions"]) == 20

    # OCR extracts the printed student ID; the printed sheet has no test ID.
    assert omr_data["student_id"] == "STD_PAT_001"
    assert omr_data["test_id"] is None
    assert omr_data["requires_human_review"] is True
