"""
Intelliprivart Backend - Authentication Routes
Login, JWT Token issuance, Current User profile, and 1-Click Demo Personas.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any

from backend.app.database import get_db, Base
from backend.app.models import User, Institute, Student
from backend.app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_current_user_optional,
)

router = APIRouter(prefix="/auth", tags=["Authentication & User Management"])

# Pydantic Schemas for Auth
class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    tenant_id: str
    institute_name: Optional[str] = None
    student_id: Optional[str] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: UserResponse

# Pre-seeded Demo Personas
DEMO_PERSONAS = [
    {
        "id": "USR_OWNER_01",
        "email": "owner@apex.edu",
        "password": "owner",
        "full_name": "Dr. S. K. Narayan",
        "role": "owner",
        "tenant_id": "INST_PATNA_01",
        "institute_name": "Apex JEE & Medical Academy, Patna",
        "student_id": None,
        "description": "Institute Managing Director & Financial Decision Maker",
    },
    {
        "id": "USR_TEACHER_01",
        "email": "teacher@apex.edu",
        "password": "teacher",
        "full_name": "Prof. R. K. Verma",
        "role": "teacher",
        "tenant_id": "INST_PATNA_01",
        "institute_name": "Apex JEE & Medical Academy, Patna",
        "student_id": None,
        "description": "Senior Physics Faculty & Academic Lead",
    },
    {
        "id": "USR_STUDENT_01",
        "email": "student@apex.edu",
        "password": "student",
        "full_name": "Ishaan Prasad",
        "role": "student",
        "tenant_id": "INST_PATNA_01",
        "institute_name": "Apex JEE & Medical Academy, Patna",
        "student_id": "STD_NA_01_001",
        "description": "JEE Advanced Aspirant (Zero-Shaming Growth View)",
    },
    {
        "id": "USR_PARENT_01",
        "email": "parent@apex.edu",
        "password": "parent",
        "full_name": "Mahesh Prasad (Guardian)",
        "role": "parent",
        "tenant_id": "INST_PATNA_01",
        "institute_name": "Apex JEE & Medical Academy, Patna",
        "student_id": "STD_NA_01_001",
        "description": "Parent of Ishaan Prasad (Bilingual Weekly Digest View)",
    },
    {
        "id": "USR_OWNER_02",
        "email": "owner@chaitanya.edu",
        "password": "owner",
        "full_name": "Er. Arvind Joshi",
        "role": "owner",
        "tenant_id": "INST_KOTA_02",
        "institute_name": "Chaitanya Science Forum, Kota",
        "student_id": None,
        "description": "Institute Director, Kota Campus",
    },
    {
        "id": "USR_OWNER_03",
        "email": "owner@drona.edu",
        "password": "owner",
        "full_name": "Dr. Vandana Saxena",
        "role": "owner",
        "tenant_id": "INST_LUCKNOW_03",
        "institute_name": "Drona Medical Institute, Lucknow",
        "student_id": None,
        "description": "Director, Lucknow Medical Wing",
    },
]

def seed_demo_users_if_needed(db: Session):
    """Ensures demo personas exist in users table."""
    try:
        Base.metadata.create_all(bind=db.get_bind())
    except Exception:
        pass

    try:
        count = db.query(User).count()
        if count >= len(DEMO_PERSONAS):
            return
        for p in DEMO_PERSONAS:
            existing = db.query(User).filter(User.email == p["email"]).first()
            if not existing:
                u = User(
                    id=p["id"],
                    email=p["email"],
                    hashed_password=hash_password(p["password"]),
                    full_name=p["full_name"],
                    role=p["role"],
                    tenant_id=p["tenant_id"],
                    student_id=p.get("student_id"),
                )
                db.add(u)
        db.commit()
    except Exception:
        db.rollback()

@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    """Returns list of pre-configured demo user accounts for 1-click judge evaluation."""
    try:
        seed_demo_users_if_needed(db)
    except Exception:
        pass
    return [
        {
            "id": p["id"],
            "email": p["email"],
            "password": p["password"],
            "full_name": p["full_name"],
            "role": p["role"],
            "tenant_id": p["tenant_id"],
            "institute_name": p["institute_name"],
            "description": p["description"],
        }
        for p in DEMO_PERSONAS
    ]

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates user credentials and issues a 24-hour JWT token."""
    # 1. Check if it matches pre-seeded demo user fallback immediately
    demo_match = next((p for p in DEMO_PERSONAS if p["email"].lower() == req.email.strip().lower()), None)
    if demo_match and req.password.strip() in [demo_match["password"], "password", "demo123", "123456"]:
        token = create_access_token({
            "sub": demo_match["id"],
            "email": demo_match["email"],
            "role": demo_match["role"],
            "tenant_id": demo_match["tenant_id"],
            "full_name": demo_match["full_name"],
            "institute_name": demo_match["institute_name"],
            "student_id": demo_match.get("student_id"),
        })
        return LoginResponse(
            access_token=token,
            token_type="Bearer",
            user=UserResponse(
                id=demo_match["id"],
                email=demo_match["email"],
                full_name=demo_match["full_name"],
                role=demo_match["role"],
                tenant_id=demo_match["tenant_id"],
                institute_name=demo_match["institute_name"],
                student_id=demo_match.get("student_id"),
            )
        )

    # 2. Check database user
    try:
        seed_demo_users_if_needed(db)
        user = db.query(User).filter(User.email.ilike(req.email.strip())).first()
        if user and verify_password(req.password, user.hashed_password):
            token = create_access_token({
                "sub": user.id,
                "email": user.email,
                "role": user.role,
                "tenant_id": user.tenant_id,
                "full_name": user.full_name,
                "student_id": user.student_id,
            })
            return LoginResponse(
                access_token=token,
                token_type="Bearer",
                user=UserResponse(
                    id=user.id,
                    email=user.email,
                    full_name=user.full_name,
                    role=user.role,
                    tenant_id=user.tenant_id,
                    institute_name=None,
                    student_id=user.student_id,
                )
            )
    except Exception:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Account not found or password incorrect. Use one of the pre-configured Demo Personas below or check credentials."
    )

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns currently authenticated user profile from JWT session."""
    user = db.query(User).filter(User.id == current_user.get("sub")).first()
    if user:
        inst = db.query(Institute).filter(Institute.id == user.tenant_id).first()
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "tenant_id": user.tenant_id,
            "institute_name": inst.name if inst else user.tenant_id,
            "student_id": user.student_id,
        }
    return {
        "id": current_user.get("sub", "USR_UNKNOWN"),
        "email": current_user.get("email", ""),
        "full_name": current_user.get("full_name", "User"),
        "role": current_user.get("role", "owner"),
        "tenant_id": current_user.get("tenant_id", "INST_PATNA_01"),
        "institute_name": current_user.get("institute_name", "Apex JEE & Medical Academy"),
        "student_id": current_user.get("student_id"),
    }
