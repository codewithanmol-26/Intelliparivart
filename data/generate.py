"""
Intelliprivart Data Moat - Synthetic Data Generator (Round 2 Prototype)
Seeded, reproducible generation adhering to competition specification:
- 3 institutes (Patna, Lucknow, Jaipur)
- 1,200 students total (400 per institute)
- 8 academic months (April 2025 - November 2025)
- 16 milestone tests (2 per month) × 20 questions = 320 test items attempted
- 12 syllabus topics (Physics, Chemistry, Mathematics)
- 300 calibrated question items tagged to topics
- 2PL IRT item responses with guessing parameter c = 0.10
- ~12% realistic dropout rate driven by hidden disengagement factor peaking in months 3-5
- Generates dirty CSV for ingestion quarantine review demo
"""

import os
import sys
import random
import datetime

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass
from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd
from scipy import stats as sp_stats

RANDOM_SEED = 42

FIRST_NAMES = [
    "Aarav", "Aditya", "Advait", "Akshat", "Ananya", "Aniket", "Anushka", "Aryan", "Ayush",
    "Bhavya", "Chirag", "Devansh", "Dhruv", "Diya", "Gauri", "Harsh", "Ishaan", "Jhanvi",
    "Kartik", "Khushi", "Kunal", "Manish", "Meera", "Mohit", "Navya", "Nikhil", "Pooja",
    "Pranav", "Priya", "Rahul", "Rhea", "Rishi", "Rohan", "Sakshi", "Sarthak", "Shaurya",
    "Shreya", "Sneha", "Soham", "Tanvi", "Utkarsh", "Vaishnavi", "Varun", "Vedant", "Vidhi",
    "Vikram", "Yash", "Yuvraj", "Tanmay", "Rishabh", "Kavya", "Ritika", "Sameer", "Deepak"
]

LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Patel", "Mishra", "Singh", "Kumar", "Yadav", "Tiwari",
    "Pandey", "Choudhary", "Jha", "Prasad", "Sinha", "Srivastava", "Das", "Rao", "Reddy",
    "Nair", "Iyer", "Banerjee", "Mukherjee", "Chatterjee", "Sen", "Bose", "Mehta", "Shah",
    "Agarwal", "Bhatia", "Chauhan", "Dubey", "Gill", "Joshi", "Kapoor", "Malhotra"
]

TOPICS = [
    ("TOP_01", "Physics", "Mechanics", "Kinematics", -0.4),
    ("TOP_02", "Physics", "Mechanics", "Rotational Dynamics", 0.6),
    ("TOP_03", "Physics", "Electrodynamics", "Electrostatics", 0.1),
    ("TOP_04", "Physics", "Thermodynamics", "Kinetic Theory & Heat", -0.2),
    ("TOP_05", "Chemistry", "Organic", "General Organic Chemistry", 0.3),
    ("TOP_06", "Chemistry", "Physical", "Chemical Kinetics", -0.1),
    ("TOP_07", "Chemistry", "Inorganic", "Coordination Compounds", 0.2),
    ("TOP_08", "Chemistry", "Physical", "Thermodynamics & Equilibrium", 0.4),
    ("TOP_09", "Mathematics", "Calculus", "Definite Integration", 0.7),
    ("TOP_10", "Mathematics", "Algebra", "Quadratic Equations", -0.5),
    ("TOP_11", "Mathematics", "Geometry", "Vectors & 3D Geometry", 0.3),
    ("TOP_12", "Mathematics", "Calculus", "Differential Equations", 0.2)
]

