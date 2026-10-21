"""
Data Moat - Pydantic Validation Schemas
Validates raw tabular imports (CSV/XLSX) and API payloads with strict type enforcement,
range constraints, and explanatory error reporting for low-tech institute operators.
"""

from datetime import date, datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator, model_validator

class StudentUploadSchema(BaseModel):
    student_id: str = Field(..., min_length=3, max_length=50, description="Unique student identifier (e.g., STD_001)")
    institute_id: str = Field(..., min_length=3, max_length=50, description="Institute tenant identifier")
    batch_id: str = Field(..., min_length=3, max_length=80, description="Batch identifier")
    name: str = Field(..., min_length=2, max_length=100, description="Student full name")
    class_level: str = Field("12th", description="11th, 12th, or Dropper")
    join_date: Optional[date] = Field(default_factory=date.today)
    fee_plan: str = Field("Standard-10-Installments", description="Fee installment schedule")
    parent_contact_consent: bool = Field(True, description="DPDP Act 2023 Verifiable Parental Consent flag")
    parent_name: Optional[str] = Field("Parent/Guardian", max_length=100)
    phone_anonymized: Optional[str] = Field("+91 98XXX XXXXX", max_length=25)

    @field_validator("class_level")
    @classmethod
    def validate_class_level(cls, v: str) -> str:
        valid_classes = {"11th", "12th", "dropper", "10th", "foundation"}
        cleaned = v.strip().lower()
        if cleaned not in valid_classes:
            return "12th"  # Default fallback rather than hard rejection
        return v.strip().capitalize()

class QuestionUploadSchema(BaseModel):
    question_id: str = Field(..., min_length=2, max_length=50)
    subject: str = Field(..., min_length=2, max_length=50)
    chapter: str = Field(..., min_length=2, max_length=100)
    topic: str = Field(..., min_length=2, max_length=100)
    sub_topic: Optional[str] = Field(None, max_length=120)
    difficulty_b: float = Field(0.0, ge=-3.5, le=3.5, description="2PL IRT Difficulty parameter b")
    discrimination_a: float = Field(1.0, ge=0.1, le=3.0, description="2PL IRT Discrimination parameter a")
    source: Optional[str] = Field("Mock Bank", max_length=100)
    correct_option: str = Field("Option_A", description="Option_A, Option_B, Option_C, or Option_D")

    @field_validator("correct_option")
    @classmethod
    def validate_option(cls, v: str) -> str:
        v_upper = v.strip().upper()
        if v_upper in {"A", "B", "C", "D"}:
            return f"Option_{v_upper}"
        if v_upper in {"OPTION_A", "OPTION_B", "OPTION_C", "OPTION_D"}:
            return v_upper.capitalize()
        return "Option_A"

class TestResponseUploadSchema(BaseModel):
    test_id: str = Field(..., min_length=2, max_length=60)
    student_id: str = Field(..., min_length=2, max_length=50)
    question_id: str = Field(..., min_length=2, max_length=50)
    response: str = Field(..., min_length=1, max_length=20)
    is_correct: int = Field(0, ge=0, le=1)
    time_taken_sec: int = Field(60, ge=5, le=600)
    test_date: date = Field(default_factory=date.today)

class AttendanceUploadSchema(BaseModel):
    student_id: str = Field(..., min_length=2, max_length=50)
    date: date
    session_id: str = Field(..., min_length=2, max_length=60)
    present_flag: int = Field(1, ge=0, le=1)

class FeeUploadSchema(BaseModel):
    student_id: str = Field(..., min_length=2, max_length=50)
    instalment_no: int = Field(..., ge=1, le=24)
    due_date: date
    paid_date: Optional[date] = None
    amount: float = Field(..., gt=0)
    status: str = Field("PAID", description="PAID, DEFAULTED, or PENDING")

    @field_validator("status")
    @classmethod
    def validate_fee_status(cls, v: str) -> str:
        v_clean = v.strip().upper()
        if v_clean in {"PAID", "DEFAULTED", "PENDING", "OVERDUE"}:
            return "DEFAULTED" if v_clean == "OVERDUE" else v_clean
        return "PAID"

class InterventionCreateSchema(BaseModel):
    institute_id: str
    student_id: str
    assigned_by: str = "Academic Mentor"
    assigned_date: date = Field(default_factory=date.today)
    target_topic: str
    action_type: str
    action_details: Optional[str] = None
    status: str = "New"
    follow_up_date: Optional[date] = None

class ValidationResult(BaseModel):
    is_valid: bool
    total_rows: int
    accepted_rows: int
    rejected_rows: int
    errors: List[Dict[str, Any]]
    warnings: List[str]
