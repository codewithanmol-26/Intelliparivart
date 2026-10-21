"""
Intelliprivart - Supabase PostgreSQL Database Initialization & Seed Script
Runs table migrations and populates the 3 institutes, batches, topics, calibrated questions,
and demo user accounts in Supabase PostgreSQL.

Usage:
  # With environment variable:
  export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
  python scripts/seed_supabase.py

  # Or passing directly:
  python scripts/seed_supabase.py "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
"""

import sys
import os
import pandas as pd
from pathlib import Path

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.app.database import engine, Base, SessionLocal
from backend.app.models import (
    Institute, Batch, Student, SyllabusTopic, Question, User
)
from backend.app.routes.auth import DEMO_PERSONAS
from backend.app.auth import hash_password

def seed_supabase(db_url: str = None):
    if db_url:
        os.environ["DATABASE_URL"] = db_url

    print("=================================================================")
    print("Intelliprivart — Supabase Database Migration & Seeding")
    print("=================================================================")
    
    print("[1/5] Creating all relational schema tables in Supabase...")
    Base.metadata.create_all(bind=engine)
    print("✓ All tables created successfully.")

    db = SessionLocal()
    data_dir = ROOT_DIR / "data"

    try:
        # [2/5] Seed Institutes
        print("[2/5] Seeding Institutes...")
        institutes = [
            Institute(
                id="INST_PATNA_01",
                name="Apex JEE & Medical Academy, Patna",
                city="Patna",
                city_tier="Tier-2",
                exam_focus="JEE/NEET",
                annual_fee_per_student=60000.0
            ),
            Institute(
                id="INST_KOTA_02",
                name="Chaitanya Science Forum, Kota",
                city="Kota",
                city_tier="Tier-2",
                exam_focus="JEE Advanced",
                annual_fee_per_student=85000.0
            ),
            Institute(
                id="INST_LUCKNOW_03",
                name="Drona Medical Institute, Lucknow",
                city="Lucknow",
                city_tier="Tier-2",
                exam_focus="NEET",
                annual_fee_per_student=65000.0
            ),
        ]
        for inst in institutes:
            if not db.query(Institute).filter(Institute.id == inst.id).first():
                db.add(inst)
        db.commit()
        print("✓ 3 Institutes seeded.")

        # [3/5] Seed Syllabus Topics
        print("[3/5] Seeding 12 Syllabus Topics...")
        topics_file = data_dir / "syllabus_topics.csv"
        if topics_file.exists():
            df_topics = pd.read_csv(topics_file)
            for _, r in df_topics.iterrows():
                if not db.query(SyllabusTopic).filter(SyllabusTopic.id == r["id"]).first():
                    db.add(SyllabusTopic(
                        id=r["id"],
                        subject=r["subject"],
                        chapter=r["chapter"],
                        topic=r["topic"],
                        exam_focus=r.get("exam_focus", "JEE/NEET")
                    ))
            db.commit()
            print(f"✓ {len(df_topics)} Syllabus Topics seeded.")

        # [4/5] Seed Batches & Calibrated Questions
        print("[4/5] Seeding Batches and Calibrated 2PL IRT Questions...")
        batches_file = data_dir / "batches.csv"
        if batches_file.exists():
            df_batches = pd.read_csv(batches_file)
            for _, r in df_batches.iterrows():
                if not db.query(Batch).filter(Batch.id == r["id"]).first():
                    db.add(Batch(
                        id=r["id"],
                        tenant_id=r["institute_id"],
                        name=r["name"],
                        class_level=r["class_level"],
                        target_exam=r["target_exam"],
                        faculty_lead=r.get("faculty_lead", "Er. R. K. Verma")
                    ))
            db.commit()
            print(f"✓ {len(df_batches)} Batches seeded.")

        q_file = data_dir / "questions.csv"
        if q_file.exists():
            df_q = pd.read_csv(q_file)
            for _, r in df_q.iterrows():
                if not db.query(Question).filter(Question.id == r["id"]).first():
                    db.add(Question(
                        id=r["id"],
                        topic_id=r["topic_id"],
                        subject=r["subject"],
                        chapter=r["chapter"],
                        topic=r["topic"],
                        difficulty_b=float(r["difficulty_b"]),
                        discrimination_a=float(r["discrimination_a"]),
                        correct_option=r.get("correct_option", "Option_A")
                    ))
            db.commit()
            print(f"✓ {len(df_q)} Calibrated Questions seeded.")

        # [5/5] Seed Demo User Accounts
        print("[5/5] Seeding Demo User Accounts for Judge Evaluation...")
        for p in DEMO_PERSONAS:
            if not db.query(User).filter(User.email == p["email"]).first():
                db.add(User(
                    id=p["id"],
                    email=p["email"],
                    hashed_password=hash_password(p["password"]),
                    full_name=p["full_name"],
                    role=p["role"],
                    tenant_id=p["tenant_id"],
                    student_id=p.get("student_id")
                ))
        db.commit()
        print("✓ Demo Accounts (Owner, Teacher, Student, Parent) seeded.")

        print("=================================================================")
        print("🎉 Supabase Database Successfully Initialized & Seeded!")
        print("=================================================================")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    url_arg = sys.argv[1] if len(sys.argv) > 1 else os.getenv("DATABASE_URL")
    seed_supabase(url_arg)
