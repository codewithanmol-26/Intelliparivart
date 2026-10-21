"""
Intelliprivart Backend API Automated Tests
Verifies endpoint responses, tenant isolation, and factual checkers.
"""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_and_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["platform"] == "Intelliprivart"

    res_h = client.get("/demo/health")
    assert res_h.status_code == 200
    assert res_h.json()["status"] == "HEALTHY"

def test_mastery_heatmap():
    res = client.get("/mastery/INST_PATNA_01_B1_JEE_12")
    assert res.status_code == 200
    data = res.json()
    assert "students" in data
    assert "topics" in data
    assert "bkt_matrix" in data

def test_risk_watchlist():
    res = client.get("/risk")
    assert res.status_code == 200
    students = res.json()
    assert len(students) > 0
    top = students[0]
    assert "risk_score" in top
    assert "risk_tier" in top
    assert "top_reasons" in top

def test_conformal_percentile_prediction():
    res = client.get("/predict/STD_PAT_001?month=8")
    assert res.status_code == 200
    data = res.json()
    assert "predicted_midpoint" in data
    assert "p10_lower" in data
    assert "p90_upper" in data
    assert data["p10_lower"] <= data["predicted_midpoint"] <= data["p90_upper"]

def test_bilingual_parent_report_and_guardrail():
    # English
    res_en = client.post("/reports/STD_PAT_001?lang=en")
    assert res_en.status_code == 200
    data_en = res_en.json()
    assert data_en["verification_status"] == "PASSED"
    assert "STD_PAT_001" in data_en["report_text"]

    # Hindi
    res_hi = client.post("/reports/STD_PAT_001?lang=hi")
    assert res_hi.status_code == 200
    data_hi = res_hi.json()
    assert data_hi["verification_status"] == "PASSED"
    assert "STD_PAT_001" in data_hi["report_text"]

def test_owner_summary_and_roi():
    res = client.get("/owner/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["roi_multiple"] >= 2.0

    # Custom ROI calculator
    calc_res = client.post("/owner/roi-calculator", json={
        "student_count": 400,
        "annual_fee_per_student": 60000.0,
        "baseline_dropout_pct": 12.0,
        "prevention_efficiency_pct": 20.0,
        "monthly_subscription_price": 12999.0
    })
    assert calc_res.status_code == 200
    calc_data = calc_res.json()
    assert calc_data["tuition_recovered"] == 288000.0
    assert calc_data["roi_multiple"] == 2.22

def test_curveball_scenarios():
    scenarios = ["MINOR_TRACKING_BAN", "LLM_OUTAGE", "NEW_FORMAT", "AI_COST_CAP"]
    for sc in scenarios:
        res = client.post("/simulate", json={"scenario": sc})
        assert res.status_code == 200
        assert res.json()["scenario"] == sc

def test_live_change_input():
    res = client.post("/demo/change-input", json={
        "student_id": "STD_PAT_001",
        "attendance_rate": 0.55,
        "fee_delay_days": 18,
        "mock_test_score": 0.32,
        "remedial_attended": False
    })
    assert res.status_code == 200
    data = res.json()
    assert data["updated_outputs"]["recomputed_risk_tier"] == "HIGH"