def generate_dataset(seed: int = RANDOM_SEED, output_dir: str = "data") -> Dict[str, pd.DataFrame]:
    random.seed(seed)
    np.random.seed(seed)
    os.makedirs(output_dir, exist_ok=True)

    # 1. Institutes Table (3 institutes)
    institutes = [
        {
            "id": "INST_PATNA_01",
            "name": "Apex JEE & Medical Academy",
            "city": "Patna",
            "city_tier": "Tier-2",
            "exam_focus": "JEE/NEET",
            "student_count": 400,
            "subscription_plan": "Tier 2: Intelligence",
            "annual_fee_per_student": 60000.0,
            "created_at": datetime.datetime(2024, 12, 1, 9, 0, 0)
        },
        {
            "id": "INST_LUCKNOW_02",
            "name": "Avadh Science Forum",
            "city": "Lucknow",
            "city_tier": "Tier-2",
            "exam_focus": "JEE",
            "student_count": 400,
            "subscription_plan": "Tier 2: Intelligence",
            "annual_fee_per_student": 65000.0,
            "created_at": datetime.datetime(2024, 12, 15, 9, 0, 0)
        },
        {
            "id": "INST_JAIPUR_03",
            "name": "Pink City Medical Foundation",
            "city": "Jaipur",
            "city_tier": "Tier-2",
            "exam_focus": "NEET",
            "student_count": 400,
            "subscription_plan": "Tier 2: Intelligence",
            "annual_fee_per_student": 58000.0,
            "created_at": datetime.datetime(2025, 1, 10, 9, 0, 0)
        }
    ]
    df_institutes = pd.DataFrame(institutes)

    # 2. Batches Table (4 batches per institute = 12 batches)
    batches = []
    for inst in institutes:
        iid = inst["id"]
        batches.extend([
            {"id": f"{iid}_B1_JEE_12", "institute_id": iid, "name": "12th JEE Achievers Top-30", "class_level": "12th", "target_exam": "JEE Advanced", "faculty_lead": "Er. R. K. Verma"},
            {"id": f"{iid}_B2_JEE_11", "institute_id": iid, "name": "11th JEE Foundation Core", "class_level": "11th", "target_exam": "JEE Main", "faculty_lead": "Prof. V. K. Gupta"},
            {"id": f"{iid}_B3_NEET_12", "institute_id": iid, "name": "12th NEET Pinnacle", "class_level": "12th", "target_exam": "NEET", "faculty_lead": "Dr. Ananya Roy"},
            {"id": f"{iid}_B4_DROP", "institute_id": iid, "name": "Repeater / Dropper Fastrack", "class_level": "Dropper", "target_exam": "JEE/NEET", "faculty_lead": "Dr. S. N. Mishra"}
        ])
    df_batches = pd.DataFrame(batches)

    # 3. Syllabus Topics (12 Topics)
    df_topics = pd.DataFrame([
        {"id": t[0], "subject": t[1], "chapter": t[2], "topic": t[3], "exam_focus": "JEE/NEET", "difficulty_center": t[4]}
        for t in TOPICS
    ])

    # 4. Questions (300 items = 25 per topic)
    questions = []
    q_params = {}
    q_counter = 1
    for t_id, subj, chp, top, center_b in TOPICS:
        for _ in range(25):
            qid = f"Q_{q_counter:03d}"
            b = round(float(np.clip(np.random.normal(center_b, 0.45), -2.8, 2.8)), 3)
            a = round(float(np.clip(np.random.lognormal(0.1, 0.22), 0.65, 2.30)), 3)
            q_params[qid] = (a, b, t_id)
            questions.append({
                "id": qid,
                "institute_id": None, # Global shared question bank
                "topic_id": t_id,
                "subject": subj,
                "chapter": chp,
                "topic": top,
                "difficulty_b": b,
                "discrimination_a": a,
                "correct_option": random.choice(["Option_A", "Option_B", "Option_C", "Option_D"]),
                "tagging_status": "VERIFIED"
            })
            q_counter += 1
    df_questions = pd.DataFrame(questions)

    # 5. Students (1,200 total = 400 per institute)
    start_date = datetime.date(2025, 4, 1)
    students = []
    student_abilities = {} # sid -> general theta
    student_topic_abilities = {} # sid -> {topic_id: theta}
    student_dropouts = {} # sid -> (is_drop, drop_month)
    target_dropouts_per_inst = 48 # 48 * 3 = 144 = exactly 12.0%

    for inst in institutes:
        iid = inst["id"]
        inst_batches = [b["id"] for b in batches if b["institute_id"] == iid]
        abilities = np.random.normal(0.0, 1.0, 400)
        
        # Disengagement hidden factor driving dropout
        disengagement = np.random.normal(0.0, 1.0, 400)
        p_drop_raw = 1.0 / (1.0 + np.exp(1.5 + 1.2 * abilities - 1.8 * disengagement))
        drop_indices = set(np.argsort(p_drop_raw)[-target_dropouts_per_inst:])

        for s_idx in range(1, 401):
            city_code = inst["city"][:3].upper()
            sid = f"STD_{city_code}_{s_idx:03d}"
            b_id = inst_batches[(s_idx - 1) % len(inst_batches)]
            cls = next(b["class_level"] for b in batches if b["id"] == b_id)
            theta = float(abilities[s_idx - 1])
            student_abilities[sid] = theta

            # Per-topic latent ability variations
            student_topic_abilities[sid] = {
                t[0]: float(np.clip(theta + np.random.normal(0, 0.35), -3.5, 3.5))
                for t in TOPICS
            }

            is_drop = (s_idx - 1) in drop_indices
            # Dropouts mostly in months 3-5
            drop_m = random.choice([3, 3, 4, 4, 4, 5, 5]) if is_drop else None
            student_dropouts[sid] = (is_drop, drop_m)

            name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
            # DPDP Act VPC: 95% consent rate
            consent = random.random() < 0.95

            students.append({
                "id": sid,
                "institute_id": iid,
                "batch_id": b_id,
                "pseudonymous_code": f"TKN-{city_code}-{s_idx:04d}",
                "name": name,
                "class_level": cls,
                "join_date": start_date + datetime.timedelta(days=random.randint(0, 12)),
                "parent_contact_consent": consent,
                "latent_ability_theta": round(theta, 3)
            })
    df_students = pd.DataFrame(students)

    # 6. Tests Table (8 months, 16 tests = 2 tests per month)
    tests = []
    test_dates = []
    for m in range(8):
        m_start = datetime.date(2025, 4 + m, 1)
        test_dates.extend([m_start + datetime.timedelta(days=12), m_start + datetime.timedelta(days=26)])

    for inst in institutes:
        iid = inst["id"]
        stream = "JEE Main" if "JEE" in inst["exam_focus"] else "NEET"
        for t_idx, dt in enumerate(test_dates, 1):
            tests.append({
                "id": f"TEST_{inst['city'][:3].upper()}_{t_idx:02d}",
                "institute_id": iid,
                "batch_id": f"{iid}_B1_JEE_12", # Primary reference batch
                "test_number": t_idx,
                "title": f"Milestone Mock #{t_idx:02d}",
                "test_date": dt,
                "academic_month": (t_idx + 1) // 2,
                "total_questions": 20,
                "max_score": 80.0,
                "exam_type": stream
            })
    df_tests = pd.DataFrame(tests)

    # 7. Test Responses Table (2PL IRT with guessing c = 0.10)
    responses = []
    resp_counter = 1
    for inst in institutes:
        iid = inst["id"]
        inst_stds = [s for s in students if s["institute_id"] == iid]
        inst_tests = [t for t in tests if t["institute_id"] == iid]

        for t in inst_tests:
            tid = t["id"]
            t_date = t["test_date"]
            t_m = t["academic_month"]
            q_sample = random.sample(questions, 20)

            for s in inst_stds:
                sid = s["id"]
                is_drop, drop_m = student_dropouts[sid]
                # Dropped students cease taking tests after dropout month
                if is_drop and drop_m is not None and t_m > drop_m:
                    continue

                for q in q_sample:
                    qid = q["id"]
                    a, b, t_id = q_params[qid]
                    theta_topic = student_topic_abilities[sid][t_id]
                    
                    # 2PL IRT formula with guessing c = 0.10
                    p = 0.10 + 0.90 / (1.0 + np.exp(np.clip(-a * (theta_topic - b), -30.0, 30.0)))
                    is_corr = int(random.random() < p)

                    responses.append({
                        "id": f"R_{resp_counter:07d}",
                        "test_id": tid,
                        "student_id": sid,
                        "question_id": qid,
                        "response": q["correct_option"] if is_corr else random.choice(["Option_A", "Option_B", "Option_C", "Option_D"]),
                        "is_correct": is_corr,
                        "time_taken_sec": random.randint(45, 140),
                        "test_date": t_date
                    })
                    resp_counter += 1
    df_responses = pd.DataFrame(responses)

    # 8. Attendance Table (160 school days across 8 months)
    school_dates = []
    curr = start_date
    while len(school_dates) < 160:
        if curr.weekday() != 6: # Skip Sundays
            school_dates.append(curr)
        curr += datetime.timedelta(days=1)

    attendance = []
    attn_counter = 1
    for s in students:
        sid = s["id"]
        iid = s["institute_id"]
        is_drop, drop_m = student_dropouts[sid]
        base_rate = 0.93 if not is_drop else 0.78

        for d_idx, dt in enumerate(school_dates):
            m_no = dt.month - 3 # April = Month 1
            if is_drop and drop_m is not None and m_no > drop_m:
                break
            
            # Decay slope for dropouts
            decay = (0.0025 * d_idx) if is_drop else 0.0
            p_pres = np.clip(base_rate - decay + random.gauss(0, 0.035), 0.10, 0.98)
            
            attendance.append({
                "id": f"ATT_{attn_counter:07d}",
                "institute_id": iid,
                "student_id": sid,
                "session_date": dt,
                "present_flag": int(random.random() < p_pres)
            })
            attn_counter += 1
    df_attendance = pd.DataFrame(attendance)

    # 9. Fees Table (8 installments for 8 months)
    fees = []
    fee_counter = 1
    for s in students:
        sid = s["id"]
        iid = s["institute_id"]
        is_drop, drop_m = student_dropouts[sid]

        for inst_no in range(1, 9):
            due = start_date + datetime.timedelta(days=(inst_no - 1) * 30)
            if is_drop and drop_m is not None and inst_no >= drop_m:
                # Defaulted fee installment
                fees.append({
                    "id": f"FEE_{fee_counter:06d}",
                    "institute_id": iid,
                    "student_id": sid,
                    "instalment_no": inst_no,
                    "due_date": due,
                    "paid_date": None,
                    "amount": 6000.0,
                    "payment_status": "DEFAULTED"
                })
            else:
                paid_delay = random.randint(-3, 6)
                fees.append({
                    "id": f"FEE_{fee_counter:06d}",
                    "institute_id": iid,
                    "student_id": sid,
                    "instalment_no": inst_no,
                    "due_date": due,
                    "paid_date": due + datetime.timedelta(days=paid_delay),
                    "amount": 6000.0,
                    "payment_status": "PAID"
                })
            fee_counter += 1
    df_fees = pd.DataFrame(fees)

    # 10. Engagement Table (Weekly doubts, homework, logins)
    engagement = []
    eng_counter = 1
    weeks = [start_date + datetime.timedelta(days=w * 7) for w in range(34)]

    for s in students:
        sid = s["id"]
        iid = s["institute_id"]
        is_drop, drop_m = student_dropouts[sid]

        for w_dt in weeks:
            m_no = w_dt.month - 3
            if is_drop and drop_m is not None and m_no > drop_m:
                break
            
            engagement.append({
                "id": f"ENG_{eng_counter:06d}",
                "institute_id": iid,
                "student_id": sid,
                "activity_date": w_dt,
                "doubts_asked": random.randint(0, 1) if is_drop else random.randint(1, 4),
                "homework_submitted": int(random.random() < (0.45 if is_drop else 0.88)),
                "app_logins": random.randint(1, 3) if is_drop else random.randint(4, 10)
            })
            eng_counter += 1
    df_engagement = pd.DataFrame(engagement)

    # 11. Outcomes Table
    outcomes = []
    for s in students:
        sid = s["id"]
        iid = s["institute_id"]
        is_drop, drop_m = student_dropouts[sid]
        theta = student_abilities[sid]
        true_pct = round(float(sp_stats.norm.cdf(theta) * 100), 2)
        mock_pct = round(float(np.clip(true_pct + random.gauss(0, 3.0), 3.0, 99.8)), 2)

        outcomes.append({
            "student_id": sid,
            "institute_id": iid,
            "dropped_out_flag": int(is_drop),
            "dropout_month": drop_m,
            "final_mock_percentile": mock_pct,
            "actual_exam_percentile": true_pct if not is_drop else None
        })
    df_outcomes = pd.DataFrame(outcomes)

    tables = {
        "institutes": df_institutes,
        "batches": df_batches,
        "syllabus_topics": df_topics,
        "questions": df_questions,
        "students": df_students,
        "tests": df_tests,
        "test_responses": df_responses,
        "attendance": df_attendance,
        "fees": df_fees,
        "engagement": df_engagement,
        "outcomes": df_outcomes
    }

    # Save clean synthetic CSVs
    for name, df in tables.items():
        csv_path = os.path.join(output_dir, f"{name}.csv")
        df.to_csv(csv_path, index=False)
        print(f"  • {name}.csv: {len(df):,} records")

    # Generate dirty CSV for ingestion quarantine review demo
    dirty_rows = [
        {"student_id": "STD_PAT_001", "name": "Aarav Sharma", "batch_id": "INST_PATNA_01_B1_JEE_12", "test_id": "TEST_PAT_01", "question_id": "Q_001", "is_correct": "1"}, # Valid
        {"student_id": "STD_PAT_001", "name": "Aarav Sharma", "batch_id": "INST_PATNA_01_B1_JEE_12", "test_id": "TEST_PAT_01", "question_id": "Q_001", "is_correct": "1"}, # DUPLICATE ROW
        {"student_id": "STD_UNKNOWN_999", "name": "Ghost Student", "batch_id": "INST_PATNA_01_B1_JEE_12", "test_id": "TEST_PAT_01", "question_id": "Q_002", "is_correct": "1"}, # MISMATCHED ID
        {"student_id": "", "name": "Nameless Candidate", "batch_id": "INST_PATNA_01_B1_JEE_12", "test_id": "TEST_PAT_01", "question_id": "Q_003", "is_correct": "0"}, # MISSING ID
        {"student_id": "STD_PAT_002", "name": "Aditya Shrma", "batch_id": "INST_PATNA_01_B1_JEE_12", "test_id": "TEST_PAT_01", "question_id": "Q_004", "is_correct": "CORRECT"}, # NON-BINARY SCORE & MISSPELLED NAME
        {"student_id": "STD_PAT_003", "name": "Advait Mishra", "batch_id": "INVALID_BATCH", "test_id": "TEST_PAT_01", "question_id": "Q_005", "is_correct": "0"} # INVALID BATCH FK
    ]
    df_dirty = pd.DataFrame(dirty_rows)
    df_dirty.to_csv(os.path.join(output_dir, "dirty_sample.csv"), index=False)
    print(f"  • dirty_sample.csv generated for Review Queue demo.")

    return tables

if __name__ == "__main__":
    print("🚀 Generating synthetic cohort for Intelliprivart...")
    generate_dataset()
    print("✅ Synthetic generation complete!")
