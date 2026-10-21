"""
Data Moat - Synthetic Educational Dataset Generator
Generates realistic, internally consistent, multi-tenant datasets for 3 coaching institutes,
1,200 students, 80 calibrated IRT questions, 9 mock exams (66,000+ responses),
120 days attendance, fee ledgers, engagement logs, and ground truth outcomes.
Strictly complies with Section 08 & 13 of the Competition Specification.
"""

import os
import random
import datetime
from typing import Dict, List, Tuple
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from src.database.models import (
    Institute, Batch, Student, Question, Test, TestResponse, Attendance, Fee, Engagement, Outcome, Intervention, AuditLog
)

# Realistic synthetic Indian names for educational demonstration
FIRST_NAMES = [
    "Aarav", "Aditya", "Advait", "Akshat", "Ananya", "Aniket", "Anushka", "Aryan", "Ayush",
    "Bhavya", "Chirag", "Devansh", "Dhruv", "Diya", "Gauri", "Harsh", "Ishaan", "Jhanvi",
    "Kartik", "Khushi", "Kunal", "Manish", "Meera", "Mohit", "Navya", "Nikhil", "Pooja",
    "Pranav", "Priya", "Rahul", "Rhea", "Rishi", "Rohan", "Sakshi", "Sarthak", "Shaurya",
    "Shreya", "Sneha", "Soham", "Tanvi", "Utkarsh", "Vaishnavi", "Varun", "Vedant", "Vidhi",
    "Vikram", "Yash", "Yuvraj", "Tanmay", "Rishabh"
]

LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Patel", "Mishra", "Singh", "Kumar", "Yadav", "Tiwari",
    "Pandey", "Choudhary", "Jha", "Prasad", "Sinha", "Srivastava", "Das", "Rao", "Reddy",
    "Nair", "Iyer", "Banerjee", "Mukherjee", "Chatterjee", "Sen", "Bose", "Mehta", "Shah"
]

FACULTY_NAMES = [
    "Er. R. K. Verma (Physics)", "Dr. S. N. Mishra (Chemistry)", "Prof. V. K. Gupta (Mathematics)",
    "Dr. Ananya Roy (Biology)", "Er. Amit Singh (Mechanics)", "Dr. P. K. Sharma (Botany)"
]

