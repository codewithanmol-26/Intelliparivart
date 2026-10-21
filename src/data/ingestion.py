"""
Data Moat - Data Ingestion, Column Mapping, and Quarantine Service
Handles parsing, schema inference, fuzzy column normalization, Pydantic validation,
and database persistence for tabular institute datasets (CSV and Excel).
"""

import io
from typing import Dict, List, Tuple, Any, Optional
import pandas as pd
from pydantic import ValidationError
from datetime import datetime, date
from sqlalchemy.orm import Session
from src.schemas.validation import (
    StudentUploadSchema, QuestionUploadSchema, TestResponseUploadSchema,
    AttendanceUploadSchema, FeeUploadSchema, ValidationResult
)
from src.database.models import Student, Question, TestResponse, Attendance, Fee, Batch, Institute, AuditLog

# Column aliases for fuzzy matching common coaching institute spreadsheets
COLUMN_ALIASES: Dict[str, List[str]] = {
    # Students
    "student_id": ["student_id", "roll_no", "rollno", "enrollment_no", "reg_no", "id", "admission_no", "std_id"],
    "institute_id": ["institute_id", "inst_id", "center_id", "branch_id", "campus_id"],
    "batch_id": ["batch_id", "batch", "section", "class_section", "batch_name"],
    "name": ["name", "student_name", "candidate_name", "full_name", "student"],
    "class_level": ["class_level", "class", "grade", "standard", "year"],
    "join_date": ["join_date", "admission_date", "date_of_joining", "doj"],
    "fee_plan": ["fee_plan", "fee_schedule", "plan", "payment_plan"],
    "parent_contact_consent": ["parent_contact_consent", "vpc_consent", "consent", "parent_consent"],
    "parent_name": ["parent_name", "guardian_name", "father_name", "parent"],
    "phone_anonymized": ["phone_anonymized", "phone", "mobile", "contact_no", "phone_no"],

    # Test Responses
    "test_id": ["test_id", "exam_id", "mock_id", "paper_id", "test_name"],
    "question_id": ["question_id", "q_id", "qid", "question_no", "qno"],
    "response": ["response", "marked_option", "student_response", "selected_option", "ans"],
    "is_correct": ["is_correct", "correct_flag", "result", "score", "correct"],
    "time_taken_sec": ["time_taken_sec", "time_sec", "duration_sec", "time_spent"],
    "test_date": ["test_date", "exam_date", "date"],

    # Attendance
    "date": ["date", "attendance_date", "session_date", "day"],
    "session_id": ["session_id", "lecture_id", "period", "slot"],
    "present_flag": ["present_flag", "present", "attendance", "status", "is_present"],

    # Fees
    "instalment_no": ["instalment_no", "installment_no", "inst_no", "installment"],
    "due_date": ["due_date", "due_on"],
    "paid_date": ["paid_date", "payment_date", "received_date"],
    "amount": ["amount", "fee_amount", "installment_amount", "inr"],
    "status": ["status", "payment_status", "fee_status"]
}

def auto_map_columns(df_columns: List[str]) -> Dict[str, str]:
    """
    Fuzzy maps uploaded dataframe columns to canonical schema fields.
    Returns {uploaded_col: target_canonical_col}.
    """
    mapping = {}
    normalized_uploaded = {col: col.strip().lower().replace(" ", "_") for col in df_columns}

    for orig_col, norm_col in normalized_uploaded.items():
        matched = False
        for target_field, aliases in COLUMN_ALIASES.items():
            if norm_col in aliases:
                mapping[orig_col] = target_field
                matched = True
                break
        if not matched:
            mapping[orig_col] = orig_col  # keep original if no alias matches
    return mapping

def generate_template_csv(entity_type: str) -> str:
    """Generates sample CSV template for download by institute staff."""
    if entity_type == "students":
        df = pd.DataFrame([{
            "student_id": "STD_001",
            "institute_id": "INST_PATNA_01",
            "batch_id": "INST_PATNA_01_B1_JEE",
            "name": "Rohan Sharma",
            "class_level": "12th",
            "join_date": "2025-04-01",
            "fee_plan": "Standard-10-Installments",
            "parent_contact_consent": "True",
            "parent_name": "Rajesh Sharma",
            "phone_anonymized": "+91 98XXX X1234"
        }])
    elif entity_type == "test_scores":
        df = pd.DataFrame([{
            "test_id": "TEST_MOCK_01",
            "student_id": "STD_001",
            "question_id": "Q_001",
            "response": "Option_A",
            "is_correct": 1,
            "time_taken_sec": 75,
            "test_date": "2025-04-15"
        }])
    elif entity_type == "attendance":
        df = pd.DataFrame([{
            "student_id": "STD_001",
            "date": "2025-04-16",
            "session_id": "SESSION_20250416",
            "present_flag": 1
        }])
    elif entity_type == "fees":
        df = pd.DataFrame([{
            "student_id": "STD_001",
            "instalment_no": 1,
            "due_date": "2025-04-01",
            "paid_date": "2025-04-03",
            "amount": 6000.0,
            "status": "PAID"
        }])
    else:
        df = pd.DataFrame()
    return df.to_csv(index=False)

