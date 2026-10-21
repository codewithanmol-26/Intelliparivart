"""
Intelliprivart Data Moat - Synthetic Data Generation Pipeline
Generates reproducible, statistically grounded datasets for 3 coaching institutes,
1,200 students, 300 calibrated IRT items, 24 mock tests across 12 academic months,
attendance logs, fee ledgers, engagement streams, and verified outcome labels.
Strictly complies with the Case B Participant Guide baseline requirements.
"""

import os
import random
import datetime
from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd
from scipy import stats as sp_stats

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

FACULTY_ROSTER = [
    "Er. R. K. Verma (Physics Lead)", "Dr. S. N. Mishra (Physical Chemistry)",
    "Prof. V. K. Gupta (Advanced Mathematics)", "Dr. Ananya Roy (Zoology & Medical Lead)",
    "Er. Amit Singh (Mechanics Specialist)", "Dr. P. K. Sharma (Botany & Plant Physiology)"
]

def generate_intelliprivart_dataset(
    seed: int = 42,
    output_dir: str = "data/synthetic",
    save_csv: bool = True
) -> Dict[str, pd.DataFrame]:
    """
    Generates all 11 linked relational tables with full schema integrity.
    """
    random.seed(seed)
    np.random.seed(seed)

    # 1. Institutes Table
    institutes_data = [
        {
            "institute_id": "INST_PATNA_01",
            "name": "Apex JEE & Medical Academy",
            "city": "Patna",
            "city_tier": "Tier-2",
            "exam_focus": "JEE/NEET",
            "student_count": 400,
            "plan": "Tier 2: Intelligence",
            "annual_fee_per_student": 60000.0
        },
        {
            "institute_id": "INST_KOTA_02",
            "name": "Chaitanya Science Forum",
            "city": "Kota",
            "city_tier": "Tier-2",
            "exam_focus": "JEE",
            "student_count": 400,
            "plan": "Tier 2: Intelligence",
            "annual_fee_per_student": 65000.0
        },
        {
            "institute_id": "INST_LUCKNOW_03",
            "name": "Drona Medical Institute",
            "city": "Lucknow",
            "city_tier": "Tier-2",
            "exam_focus": "NEET",
            "student_count": 400,
            "plan": "Tier 2: Intelligence",
            "annual_fee_per_student": 58000.0
        }
    ]
    df_institutes = pd.DataFrame(institutes_data)

    # 2. Batches Table (4 batches per institute = 12 total)
    batches_data = []
    for inst in institutes_data:
        iid = inst["institute_id"]
        batches_data.extend([
            {
                "batch_id": f"{iid}_B1_JEE_12",
                "institute_id": iid,
                "name": "12th JEE Achievers Top-30",
                "class_level": "12th",
                "target_exam": "JEE Advanced",
                "faculty_in_charge": "Er. R. K. Verma (Physics Lead)",
                "max_capacity": 120
            },
            {
                "batch_id": f"{iid}_B2_JEE_11",
                "institute_id": iid,
                "name": "11th JEE Foundation Core",
                "class_level": "11th",
                "target_exam": "JEE Main",
                "faculty_in_charge": "Prof. V. K. Gupta (Advanced Mathematics)",
                "max_capacity": 120
            },
            {
                "batch_id": f"{iid}_B3_NEET_12",
                "institute_id": iid,
                "name": "12th NEET Medical Pinnacle",
                "class_level": "12th",
                "target_exam": "NEET",
                "faculty_in_charge": "Dr. Ananya Roy (Zoology & Medical Lead)",
                "max_capacity": 120
            },
            {
                "batch_id": f"{iid}_B4_DROP",
                "institute_id": iid,
                "name": "Repeater / Dropper Fastrack",
                "class_level": "Dropper",
                "target_exam": "JEE/NEET",
                "faculty_in_charge": "Dr. S. N. Mishra (Physical Chemistry)",
                "max_capacity": 100
            }
        ])
    df_batches = pd.DataFrame(batches_data)

    # 3. Syllabus Topics Table (12 canonical topics)
    topics_taxonomy = [
        ("TOP_01", "Physics", "Mechanics", "Kinematics", "1D & 2D Motion, Projectiles"),
        ("TOP_02", "Physics", "Mechanics", "Rotational Dynamics", "Moment of Inertia, Torque, Angular Momentum"),
        ("TOP_03", "Physics", "Electrodynamics", "Electrostatics", "Coulomb's Law, Electric Potential, Gauss Law"),
        ("TOP_04", "Chemistry", "Organic", "Reaction Mechanisms", "SN1, SN2, Electrophilic Aromatic Substitution"),
        ("TOP_05", "Chemistry", "Physical", "Chemical Kinetics", "Rate Laws, Integrated Rate Equations, Arrhenius"),
        ("TOP_06", "Chemistry", "Inorganic", "Coordination Compounds", "Nomenclature, Isomerism, Crystal Field Theory"),
        ("TOP_07", "Mathematics", "Calculus", "Definite Integration", "Properties of Definite Integrals, Area Under Curves"),
        ("TOP_08", "Mathematics", "Algebra", "Quadratic Equations", "Roots, Discriminant, Location of Roots"),
        ("TOP_09", "Mathematics", "Geometry", "Vectors & 3D Geometry", "Dot/Cross Product, Lines & Planes"),
        ("TOP_10", "Biology", "Botany", "Plant Physiology", "Photosynthesis in Higher Plants, Respiration"),
        ("TOP_11", "Biology", "Zoology", "Human Physiology", "Circulatory System, Neural Control, Excretion"),
        ("TOP_12", "Biology", "Genetics", "Genetics & Evolution", "Mendelian Principles, Molecular Basis of Inheritance")
    ]
    df_topics = pd.DataFrame(topics_taxonomy, columns=["topic_id", "subject", "chapter", "topic", "sub_topics"])

    # 4. Questions Table (300 items = 25 questions per topic)
    questions_data = []
    q_params = {} # {question_id: (a_disc, b_diff, topic_id)}
    q_id_counter = 1

    # Base difficulty centers for topics to simulate curriculum progression
    topic_diff_centers = {
        "TOP_01": -0.4, "TOP_02": 0.6, "TOP_03": 0.1,
        "TOP_04": 0.3, "TOP_05": -0.1, "TOP_06": 0.2,
        "TOP_07": 0.7, "TOP_08": -0.5, "TOP_09": 0.4,
        "TOP_10": 0.0, "TOP_11": -0.2, "TOP_12": 0.3
    }

    for t_row in topics_taxonomy:
        t_id, subj, chp, top, sub = t_row
        center_b = topic_diff_centers[t_id]

        for item_idx in range(1, 26):
            qid = f"Q_{q_id_counter:03d}"
            # Calibrated 2PL IRT parameters:
            # b ~ N(center_b, 0.45) clamped to [-2.8, +2.8]
            # a ~ LogNormal(0.1, 0.22) clamped to [0.65, 2.30]
            b_diff = round(float(np.clip(np.random.normal(center_b, 0.45), -2.8, 2.8)), 3)
            a_disc = round(float(np.clip(np.random.lognormal(0.1, 0.22), 0.65, 2.30)), 3)
            q_params[qid] = (a_disc, b_diff, t_id)

            correct_choice = random.choice(["Option_A", "Option_B", "Option_C", "Option_D"])
            questions_data.append({
                "question_id": qid,
                "topic_id": t_id,
                "subject": subj,
                "chapter": chp,
                "topic": top,
                "difficulty_b": b_diff,
                "discrimination_a": a_disc,
                "correct_option": correct_choice,
                "source": "NTA Previous Years Benchmark (2020-2024)"
            })
            q_id_counter += 1

    df_questions = pd.DataFrame(questions_data)

    # 5. Students Table (1,200 students total = 400 per institute)
    start_date = datetime.date(2025, 4, 1) # Academic Session starts April 1, 2025
    students_data = []
    student_abilities = {} # Latent ability theta_i ~ N(0, 1)
    student_dropouts = {}  # {student_id: (is_dropout, dropout_month)}

    # Target overall dropout count ~ 144 out of 1200 = exactly 12.0%
    target_dropouts_per_inst = 48 # 48 * 3 = 144 = 12.0%

    for inst in institutes_data:
        iid = inst["institute_id"]
        inst_batches = [b["batch_id"] for b in batches_data if b["institute_id"] == iid]
        
        # Generate abilities for 400 students
        abilities = np.random.normal(0.0, 1.0, 400)
        # Institute slight ability shift reflecting local selectivity
        if iid == "INST_KOTA_02":
            abilities += 0.15 # Kota competitive peer group
        elif iid == "INST_LUCKNOW_03":
            abilities -= 0.05

        # Prioritize dropout probability for students with lower ability and random disengagement
        # Logistic probability of dropout
        p_drop_raw = 1.0 / (1.0 + np.exp(1.8 + 1.4 * abilities + np.random.normal(0, 0.5, 400)))
        drop_indices = set(np.argsort(p_drop_raw)[-target_dropouts_per_inst:])

        for s_idx in range(1, 401):
            sid = f"STD_{iid[-5:]}_{s_idx:03d}"
            batch = inst_batches[(s_idx - 1) % len(inst_batches)]
            batch_cls = next(b["class_level"] for b in batches_data if b["batch_id"] == batch)
            
            theta = float(abilities[s_idx - 1])
            student_abilities[sid] = theta

            is_drop = (s_idx - 1) in drop_indices
            # Dropouts peak in months 3 to 5 (June - August), matching financial model Section 06/07
            dropout_month = random.choice([3, 3, 4, 4, 4, 5, 5, 6, 7]) if is_drop else None
            student_dropouts[sid] = (is_drop, dropout_month)

            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            full_name = f"{first} {last}"
            parent_name = f"{random.choice(FIRST_NAMES)} {last}"
            phone_masked = f"+91 {random.randint(90000, 99999)} X{random.randint(1000, 9999)}"

            join_dt = start_date + datetime.timedelta(days=random.randint(0, 14))

            students_data.append({
                "student_id": sid,
                "institute_id": iid,
                "batch_id": batch,
                "name": full_name,
                "class_level": batch_cls,
                "join_date": join_dt,
                "fee_plan": "10-Installment Standard (₹60,000/yr)",
                "parent_name": parent_name,
                "parent_phone_masked": phone_masked,
                "parent_contact_consent": True, # DPDP Act 2023 VPC compliant
                "latent_ability_theta": round(theta, 3) # Latent parameter
            })

    df_students = pd.DataFrame(students_data)

    # 6. Tests Table (24 tests across 12 months = 2 per month)
    # Fortnightly tests conducted on the 14th and 28th of each month
    tests_data = []
    test_dates = []
    for month_idx in range(12): # April 2025 to March 2026
        # Month offsets
        m_start = datetime.date(2025 + (3 + month_idx) // 12, ((3 + month_idx) % 12) + 1, 1)
        d1 = m_start + datetime.timedelta(days=13) # ~14th
        d2 = m_start + datetime.timedelta(days=27) # ~28th
        test_dates.extend([d1, d2])

    for inst in institutes_data:
        iid = inst["institute_id"]
        exam_stream = "JEE Main" if "JEE" in inst["exam_focus"] else "NEET"

        for t_idx, t_date in enumerate(test_dates, 1):
            tid = f"TEST_{iid[-5:]}_{t_idx:02d}"
            tests_data.append({
                "test_id": tid,
                "institute_id": iid,
                "test_number": t_idx,
                "title": f"Fortnightly Milestone Mock #{t_idx:02d}",
                "test_date": t_date,
                "academic_month": (t_idx + 1) // 2,
                "total_questions": 20,
                "total_marks": 80, # 20 questions * 4 marks
                "exam_type": exam_stream
            })

    df_tests = pd.DataFrame(tests_data)

    # 7. Test Responses Table (Simulated via 2PL IRT Model)
    # 20 questions per test, selected from syllabus topics
    # P(Y=1|theta, a, b) = c + (1 - c) / (1 + exp(-a * (theta - b))), c = 0.20 guessing floor
    test_responses_data = []

    # Map tests by institute
    for inst in institutes_data:
        iid = inst["institute_id"]
        inst_students = [s for s in students_data if s["institute_id"] == iid]
        inst_tests = [t for t in tests_data if t["institute_id"] == iid]

        for t in inst_tests:
            tid = t["test_id"]
            t_date = t["test_date"]
            t_month = t["academic_month"]

            # Select 20 questions for this mock test
            test_questions = random.sample(questions_data, 20)

            for std in inst_students:
                sid = std["student_id"]
                is_drop, drop_m = student_dropouts[sid]

                # If student dropped out in or before this month, they stop attending tests
                if is_drop and drop_m is not None and t_month > drop_m:
                    continue

                theta = student_abilities[sid]

                for q in test_questions:
                    qid = q["question_id"]
                    a, b, _ = q_params[qid]

                    # 2PL IRT probability calculation
                    logit = np.clip(-a * (theta - b), -35.0, 35.0)
                    p_2pl = 1.0 / (1.0 + np.exp(logit))
                    p_correct = 0.20 + 0.80 * p_2pl # 4-choice MCQ guessing floor

                    is_correct = int(random.random() < p_correct)
                    time_sec = random.randint(45, 140) if is_correct else random.randint(25, 180)
                    resp_choice = q["correct_option"] if is_correct else random.choice(["Option_A", "Option_B", "Option_C", "Option_D"])

                    test_responses_data.append({
                        "test_id": tid,
                        "student_id": sid,
                        "question_id": qid,
                        "response": resp_choice,
                        "is_correct": is_correct,
                        "time_taken_sec": time_sec,
                        "test_date": t_date
                    })

    df_test_responses = pd.DataFrame(test_responses_data)

    # 8. Attendance Table (240 school days across 12 months)
    attendance_data = []
    # Generate 240 academic dates excluding Sundays
    school_dates = []
    curr_d = start_date
    while len(school_dates) < 240:
        if curr_d.weekday() != 6: # Sunday excluded
            school_dates.append(curr_d)
        curr_d += datetime.timedelta(days=1)

    for std in students_data:
        sid = std["student_id"]
        is_drop, drop_m = student_dropouts[sid]
        theta = student_abilities[sid]

        # Base attendance probability
        base_attn = 0.94 if not is_drop else 0.76

        for d_idx, dt in enumerate(school_dates):
            month_no = (dt.month - 4) % 12 + 1
            if is_drop and drop_m is not None and month_no > drop_m:
                break # Ceases attendance post-dropout

            # Negative slope for dropping students
            decay = (0.0018 * d_idx) if is_drop else 0.0
            p_pres = np.clip(base_attn - decay + random.gauss(0, 0.04), 0.10, 0.98)
            present_flag = int(random.random() < p_pres)

            attendance_data.append({
                "student_id": sid,
                "date": dt,
                "session_id": f"SESS_{dt.strftime('%Y%m%d')}",
                "present_flag": present_flag
            })

    df_attendance = pd.DataFrame(attendance_data)

    # 9. Fees Table (10 installments of ₹6,000 = ₹60,000)
    fees_data = []
    for std in students_data:
        sid = std["student_id"]
        is_drop, drop_m = student_dropouts[sid]

        for inst_no in range(1, 11):
            due_dt = start_date + datetime.timedelta(days=(inst_no - 1) * 30)

            # Dropouts default on installments due after their dropout month
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
                paid_dt = due_dt + datetime.timedelta(days=random.randint(-2, 8))
                fees_data.append({
                    "student_id": sid,
                    "instalment_no": inst_no,
                    "due_date": due_dt,
                    "paid_date": paid_dt,
                    "amount": 6000.0,
                    "status": "PAID"
                })

    df_fees = pd.DataFrame(fees_data)

    # 10. Engagement Logs Table (Weekly homework, doubts, app logins)
    engagement_data = []
    weekly_dates = [start_date + datetime.timedelta(days=w * 7) for w in range(50)]

    for std in students_data:
        sid = std["student_id"]
        is_drop, drop_m = student_dropouts[sid]

        for w_idx, w_dt in enumerate(weekly_dates):
            w_month = (w_dt.month - 4) % 12 + 1
            if is_drop and drop_m is not None and w_month > drop_m:
                break

            # Disengagement patterns
            hw_prob = 0.50 if is_drop else 0.88
            doubts = random.randint(0, 1) if is_drop else random.randint(1, 4)
            logins = random.randint(1, 3) if is_drop else random.randint(4, 9)

            engagement_data.append({
                "student_id": sid,
                "date": w_dt,
                "doubts_asked": doubts,
                "homework_submitted": int(random.random() < hw_prob),
                "app_logins": logins
            })

    df_engagement = pd.DataFrame(engagement_data)

    # 11. Ground Truth Outcomes Table
    outcomes_data = []
    for std in students_data:
        sid = std["student_id"]
        is_drop, drop_m = student_dropouts[sid]
        theta = student_abilities[sid]

        # True percentile follows standard normal CDF of ability
        true_percentile = round(float(sp_stats.norm.cdf(theta) * 100), 2)
        # Mock percentile adds slight evaluation noise
        mock_percentile = round(float(np.clip(true_percentile + random.gauss(0, 3.2), 3.0, 99.8)), 2)

        outcomes_data.append({
            "student_id": sid,
            "dropped_out_flag": int(is_drop),
            "dropout_month": drop_m if is_drop else None,
            "final_mock_percentile": mock_percentile,
            "actual_exam_percentile": true_percentile if not is_drop else None
        })

    df_outcomes = pd.DataFrame(outcomes_data)

    dataset = {
        "institutes": df_institutes,
        "batches": df_batches,
        "syllabus_topics": df_topics,
        "questions": df_questions,
        "students": df_students,
        "tests": df_tests,
        "test_responses": df_test_responses,
        "attendance": df_attendance,
        "fees": df_fees,
        "engagement": df_engagement,
        "outcomes": df_outcomes
    }

    if save_csv:
        os.makedirs(output_dir, exist_ok=True)
        for tbl_name, df_tbl in dataset.items():
            csv_path = os.path.join(output_dir, f"{tbl_name}.csv")
            df_tbl.to_csv(csv_path, index=False)
        print(f"✅ Generated synthetic dataset saved to {output_dir}/")

    return dataset