def generate_synthetic_dataset(output_dir: str = None) -> Dict[str, pd.DataFrame]:
    """Generates all synthetic entities as DataFrames."""
    random.seed(42)
    np.random.seed(42)

    # 1. Institutes
    institutes_data = [
        {"institute_id": "INST_PATNA_01", "name": "Apex JEE & Medical Academy, Patna", "city": "Patna", "city_tier": "Tier-2", "exam_focus": "JEE/NEET", "student_count": 400, "plan": "Growth"},
        {"institute_id": "INST_KOTA_02", "name": "Chaitanya Science Forum, Kota", "city": "Kota", "city_tier": "Tier-2", "exam_focus": "JEE", "student_count": 400, "plan": "Growth"},
        {"institute_id": "INST_LUCKNOW_03", "name": "Drona Medical Institute, Lucknow", "city": "Lucknow", "city_tier": "Tier-2", "exam_focus": "NEET", "student_count": 400, "plan": "Growth"}
    ]
    df_institutes = pd.DataFrame(institutes_data)

    # 2. Batches (4 batches per institute)
    batches_data = []
    for inst in institutes_data:
        iid = inst["institute_id"]
        batches_data.extend([
            {"batch_id": f"{iid}_B1_JEE", "institute_id": iid, "name": "12th JEE Main & Advanced Super-30", "target_exam": "JEE Advanced", "target_year": 2026, "faculty_in_charge": "Er. R. K. Verma (Physics)"},
            {"batch_id": f"{iid}_B2_JEE", "institute_id": iid, "name": "11th JEE Foundation Achievers", "target_exam": "JEE Main", "target_year": 2027, "faculty_in_charge": "Prof. V. K. Gupta (Mathematics)"},
            {"batch_id": f"{iid}_B3_NEET", "institute_id": iid, "name": "12th NEET Medical Pinnacle", "target_exam": "NEET", "target_year": 2026, "faculty_in_charge": "Dr. Ananya Roy (Biology)"},
            {"batch_id": f"{iid}_B4_FOUND", "institute_id": iid, "name": "Dropper Intensive Fastrack", "target_exam": "JEE/NEET", "target_year": 2026, "faculty_in_charge": "Dr. S. N. Mishra (Chemistry)"}
        ])
    df_batches = pd.DataFrame(batches_data)

    # 3. Questions Taxonomy (80 questions with calibrated 2PL IRT parameters)
    topics = [
        ("Physics", "Mechanics", "Kinematics", "1D Motion", 0.9, -0.6),
        ("Physics", "Mechanics", "Rotational Dynamics", "Moment of Inertia", 1.4, 0.7),
        ("Physics", "Electrodynamics", "Electrostatics", "Coulomb Law", 1.1, -0.2),
        ("Chemistry", "Organic", "Reaction Mechanisms", "SN1 & SN2", 1.5, 0.5),
        ("Chemistry", "Physical", "Chemical Kinetics", "Rate Laws & Order", 1.0, -0.1),
        ("Chemistry", "Inorganic", "Coordination Compounds", "Crystal Field Theory", 1.2, 0.3),
        ("Mathematics", "Calculus", "Definite Integration", "Properties & Areas", 1.6, 0.8),
        ("Mathematics", "Algebra", "Quadratic Equations", "Roots & Discriminant", 0.9, -0.5),
        ("Biology", "Botany", "Plant Physiology", "Photosynthesis & Respiration", 1.2, 0.2),
        ("Biology", "Zoology", "Human Physiology", "Circulatory & Neural Systems", 1.0, -0.3)
    ]

    questions_data = []
    q_params = {}
    q_counter = 1
    for subject, chapter, topic, subtopic, a_base, b_base in topics:
        for q_idx in range(1, 9):
            qid = f"Q_{q_counter:03d}"
            b_diff = round(float(b_base + random.uniform(-0.35, 0.35)), 2)
            a_disc = round(float(a_base + random.uniform(-0.15, 0.15)), 2)
            q_params[qid] = (a_disc, b_diff, topic)

            questions_data.append({
                "question_id": qid,
                "subject": subject,
                "chapter": chapter,
                "topic": topic,
                "sub_topic": subtopic,
                "difficulty_b": b_diff,
                "discrimination_a": a_disc,
                "source": "NTA Previous Years Benchmark",
                "correct_option": random.choice(["Option_A", "Option_B", "Option_C", "Option_D"])
            })
            q_counter += 1
    df_questions = pd.DataFrame(questions_data)

    # 4. Students (1,200 students total: 400 per institute)
    students_data = []
    student_abilities = {}
    student_dropouts = {}
    start_date = datetime.date(2025, 4, 1)

    for inst in institutes_data:
        iid = inst["institute_id"]
        inst_batches = [b["batch_id"] for b in batches_data if b["institute_id"] == iid]
        classes = ["11th", "12th", "Dropper"]

        for s_idx in range(1, 401):
            sid = f"STD_{iid[-5:]}_{s_idx:03d}"
            batch = random.choice(inst_batches)
            cls = "11th" if "11th" in batch else ("Dropper" if "Dropper" in batch else "12th")
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            full_name = f"{first} {last}"
            parent_name = f"{random.choice(FIRST_NAMES)} {last}"
            phone = f"+91 {random.randint(90000, 99999)} {random.randint(10000, 99999)}"

            # Latent student ability theta ~ N(0, 1)
            theta = float(np.random.normal(0.0, 1.0))
            student_abilities[sid] = theta

            # Disengagement / Dropout risk modeling
            p_dropout = 0.28 if theta < -0.8 else (0.12 if theta < 0 else 0.04)
            is_dropout = bool(random.random() < p_dropout)
            dropout_month = random.randint(3, 7) if is_dropout else None
            student_dropouts[sid] = (is_dropout, dropout_month)

            students_data.append({
                "student_id": sid,
                "institute_id": iid,
                "batch_id": batch,
                "name": full_name,
                "class_level": cls,
                "join_date": start_date + datetime.timedelta(days=random.randint(0, 12)),
                "fee_plan": "Standard-10-Installments (₹60,000)",
                "parent_contact_consent": True,  # DPDP Act 2023 VPC compliant
                "parent_name": parent_name,
                "phone_anonymized": phone[:7] + "XXXX" + phone[-2:]
            })
    df_students = pd.DataFrame(students_data)

    # 5. Tests (9 fortnightly milestone mock exams)
    tests_data = []
    test_dates = [start_date + datetime.timedelta(days=14 * w) for w in range(1, 10)]
    for inst in institutes_data:
        iid = inst["institute_id"]
        for t_idx, t_date in enumerate(test_dates, 1):
            tests_data.append({
                "test_id": f"TEST_{iid[-5:]}_{t_idx:02d}",
                "institute_id": iid,
                "title": f"Fortnightly Mock Milestone #{t_idx:02d}",
                "test_date": t_date,
                "total_marks": 100,
                "exam_type": "JEE Main" if "JEE" in inst["exam_focus"] else "NEET"
            })
    df_tests = pd.DataFrame(tests_data)

    # 6. Test Responses (Simulated via 2PL IRT Model)
    # Sample 300 active students for high-speed local demo and responsiveness
    active_students_cohort = students_data[:300]
    responses_data = []

    for t_idx, t_date in enumerate(test_dates, 1):
        for inst in institutes_data:
            iid = inst["institute_id"]
            tid = f"TEST_{iid[-5:]}_{t_idx:02d}"
            # Select 25 questions per mock exam
            selected_qs = random.sample(questions_data, 25)

            for std in [s for s in active_students_cohort if s["institute_id"] == iid]:
                sid = std["student_id"]
                is_drop, drop_m = student_dropouts[sid]

                # Dropouts stop taking exams after their dropout month
                if is_drop and drop_m is not None:
                    drop_cutoff = start_date + datetime.timedelta(days=drop_m * 30)
                    if t_date > drop_cutoff:
                        continue

                theta = student_abilities[sid]

                for q in selected_qs:
                    qid = q["question_id"]
                    a, b, _ = q_params[qid]

                    # 2PL IRT Probability calculation:
                    # P(Correct) = 0.20 + 0.80 / (1 + exp(-a * (theta - b)))
                    p_correct = 1.0 / (1.0 + np.exp(-a * (theta - b)))
                    p_with_guess = 0.20 + 0.80 * p_correct
                    is_correct = int(random.random() < p_with_guess)
                    time_sec = random.randint(45, 140) if is_correct else random.randint(25, 180)

                    resp_opt = q["correct_option"] if is_correct else random.choice(["Option_A", "Option_B", "Option_C", "Option_D"])

                    responses_data.append({
                        "test_id": tid,
                        "student_id": sid,
                        "question_id": qid,
                        "response": resp_opt,
                        "is_correct": is_correct,
                        "time_taken_sec": time_sec,
                        "test_date": t_date
                    })
    df_responses = pd.DataFrame(responses_data)

    # 7. Attendance Records (120 academic days)
    attendance_data = []
    dates = [start_date + datetime.timedelta(days=d) for d in range(120) if d % 7 != 6]

    for std in active_students_cohort:
        sid = std["student_id"]
        is_drop, drop_m = student_dropouts[sid]
        base_attn = 0.93 if not is_drop else 0.72

        for d_idx, dt in enumerate(dates):
            if is_drop and drop_m is not None and dt > (start_date + datetime.timedelta(days=drop_m * 30)):
                break
            # Declining attendance slope for at-risk dropouts
            p_present = base_attn - (0.003 * d_idx if is_drop else 0.0)
            p_present = max(0.12, min(0.98, p_present))
            is_present = int(random.random() < p_present)

            attendance_data.append({
                "student_id": sid,
                "date": dt,
                "session_id": f"SESS_{dt.strftime('%Y%m%d')}",
                "present_flag": is_present
            })
    df_attendance = pd.DataFrame(attendance_data)

    # 8. Fees Ledgers (10 installments of ₹6,000 = ₹60,000)
    fees_data = []
    for std in active_students_cohort:
        sid = std["student_id"]
        is_drop, drop_m = student_dropouts[sid]

        for inst_no in range(1, 11):
            due_dt = start_date + datetime.timedelta(days=(inst_no - 1) * 30)
            if is_drop and drop_m is not None and inst_no > drop_m:
                fees_data.append({
                    "student_id": sid,
                    "instalment_no": inst_no,
                    "due_date": due_dt,
                    "paid_date": None,
                    "amount": 6000.0,
                    "status": "DEFAULTED"
                })
            else:
                paid_dt = due_dt + datetime.timedelta(days=random.randint(-2, 10))
                fees_data.append({
                    "student_id": sid,
                    "instalment_no": inst_no,
                    "due_date": due_dt,
                    "paid_date": paid_dt,
                    "amount": 6000.0,
                    "status": "PAID"
                })
    df_fees = pd.DataFrame(fees_data)

    # 9. Engagement Logs (Homework & Doubts)
    engagement_data = []
    for std in active_students_cohort:
        sid = std["student_id"]
        is_drop, _ = student_dropouts[sid]
        for week_idx in range(1, 16):
            w_date = start_date + datetime.timedelta(days=week_idx * 7)
            hw_submitted = int(random.random() > (0.45 if is_drop else 0.12))
            doubts = random.randint(0, 2) if is_drop else random.randint(1, 5)
            logins = random.randint(1, 3) if is_drop else random.randint(3, 8)
            engagement_data.append({
                "student_id": sid,
                "date": w_date,
                "doubts_asked": doubts,
                "homework_submitted": hw_submitted,
                "app_logins": logins
            })
    df_engagement = pd.DataFrame(engagement_data)

    # 10. Ground Truth Outcomes
    from scipy import stats as sp_stats
    outcomes_data = []
    for std in active_students_cohort:
        sid = std["student_id"]
        is_drop, drop_m = student_dropouts[sid]
        theta = student_abilities[sid]

        true_percentile = round(float(sp_stats.norm.cdf(theta) * 100), 2)
        mock_percentile = round(max(5.0, min(99.9, true_percentile + random.gauss(0, 2.8))), 2)

        outcomes_data.append({
            "student_id": sid,
            "dropped_out_flag": int(is_drop),
            "dropout_month": drop_m if is_drop else None,
            "final_mock_percentile": mock_percentile,
            "actual_exam_percentile": true_percentile if not is_drop else None
        })
    df_outcomes = pd.DataFrame(outcomes_data)

    # 11. Initial Sample Interventions
    interventions_data = []
    sample_students_for_intervention = [s for s in active_students_cohort if student_dropouts[s["student_id"]][0]][:15]
    action_types = ["1-on-1 Concept Review", "Catch-Up Worksheet", "Parent Counseling", "Fee Rescheduling"]
    statuses = ["Intervention assigned", "Follow-up due", "Resolved", "Reviewed", "Needs further support"]

    for idx, std in enumerate(sample_students_for_intervention, 1):
        sid = std["student_id"]
        iid = std["institute_id"]
        interventions_data.append({
            "institute_id": iid,
            "student_id": sid,
            "assigned_by": random.choice(FACULTY_NAMES),
            "assigned_date": start_date + datetime.timedelta(days=random.randint(30, 90)),
            "target_topic": random.choice([t[2] for t in topics]),
            "action_type": random.choice(action_types),
            "action_details": "Targeted 15-minute concept review scheduled and 15-question revision sheet assigned.",
            "status": random.choice(statuses),
            "follow_up_date": start_date + datetime.timedelta(days=random.randint(95, 115)),
            "outcome_notes": "Student showed +18% improvement in subsequent mock test after 1-on-1 mentor guidance."
        })
    df_interventions = pd.DataFrame(interventions_data)

    # 12. Audit Logs
    audit_data = [
        {
            "institute_id": "INST_PATNA_01",
            "user_role": "Platform Administrator",
            "action": "SYSTEM_INITIALIZATION",
            "entity_type": "Institute",
            "entity_id": "INST_PATNA_01",
            "details": "Apex JEE Academy tenant initialized with DPDP VPC safeguards.",
            "timestamp": datetime.datetime.now() - datetime.timedelta(days=120)
        },
        {
            "institute_id": "INST_PATNA_01",
            "user_role": "Institute Owner",
            "action": "CONFIG_RETENTION_POLICY",
            "entity_type": "Settings",
            "entity_id": "POLICY_2025",
            "details": "Configured 12-month student record retention and VPC consent requirement.",
            "timestamp": datetime.datetime.now() - datetime.timedelta(days=110)
        }
    ]
    df_audit = pd.DataFrame(audit_data)

    dataset = {
        "institutes": df_institutes,
        "batches": df_batches,
        "questions": df_questions,
        "students": df_students,
        "tests": df_tests,
        "test_responses": df_responses,
        "attendance": df_attendance,
        "fees": df_fees,
        "engagement": df_engagement,
        "outcomes": df_outcomes,
        "interventions": df_interventions,
        "audit_logs": df_audit
    }

    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        for name, df in dataset.items():
            df.to_csv(os.path.join(output_dir, f"{name}.csv"), index=False)

    return dataset

