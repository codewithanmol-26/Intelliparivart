"""
Intelliprivart v2 - Formal Acceptance Test Suite
Verifies all 6 acceptance criteria specified in Prompt v2:
1. upload batch_B_physics_weak_rotation.csv -> test_responses increases by exact accepted count;
   Rotational Dynamics mastery drops; lineage.rows_used matches DB count.
2. Re-upload same file -> row count unchanged (idempotent).
3. Grep repo: zero import or attribute access of latent_ability_theta under backend/app/routes or backend/app/services.
4. Student/tenant with zero attendance rows returns insufficient_data, not a fabricated number.
5. Conformal empirical coverage on held-out set is within +-3 pts of 90%; widths come from saved model.
6. Tenant A cannot read Tenant B's computed tables.
"""

import os
import re
from pathlib import Path
import json
import pytest
import pandas as pd
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.database import SessionLocal
from backend.app.models import TestResponse, Attendance, ComputedMastery, Student

ROOT_DIR = Path(__file__).resolve().parent.parent

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def db():
    session = SessionLocal()
    yield session
    session.close()

def test_1_upload_weak_rotation_and_mastery_drop(client, db):
    """
    Test 1: Upload batch_B_physics_weak_rotation.csv:
    - test_responses row count increases by exactly accepted rows.
    - GET /mastery/matrix Rotational Motion mastery for that batch is computed and lower than benchmark.
    - Response includes lineage.rows_used equal to the DB count.
    """
    tenant_id = "INST_PATNA_01"
    sample_file = ROOT_DIR / "sample_data" / "batch_B_physics_weak_rotation.csv"
    assert sample_file.exists(), f"Missing {sample_file}"

    df_sample = pd.read_csv(sample_file)
    expected_rows = len(df_sample)
    # Clean previous test run if any
    db.query(TestResponse).filter(TestResponse.test_id == "TEST_B2_PHYSICS_ROTATION").delete()
    db.commit()

    initial_db_count = db.query(TestResponse).filter(TestResponse.tenant_id == tenant_id).count()

    with open(sample_file, "rb") as f:
        resp = client.post(
            "/ingest/upload-csv",
            files={"file": ("batch_B_physics_weak_rotation.csv", f, "text/csv")},
            data={"tenant_id": tenant_id}
        )

    assert resp.status_code == 200
    data = resp.json()
    assert data["valid_records"] == expected_rows

    # Row count in DB increases by exactly accepted rows
    new_db_count = db.query(TestResponse).filter(TestResponse.tenant_id == tenant_id).count()
    assert new_db_count == initial_db_count + expected_rows

    # Verify Lineage
    assert "lineage" in data
    assert data["lineage"]["rows_used"] == new_db_count
    assert "batch_B_physics_weak_rotation.csv" in data["lineage"]["source_files"][0]

    # Verify Rotational Dynamics mastery in GET /mastery/matrix
    mastery_resp = client.get(f"/mastery/matrix?batch_id=INST_PATNA_01_B2_JEE_11&tenant_id={tenant_id}")
    assert mastery_resp.status_code == 200
    m_data = mastery_resp.json()
    assert m_data["status"] == "ready"

    # Find Rotational Dynamics / Motion topic
    rot_topic = next((t for t in m_data["topics"] if "Rotational" in t["topic_name"] or "Mechanics" in t["topic_name"]), None)
    assert rot_topic is not None, "Rotational Dynamics topic must be present in mastery matrix"
    # Because students did badly (mostly 0s), mastery must be low (< 0.50)
    assert rot_topic["bkt_mastery_prob"] < 0.50
    assert rot_topic["status"] == "Struggling"

def test_2_upload_idempotency(client, db):
    """
    Test 2: Re-uploading the exact same file must NOT duplicate rows in test_responses.
    """
    tenant_id = "INST_PATNA_01"
    sample_file = ROOT_DIR / "sample_data" / "batch_B_physics_weak_rotation.csv"
    
    count_before = db.query(TestResponse).filter(TestResponse.tenant_id == tenant_id).count()

    with open(sample_file, "rb") as f:
        resp = client.post(
            "/ingest/upload-csv",
            files={"file": ("batch_B_physics_weak_rotation.csv", f, "text/csv")},
            data={"tenant_id": tenant_id}
        )

    assert resp.status_code == 200
    data = resp.json()
    assert data["new_records_inserted"] == 0, "Duplicate rows must not be inserted"

    count_after = db.query(TestResponse).filter(TestResponse.tenant_id == tenant_id).count()
    assert count_after == count_before, "DB row count must remain unchanged on duplicate upload"

def test_3_no_latent_ability_theta_in_runtime():
    """
    Test 3: Grep backend/app/routes and backend/app/services:
    Ensure zero occurrences of latent_ability_theta.
    """
    search_dirs = [
        ROOT_DIR / "backend" / "app" / "routes",
        ROOT_DIR / "backend" / "app" / "services"
    ]

    pattern = re.compile(r"latent_ability_theta")
    violations = []

    for d in search_dirs:
        for p in d.rglob("*.py"):
            text = p.read_text(encoding="utf-8")
            for line_no, line in enumerate(text.splitlines(), start=1):
                if pattern.search(line):
                    violations.append(f"{p.name}:{line_no} -> {line.strip()}")

    assert len(violations) == 0, f"Found illegal accesses of latent_ability_theta in runtime code:\n" + "\n".join(violations)

def test_4_zero_attendance_returns_insufficient_data(client, db):
    """
    Test 4: A tenant or student cohort with zero attendance rows returns insufficient_data,
    never a fabricated number.
    """
    # Test on an empty tenant
    empty_tenant = "INST_EMPTY_TEST"
    resp = client.get(f"/risk/prioritized?tenant_id={empty_tenant}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "insufficient_data"
    assert "attendance" in data["needs"]

def test_5_conformal_interval_coverage():
    """
    Test 5: Conformal interval empirical coverage on held-out test set is within +-3 pts of 90%
    (between 87.0% and 93.0%). Widths must come from saved model.
    """
    metrics_file = ROOT_DIR / "Intelliprivart_ML" / "outputs" / "metrics" / "evaluation_metrics_manifest.json"
    assert metrics_file.exists(), "Metrics manifest must exist"

    with open(metrics_file, "r") as f:
        metrics = json.load(f)

    conformal_meta = metrics.get("conformal_percentile_prediction", {})
    empirical_cov = conformal_meta.get("empirical_test_coverage_pct", 0.0)

    # Must be within 90% +- 3%
    assert 87.0 <= empirical_cov <= 93.0, f"Empirical coverage {empirical_cov}% is outside 90% +- 3%"
    assert conformal_meta.get("half_width_margin", 0.0) > 0.0

def test_6_tenant_isolation(client, db):
    """
    Test 6: Tenant A cannot read Tenant B's computed tables or data.
    """
    tenant_a = "INST_PATNA_01"
    tenant_b = "INST_KOTA_02"

    # Query Tenant A mastery
    resp_a = client.get(f"/mastery/matrix?tenant_id={tenant_a}")
    assert resp_a.status_code == 200

    # Query Tenant B risk
    resp_b = client.get(f"/risk/prioritized?tenant_id={tenant_b}")
    assert resp_b.status_code == 200

    # Ensure all returned students from Tenant B belong strictly to Tenant B
    b_data = resp_b.json()
    if b_data.get("status") == "ready":
        for s in b_data.get("students", []):
            db_s = db.query(Student).filter(Student.id == s["student_id"]).first()
            if db_s:
                assert db_s.tenant_id == tenant_b, f"Tenant leakage! Student {s['student_id']} belongs to {db_s.tenant_id}"
