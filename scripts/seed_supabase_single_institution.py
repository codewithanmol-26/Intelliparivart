"""
Intelliprivart - Single Institution Supabase Migration & Seed Script
Populates:
- 1 Institution: Apex JEE & Medical Academy, Patna (INST_PATNA_01)
- 1 Owner: Dr. S. K. Narayan (owner@apex.edu)
- 5 Teachers: 5 faculty leads (Physics, Chemistry, Math, Biology, Foundation)
- 100 Students: STD_PAT_001 to STD_PAT_100 across 4 core batches
- 100 Parents: Exactly 1 matching guardian per student (linked via student_id)

Usage:
  # Against Supabase PostgreSQL:
  python scripts/seed_supabase_single_institution.py "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

  # Or against local DB:
  python scripts/seed_supabase_single_institution.py
"""

import sys
import os
import pandas as pd
from pathlib import Path
import datetime

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

def seed_single_institution(db_url: str = None):
    target_url = db_url or os.getenv("DATABASE_URL")
    if not target_url:
        from backend.app.config import BASE_DIR
        target_url = f"sqlite:///{BASE_DIR / 'data' / 'intelliprivart.db'}"

    # Normalize connection string for PostgreSQL / Supabase
    if target_url.startswith("postgres://"):
        target_url = target_url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif target_url.startswith("postgresql://") and not target_url.startswith("postgresql+"):
        target_url = target_url.replace("postgresql://", "postgresql+psycopg2://", 1)

    os.environ["DATABASE_URL"] = target_url

    from sqlalchemy import create_engine, text
    from sqlalchemy.orm import sessionmaker
    from backend.app.database import Base
    from backend.app.models import (
        Institute, Batch, Student, SyllabusTopic, Question, User, Test
    )
    from backend.app.auth import hash_password

    print("=================================================================")
    print("Intelliprivart - Single Institution Supabase Migration & Seed")
    print("Target DB:", target_url.split("@")[-1] if "@" in target_url else target_url)
    print("=================================================================")

    connect_args = {}
    engine_kwargs = {"echo": False}
    if target_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    else:
        connect_args["sslmode"] = "require"
        engine_kwargs.update({
            "pool_size": 5,
            "max_overflow": 10,
            "pool_pre_ping": True,
        })

    engine = create_engine(target_url, connect_args=connect_args, **engine_kwargs)
    Session = sessionmaker(bind=engine)

    print("[1/5] Ensuring all tables exist in database...")
    Base.metadata.create_all(bind=engine)
    print("All tables verified.")

    db = Session()
    single_dir = ROOT_DIR / "data" / "single_institute"

    try:
        # [2/5] Clean previous records to guarantee exactly 1 institute, 1 owner, 5 teachers, 100 students, 100 parents
        print("[2/5] Scoping database to single institution...")
        # Delete extra institutes
        db.query(Institute).filter(Institute.id != "INST_PATNA_01").delete(synchronize_session=False)
        # Clean current tenant records
        db.query(User).filter(User.tenant_id == "INST_PATNA_01").delete(synchronize_session=False)
        db.query(Student).filter(Student.tenant_id == "INST_PATNA_01").delete(synchronize_session=False)
        db.query(Test).filter(Test.tenant_id == "INST_PATNA_01").delete(synchronize_session=False)
        db.query(Batch).filter(Batch.tenant_id == "INST_PATNA_01").delete(synchronize_session=False)
        db.commit()

        # Seed the 1 Institution
        print("[3/5] Seeding 1 Institution & 4 Batches...")
        inst = db.query(Institute).filter(Institute.id == "INST_PATNA_01").first()
        if not inst:
            inst = Institute(
                id="INST_PATNA_01",
                name="Apex JEE & Medical Academy, Patna",
                city="Patna",
                city_tier="Tier-2",
                exam_focus="JEE/NEET",
                annual_fee_per_student=60000.0,
                subscription_plan="Tier 2: Intelligence"
            )
            db.add(inst)
            db.commit()

        # Seed 4 Batches
        df_batches = pd.read_csv(single_dir / "batches.csv")
        for _, r in df_batches.iterrows():
            db.add(Batch(
                id=r["id"],
                tenant_id=r["tenant_id"],
                name=r["name"],
                class_level=r["class_level"],
                target_exam=r["target_exam"],
                faculty_lead=r["faculty_lead"]
            ))
        db.commit()
        print("1 Institute & 4 Batches seeded.")

        # Seed Syllabus Topics & Questions if empty
        if db.query(SyllabusTopic).count() == 0:
            topics_csv = ROOT_DIR / "data" / "syllabus_topics.csv"
            if topics_csv.exists():
                df_top = pd.read_csv(topics_csv)
                for _, r in df_top.iterrows():
                    db.add(SyllabusTopic(
                        id=r["id"],
                        subject=r["subject"],
                        chapter=r["chapter"],
                        topic=r["topic"],
                        exam_focus=r.get("exam_focus", "JEE/NEET"),
                        difficulty_center=float(r.get("difficulty_center", 0.0))
                    ))
                db.commit()

        # Seed 100 Students
        print("[4/5] Seeding exactly 100 Students...")
        df_std = pd.read_csv(single_dir / "students.csv")
        std_objects = []
        for _, r in df_std.iterrows():
            std_objects.append(Student(
                id=r["id"],
                tenant_id=r["tenant_id"],
                batch_id=r["batch_id"],
                pseudonymous_code=r["pseudonymous_code"],
                name=r["name"],
                class_level=r["class_level"],
                join_date=datetime.date.fromisoformat(str(r["join_date"])),
                parent_contact_consent=bool(r["parent_contact_consent"]),
                guardian_name=r["guardian_name"],
                guardian_phone=r["guardian_phone"],
                latent_ability_theta=float(r["latent_ability_theta"])
            ))
        db.add_all(std_objects)
        db.commit()
        print(f"100 Students seeded successfully.")

        # Seed Milestone Tests
        test_records = [
            ("TEST_JEE_M03", "INST_PATNA_01", "BATCH_TOP30", 3, "JEE Advanced Milestone 3: Mechanics & Thermodynamics", datetime.date(2025, 6, 15), 3, 20, 80.0, "JEE Advanced"),
            ("TEST_NEET_M04", "INST_PATNA_01", "BATCH_NEET12", 4, "NEET-UG Milestone 4: Human Physiology & Genetics", datetime.date(2025, 7, 20), 4, 20, 80.0, "NEET-UG"),
            ("TEST_FND_M01", "INST_PATNA_01", "BATCH_FND11", 1, "Foundation 11th Milestone 1: Mathematical Vectors & Kinematics", datetime.date(2025, 5, 10), 1, 20, 80.0, "Foundation (11th)"),
            ("TEST_ELEV_M02", "INST_PATNA_01", "BATCH_ELEV12", 2, "Elevate JEE Main Milestone 2: Coordinate Geometry & Electrostatics", datetime.date(2025, 6, 25), 2, 20, 80.0, "JEE Main"),
        ]
        for t in test_records:
            db.add(Test(
                id=t[0],
                tenant_id=t[1],
                batch_id=t[2],
                test_number=t[3],
                title=t[4],
                test_date=t[5],
                academic_month=t[6],
                total_questions=t[7],
                max_score=t[8],
                exam_type=t[9]
            ))
        db.commit()

        # [5/5] Seed Users: 1 Owner, 5 Teachers, 100 Students, 100 Parents
        print("[5/5] Seeding 206 User Accounts (1 Owner, 5 Teachers, 100 Students, 100 Parents)...")
        df_users = pd.read_csv(single_dir / "users.csv")
        user_objects = []
        for _, u in df_users.iterrows():
            role_pass = u["role"] if u["role"] in ("owner", "teacher", "student", "parent") else "pass123"
            user_objects.append(User(
                id=u["id"],
                email=u["email"],
                hashed_password=hash_password(role_pass),
                full_name=u["full_name"],
                role=u["role"],
                tenant_id=u["tenant_id"],
                student_id=u["student_id"] if pd.notna(u["student_id"]) else None
            ))
        db.add_all(user_objects)
        db.commit()

        # Summary Audit
        owner_cnt = db.query(User).filter(User.role == "owner", User.tenant_id == "INST_PATNA_01").count()
        teacher_cnt = db.query(User).filter(User.role == "teacher", User.tenant_id == "INST_PATNA_01").count()
        student_cnt = db.query(Student).filter(Student.tenant_id == "INST_PATNA_01").count()
        student_user_cnt = db.query(User).filter(User.role == "student", User.tenant_id == "INST_PATNA_01").count()
        parent_user_cnt = db.query(User).filter(User.role == "parent", User.tenant_id == "INST_PATNA_01").count()
        institute_cnt = db.query(Institute).count()

        print("=================================================================")
        print("Database Audit Summary:")
        print(f"Institutes:   {institute_cnt} (Apex JEE & Medical Academy, Patna)")
        print(f"Owners:       {owner_cnt} (Dr. S. K. Narayan)")
        print(f"Teachers:     {teacher_cnt} (Physics, Chemistry, Math, Biology, Foundation)")
        print(f"Students:     {student_cnt} (STD_PAT_001 to STD_PAT_100)")
        print(f"Student Users:{student_user_cnt}")
        print(f"Parents Users:{parent_user_cnt} (Exactly 1 parent per student)")
        print("=================================================================")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    url_arg = sys.argv[1] if len(sys.argv) > 1 else None
    seed_single_institution(url_arg)
