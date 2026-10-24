"""
Intelliprivart Backend - Authentication Test Suite
Tests JWT issuance, password verification, demo personas, and route protection.
"""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_demo_users_list():
    res = client.get("/auth/demo-users")
    assert res.status_code == 200
    users = res.json()
    assert len(users) >= 4
    roles = {u["role"] for u in users}
    assert "owner" in roles
    assert "teacher" in roles
    assert "student" in roles
    assert "parent" in roles

def test_successful_login():
    res = client.post("/auth/login", json={
        "email": "owner@apex.edu",
        "password": "owner"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "Bearer"
    assert data["user"]["role"] == "owner"
    assert data["user"]["email"] == "owner@apex.edu"

def test_auth_me_endpoint():
    # 1. Login to get token
    login_res = client.post("/auth/login", json={
        "email": "verma.physics@apex.edu",
        "password": "teacher"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # 2. Call /auth/me with Bearer token
    me_res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["role"] == "teacher"
    assert me_data["email"] == "verma.physics@apex.edu"

def test_invalid_login_rejection():
    res = client.post("/auth/login", json={
        "email": "owner@apex.edu",
        "password": "wrong_password_xyz"
    })
    assert res.status_code == 401