def validate_and_import_students(
    df: pd.DataFrame,
    column_mapping: Dict[str, str],
    current_institute_id: str,
    db: Session,
    user_role: str = "Teacher"
) -> Tuple[ValidationResult, int, int]:
    """
    Validates student rows via Pydantic and persists them to the database
    with tenant-isolation verification.
    """
    # Rename columns based on mapping
    df_renamed = df.rename(columns=column_mapping)
    total_rows = len(df_renamed)
    accepted_rows = 0
    rejected_rows = 0
    errors = []
    warnings = []

    # Ensure institute_id is present or default to current_institute_id
    if "institute_id" not in df_renamed.columns:
        df_renamed["institute_id"] = current_institute_id

    for idx, row in df_renamed.iterrows():
        row_dict = row.dropna().to_dict()
        row_dict["institute_id"] = current_institute_id  # Enforce tenant isolation

        try:
            validated = StudentUploadSchema(**row_dict)
            
            # Upsert into database
            existing = db.query(Student).filter(
                Student.student_id == validated.student_id,
                Student.institute_id == current_institute_id
            ).first()

            if existing:
                existing.name = validated.name
                existing.batch_id = validated.batch_id
                existing.class_level = validated.class_level
                existing.fee_plan = validated.fee_plan
                existing.parent_contact_consent = validated.parent_contact_consent
                existing.parent_name = validated.parent_name
                existing.phone_anonymized = validated.phone_anonymized
            else:
                new_std = Student(
                    student_id=validated.student_id,
                    institute_id=current_institute_id,
                    batch_id=validated.batch_id,
                    name=validated.name,
                    class_level=validated.class_level,
                    join_date=validated.join_date or date.today(),
                    fee_plan=validated.fee_plan,
                    parent_contact_consent=validated.parent_contact_consent,
                    parent_name=validated.parent_name or "Parent/Guardian",
                    phone_anonymized=validated.phone_anonymized or "+91 98XXX XXXXX"
                )
                db.add(new_std)
            accepted_rows += 1
        except ValidationError as ve:
            rejected_rows += 1
            for err in ve.errors():
                errors.append({
                    "row": idx + 1,
                    "field": ".".join(str(loc) for loc in err["loc"]),
                    "message": err["msg"],
                    "value": row_dict.get(err["loc"][0]) if err["loc"] else None
                })
        except Exception as e:
            rejected_rows += 1
            errors.append({
                "row": idx + 1,
                "field": "system",
                "message": str(e),
                "value": None
            })

    # Record Audit Log
    db.add(AuditLog(
        institute_id=current_institute_id,
        user_role=user_role,
        action="IMPORT_STUDENTS",
        entity_type="Student",
        entity_id=f"BATCH_{len(df_renamed)}",
        details=f"Imported students. Accepted: {accepted_rows}, Rejected: {rejected_rows}"
    ))

    db.commit()

    result = ValidationResult(
        is_valid=rejected_rows == 0,
        total_rows=total_rows,
        accepted_rows=accepted_rows,
        rejected_rows=rejected_rows,
        errors=errors[:100],  # Cap error list to prevent UI lag
        warnings=warnings
    )
    return result, accepted_rows, rejected_rows

def validate_and_import_test_responses(
    df: pd.DataFrame,
    column_mapping: Dict[str, str],
    current_institute_id: str,
    db: Session,
    user_role: str = "Teacher"
) -> Tuple[ValidationResult, int, int]:
    """Validates test score rows and persists to database."""
    df_renamed = df.rename(columns=column_mapping)
    total_rows = len(df_renamed)
    accepted_rows = 0
    rejected_rows = 0
    errors = []
    warnings = []

    # Get set of valid student IDs for this institute to prevent cross-tenant ingestion
    valid_student_ids = set(
        s[0] for s in db.query(Student.student_id).filter(Student.institute_id == current_institute_id).all()
    )

    responses_to_add = []
    for idx, row in df_renamed.iterrows():
        row_dict = row.dropna().to_dict()
        try:
            validated = TestResponseUploadSchema(**row_dict)
            
            # Foreign key / tenant check
            if validated.student_id not in valid_student_ids:
                rejected_rows += 1
                errors.append({
                    "row": idx + 1,
                    "field": "student_id",
                    "message": f"Student '{validated.student_id}' does not belong to active institute ({current_institute_id})",
                    "value": validated.student_id
                })
                continue

            responses_to_add.append(TestResponse(
                test_id=validated.test_id,
                student_id=validated.student_id,
                question_id=validated.question_id,
                response=validated.response,
                is_correct=validated.is_correct,
                time_taken_sec=validated.time_taken_sec,
                test_date=validated.test_date
            ))
            accepted_rows += 1
        except ValidationError as ve:
            rejected_rows += 1
            for err in ve.errors():
                errors.append({
                    "row": idx + 1,
                    "field": ".".join(str(loc) for loc in err["loc"]),
                    "message": err["msg"],
                    "value": row_dict.get(err["loc"][0]) if err["loc"] else None
                })

    if responses_to_add:
        db.bulk_save_objects(responses_to_add)
        db.add(AuditLog(
            institute_id=current_institute_id,
            user_role=user_role,
            action="IMPORT_TEST_RESPONSES",
            entity_type="TestResponse",
            entity_id=f"ROWS_{accepted_rows}",
            details=f"Bulk imported {accepted_rows} test responses"
        ))
        db.commit()

    result = ValidationResult(
        is_valid=rejected_rows == 0,
        total_rows=total_rows,
        accepted_rows=accepted_rows,
        rejected_rows=rejected_rows,
        errors=errors[:100],
        warnings=warnings
    )
    return result, accepted_rows, rejected_rows
