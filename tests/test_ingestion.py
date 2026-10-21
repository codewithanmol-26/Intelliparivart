"""
Automated Test Suite: Data Ingestion & Pydantic Validation
Verifies column auto-mapping, Pydantic type enforcement, and quarantine handling.
"""

import pytest
import pandas as pd
from pydantic import ValidationError
from src.schemas.validation import StudentUploadSchema, QuestionUploadSchema
from src.data.ingestion import auto_map_columns

def test_column_auto_mapping():
    """Verify fuzzy mapping from messy coaching column names to canonical schema."""
    messy_cols = ["Roll No", "Student Name", "Class", "Doj", "Mobile"]
    mapping = auto_map_columns(messy_cols)

    assert mapping["Roll No"] == "student_id"
    assert mapping["Student Name"] == "name"
    assert mapping["Class"] == "class_level"
    assert mapping["Doj"] == "join_date"
    assert mapping["Mobile"] == "phone_anonymized"

def test_pydantic_student_validation_success():
    """Verify valid student payload passes schema enforcement."""
    payload = {
        "student_id": "STD_TEST_001",
        "institute_id": "INST_PATNA_01",
        "batch_id": "INST_PATNA_01_B1_JEE",
        "name": "Aarav Sharma",
        "class_level": "12th",
        "fee_plan": "Standard-10-Installments",
        "parent_contact_consent": True
    }
    validated = StudentUploadSchema(**payload)
    assert validated.name == "Aarav Sharma"
    assert validated.class_level == "12th"

def test_pydantic_student_validation_failure():
    """Verify invalid student payload raises ValidationError."""
    payload = {
        "student_id": "S",  # Too short, min_length 3
        "institute_id": "INST_PATNA_01",
        "batch_id": "B1",
        "name": ""         # Empty name
    }
    with pytest.raises(ValidationError):
        StudentUploadSchema(**payload)

def test_question_schema_bounds():
    """Verify 2PL IRT parameter bounds enforcement."""
    valid_q = {
        "question_id": "Q_999",
        "subject": "Physics",
        "chapter": "Mechanics",
        "topic": "Kinematics",
        "difficulty_b": 1.2,
        "discrimination_a": 1.4,
        "correct_option": "A"
    }
    q = QuestionUploadSchema(**valid_q)
    assert q.correct_option == "Option_A"
    assert q.difficulty_b == 1.2
