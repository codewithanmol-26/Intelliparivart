"""
Intelliprivart Data Moat - Data Validation & Schema Audit Pipeline
Provides relational integrity verification, foreign key checks, duplicate detection,
range validation, review queue management, and target leakage prevention.
"""

from typing import Dict, List, Tuple, Any
import pandas as pd
import numpy as np

def validate_dataset_integrity(dataset: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
    """
    Executes automated data integrity checks across all 11 relational tables.
    Returns audit status, violations, and summary counts.
    """
    violations = []
    checks_passed = 0
    checks_failed = 0

    # 1. Primary Tables Presence
    required_tables = [
        "institutes", "batches", "syllabus_topics", "questions", "students",
        "tests", "test_responses", "attendance", "fees", "engagement", "outcomes"
    ]
    for tbl in required_tables:
        if tbl not in dataset or dataset[tbl].empty:
            violations.append(f"Missing or empty required table: {tbl}")
            checks_failed += 1
        else:
            checks_passed += 1

    df_inst = dataset["institutes"]
    df_batch = dataset["batches"]
    df_std = dataset["students"]
    df_q = dataset["questions"]
    df_resp = dataset["test_responses"]
    df_out = dataset["outcomes"]
    df_attn = dataset["attendance"]
    df_fees = dataset["fees"]

    # 2. Key Uniqueness Checks
    if df_inst["institute_id"].duplicated().any():
        violations.append("Duplicate primary keys detected in institutes.institute_id")
        checks_failed += 1
    else:
        checks_passed += 1

    if df_std["student_id"].duplicated().any():
        violations.append("Duplicate primary keys detected in students.student_id")
        checks_failed += 1
    else:
        checks_passed += 1

    if df_q["question_id"].duplicated().any():
        violations.append("Duplicate primary keys detected in questions.question_id")
        checks_failed += 1
    else:
        checks_passed += 1

    # 3. Foreign Key Integrity Checks
    inst_ids = set(df_inst["institute_id"])
    std_inst_diff = set(df_std["institute_id"]) - inst_ids
    if std_inst_diff:
        violations.append(f"Foreign key mismatch: students.institute_id contains unknown IDs: {std_inst_diff}")
        checks_failed += 1
    else:
        checks_passed += 1

    std_ids = set(df_std["student_id"])
    resp_std_diff = set(df_resp["student_id"]) - std_ids
    if resp_std_diff:
        violations.append(f"Foreign key mismatch: test_responses.student_id contains unknown students: {len(resp_std_diff)}")
        checks_failed += 1
    else:
        checks_passed += 1

    q_ids = set(df_q["question_id"])
    resp_q_diff = set(df_resp["question_id"]) - q_ids
    if resp_q_diff:
        violations.append(f"Foreign key mismatch: test_responses.question_id contains unknown questions: {len(resp_q_diff)}")
        checks_failed += 1
    else:
        checks_passed += 1

    out_std_diff = set(df_out["student_id"]) - std_ids
    if out_std_diff:
        violations.append(f"Foreign key mismatch: outcomes.student_id contains unknown students: {len(out_std_diff)}")
        checks_failed += 1
    else:
        checks_passed += 1

    # 4. Domain & Range Constraints
    if not df_resp["is_correct"].isin([0, 1]).all():
        violations.append("Range violation: test_responses.is_correct contains non-binary values")
        checks_failed += 1
    else:
        checks_passed += 1

    if not df_attn["present_flag"].isin([0, 1]).all():
        violations.append("Range violation: attendance.present_flag contains non-binary values")
        checks_failed += 1
    else:
        checks_passed += 1

    # 5. Dropout Label Prevalence Verification
    n_drop = df_out["dropped_out_flag"].sum()
    n_total = len(df_out)
    drop_pct = (n_drop / n_total) * 100
    if not (8.0 <= drop_pct <= 16.0):
        violations.append(f"Prevalence warning: simulated dropout rate {drop_pct:.1f}% outside 8%-16% target band")
        checks_failed += 1
    else:
        checks_passed += 1

    # 6. Target Leakage Verification
    # Confirm outcomes table is decoupled from early features
    overlap_cols = set(df_std.columns).intersection(set(df_out.columns)) - {"student_id"}
    if overlap_cols:
        violations.append(f"Target leakage hazard: shared columns between students and outcomes: {overlap_cols}")
        checks_failed += 1
    else:
        checks_passed += 1

    return {
        "status": "PASSED" if checks_failed == 0 else "FAILED",
        "checks_passed": checks_passed,
        "checks_failed": checks_failed,
        "violations": violations,
        "summary": {
            "institutes_count": len(df_inst),
            "batches_count": len(df_batch),
            "students_count": len(df_std),
            "questions_count": len(df_q),
            "test_responses_count": len(df_resp),
            "attendance_records_count": len(df_attn),
            "fees_records_count": len(df_fees),
            "dropout_count": int(n_drop),
            "dropout_percentage": round(drop_pct, 2)
        }
    }

def process_upload_review_queue(
    raw_df: pd.DataFrame,
    valid_student_ids: set,
    valid_question_ids: set
) -> Tuple[pd.DataFrame, pd.DataFrame, List[Dict[str, Any]]]:
    """
    Simulates a CSV/Excel import review queue. Segregates valid records from
    malformed/unknown records and generates an audit manifest.
    """
    valid_rows = []
    quarantine_rows = []
    audit_manifest = []

    for idx, row in raw_df.iterrows():
        reasons = []
        # Check student ID
        sid = row.get("student_id")
        if pd.isna(sid) or str(sid).strip() == "":
            reasons.append("Missing mandatory student_id")
        elif sid not in valid_student_ids:
            reasons.append(f"Unknown student_id '{sid}' not in active roster")

        # Check question ID if present
        if "question_id" in row:
            qid = row.get("question_id")
            if pd.isna(qid) or qid not in valid_question_ids:
                reasons.append(f"Invalid question_id '{qid}'")

        # Check response if present
        if "is_correct" in row:
            corr = row.get("is_correct")
            if corr not in [0, 1, "0", "1"]:
                reasons.append(f"Invalid score value '{corr}'")

        if reasons:
            quarantine_dict = row.to_dict()
            quarantine_dict["rejection_reasons"] = " | ".join(reasons)
            quarantine_dict["row_index"] = idx + 1
            quarantine_rows.append(quarantine_dict)
            audit_manifest.append({
                "row_number": idx + 1,
                "status": "REJECTED",
                "details": " | ".join(reasons)
            })
        else:
            valid_rows.append(row.to_dict())
            audit_manifest.append({
                "row_number": idx + 1,
                "status": "ACCEPTED",
                "details": "Passed all schema and foreign-key constraints"
            })

    return pd.DataFrame(valid_rows), pd.DataFrame(quarantine_rows), audit_manifest