def seed_database(db: Session, force: bool = False) -> Dict[str, int]:
    """
    Populates database with the comprehensive synthetic dataset.
    If database already has records and force=False, returns existing counts.
    """
    existing_students = db.query(Student).count()
    if existing_students > 0 and not force:
        return {
            "institutes": db.query(Institute).count(),
            "students": existing_students,
            "tests": db.query(Test).count(),
            "test_responses": db.query(TestResponse).count(),
            "attendance": db.query(Attendance).count(),
            "interventions": db.query(Intervention).count()
        }

    # Generate synthetic data in memory
    data = generate_synthetic_dataset()

    # Clear existing if force
    if force:
        db.query(Intervention).delete()
        db.query(TestResponse).delete()
        db.query(Attendance).delete()
        db.query(Fee).delete()
        db.query(Engagement).delete()
        db.query(Outcome).delete()
        db.query(Student).delete()
        db.query(Test).delete()
        db.query(Batch).delete()
        db.query(Institute).delete()
        db.query(Question).delete()
        db.query(AuditLog).delete()
        db.commit()

    # Bulk insert
    for _, row in data["institutes"].iterrows():
        db.merge(Institute(**row.to_dict()))
    db.commit()

    for _, row in data["batches"].iterrows():
        db.merge(Batch(**row.to_dict()))
    db.commit()

    for _, row in data["questions"].iterrows():
        db.merge(Question(**row.to_dict()))
    db.commit()

    for _, row in data["students"].iterrows():
        db.merge(Student(**row.to_dict()))
    db.commit()

    for _, row in data["tests"].iterrows():
        db.merge(Test(**row.to_dict()))
    db.commit()

    # High-speed bulk insertion for relational rows
    db.bulk_insert_mappings(TestResponse, data["test_responses"].to_dict(orient="records"))
    db.bulk_insert_mappings(Attendance, data["attendance"].to_dict(orient="records"))
    db.bulk_insert_mappings(Fee, data["fees"].to_dict(orient="records"))
    db.bulk_insert_mappings(Engagement, data["engagement"].to_dict(orient="records"))
    db.bulk_insert_mappings(Outcome, data["outcomes"].to_dict(orient="records"))
    db.bulk_insert_mappings(Intervention, data["interventions"].to_dict(orient="records"))
    db.bulk_insert_mappings(AuditLog, data["audit_logs"].to_dict(orient="records"))
    db.commit()

    return {
        "institutes": len(data["institutes"]),
        "students": len(data["students"]),
        "tests": len(data["tests"]),
        "test_responses": len(data["test_responses"]),
        "attendance": len(data["attendance"]),
        "interventions": len(data["interventions"])
    }
