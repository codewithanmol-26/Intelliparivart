"""
Intelliprivart - SQLAlchemy ORM Models
Postgres-compatible schema with tenant_id column on every operational entity.
Supports tenant isolation, DPDP Act consent flags, psychometric parameters, and audit trails.
"""

import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Date, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Institute(Base):
    __tablename__ = "institutes"

    id = Column(String(50), primary_key=True, index=True) # e.g. INST_PATNA_01
    name = Column(String(150), nullable=False)
    city = Column(String(100), nullable=False)
    city_tier = Column(String(50), default="Tier-2")
    exam_focus = Column(String(100), default="JEE/NEET")
    subscription_plan = Column(String(100), default="Tier 2: Intelligence")
    annual_fee_per_student = Column(Float, default=60000.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    batches = relationship("Batch", back_populates="institute", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="institute", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(50), primary_key=True, index=True)
    tenant_id = Column(String(50), ForeignKey("institutes.id"), nullable=False, index=True)
    user_id = Column(String(100), nullable=False, unique=True)
    display_name = Column(String(150), nullable=False)
    role = Column(String(50), nullable=False) # Admin, Owner, Teacher, Student, Parent
    account_status = Column(String(50), default="ACTIVE")

class Batch(Base):
    __tablename__ = "batches"

    id = Column(String(100), primary_key=True, index=True)
    tenant_id = Column(String(50), ForeignKey("institutes.id"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    class_level = Column(String(50), nullable=False)
    target_exam = Column(String(100), nullable=False)
    faculty_lead = Column(String(150), nullable=True)

    institute = relationship("Institute", back_populates="batches")
    students = relationship("Student", back_populates="batch")

class Student(Base):
    __tablename__ = "students"

    id = Column(String(50), primary_key=True, index=True) # e.g. STD_PAT_001
    tenant_id = Column(String(50), ForeignKey("institutes.id"), nullable=False, index=True)
    batch_id = Column(String(100), ForeignKey("batches.id"), nullable=False, index=True)
    pseudonymous_code = Column(String(100), nullable=False, unique=True)
    name = Column(String(150), nullable=False)
    class_level = Column(String(50), nullable=False)
    join_date = Column(Date, nullable=False)
    parent_contact_consent = Column(Boolean, default=True) # DPDP Act Section 9
    guardian_name = Column(String(150), nullable=True, default="Parent / Guardian")
    guardian_phone = Column(String(30), nullable=True) # e.g. +919876543210
    latent_ability_theta = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    institute = relationship("Institute", back_populates="students")
    batch = relationship("Batch", back_populates="students")

class SyllabusTopic(Base):
    __tablename__ = "syllabus_topics"

    id = Column(String(50), primary_key=True, index=True) # TOP_01
    subject = Column(String(100), nullable=False)
    chapter = Column(String(150), nullable=False)
    topic = Column(String(150), nullable=False)
    exam_focus = Column(String(100), default="JEE/NEET")
    difficulty_center = Column(Float, default=0.0)

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(50), primary_key=True, index=True) # Q_001
    tenant_id = Column(String(50), nullable=True, index=True) # Null for shared national bank
    topic_id = Column(String(50), ForeignKey("syllabus_topics.id"), nullable=False, index=True)
    subject = Column(String(100), nullable=False)
    chapter = Column(String(150), nullable=False)
    topic = Column(String(150), nullable=False)
    difficulty_b = Column(Float, default=0.0)
    discrimination_a = Column(Float, default=1.0)
    correct_option = Column(String(20), default="Option_A")
    tagging_status = Column(String(50), default="VERIFIED")

class Test(Base):
    __tablename__ = "tests"

    id = Column(String(50), primary_key=True, index=True) # TEST_PAT_01
    tenant_id = Column(String(50), ForeignKey("institutes.id"), nullable=False, index=True)
    batch_id = Column(String(100), ForeignKey("batches.id"), nullable=False, index=True)
    test_number = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)
    test_date = Column(Date, nullable=False)
    academic_month = Column(Integer, default=1)
    total_questions = Column(Integer, default=20)
    max_score = Column(Float, default=80.0)
    exam_type = Column(String(100), default="JEE Main")

class TestResponse(Base):
    __tablename__ = "test_responses"

    id = Column(String(50), primary_key=True, index=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    test_id = Column(String(50), ForeignKey("tests.id"), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    question_id = Column(String(50), ForeignKey("questions.id"), nullable=False, index=True)
    response = Column(String(20), nullable=False)
    is_correct = Column(Integer, nullable=False) # 0 or 1
    time_taken_sec = Column(Integer, default=60)
    test_date = Column(Date, nullable=False)

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(50), primary_key=True, index=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    session_date = Column(Date, nullable=False, index=True)
    present_flag = Column(Integer, nullable=False) # 0 or 1

class Fee(Base):
    __tablename__ = "fees"

    id = Column(String(50), primary_key=True, index=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    instalment_no = Column(Integer, nullable=False)
    due_date = Column(Date, nullable=False)
    paid_date = Column(Date, nullable=True)
    amount = Column(Float, default=6000.0)
    payment_status = Column(String(50), default="PAID") # PAID, DEFAULTED

class Engagement(Base):
    __tablename__ = "engagement"

    id = Column(String(50), primary_key=True, index=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    activity_date = Column(Date, nullable=False)
    doubts_asked = Column(Integer, default=0)
    homework_submitted = Column(Integer, default=1)
    app_logins = Column(Integer, default=5)

class Outcome(Base):
    __tablename__ = "outcomes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, unique=True, index=True)
    dropped_out_flag = Column(Integer, default=0)
    dropout_month = Column(Integer, nullable=True)
    final_mock_percentile = Column(Float, nullable=True)
    actual_exam_percentile = Column(Float, nullable=True)

class ModelPrediction(Base):
    __tablename__ = "model_predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), default="v2.0")
    prediction_type = Column(String(50), nullable=False) # RISK, CONFORMAL_PERCENTILE
    prediction_value = Column(Float, nullable=False)
    lower_bound = Column(Float, nullable=True)
    upper_bound = Column(Float, nullable=True)
    risk_tier = Column(String(50), nullable=True) # HIGH, MODERATE, LOW
    top_reasons_json = Column(Text, nullable=True)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    intervention_type = Column(String(100), nullable=False) # 1-on-1 Mentorship, Remedial Worksheet
    reason = Column(String(250), nullable=False)
    assigned_to = Column(String(150), default="Er. R. K. Verma")
    status = Column(String(50), default="ASSIGNED") # ASSIGNED, IN_PROGRESS, COMPLETED
    follow_up_date = Column(Date, nullable=True)
    outcome_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ReviewQueueItem(Base):
    __tablename__ = "review_queue"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    source_type = Column(String(50), default="CSV_UPLOAD") # CSV_UPLOAD, OMR_SCAN
    raw_payload_json = Column(Text, nullable=False)
    detected_error = Column(String(250), nullable=False)
    suggested_fix = Column(String(250), nullable=True)
    status = Column(String(50), default="PENDING") # PENDING, APPROVED, REJECTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    actor_role = Column(String(50), default="Teacher")
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    details_json = Column(Text, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), nullable=False) # owner, teacher, student, parent, admin
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), nullable=True) # Linked student for student/parent roles
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RecomputeRun(Base):
    __tablename__ = "recompute_runs"

    id = Column(String(50), primary_key=True, index=True) # e.g. RUN_INST_PATNA_01_20261021_...
    tenant_id = Column(String(50), nullable=False, index=True)
    source_files_json = Column(Text, default="[]")
    rows_used = Column(Integer, default=0)
    status = Column(String(50), default="SUCCESS") # SUCCESS, FAILED
    computed_at = Column(DateTime, default=datetime.datetime.utcnow)

class ComputedMastery(Base):
    __tablename__ = "computed_mastery"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String(50), ForeignKey("recompute_runs.id"), nullable=False, index=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    batch_id = Column(String(100), nullable=False, index=True)
    student_id = Column(String(50), nullable=False, index=True)
    topic_id = Column(String(50), nullable=False, index=True)
    subject = Column(String(100), nullable=False)
    topic = Column(String(150), nullable=False)
    bkt_mastery = Column(Float, nullable=False)
    raw_accuracy = Column(Float, nullable=False)
    irt_theta = Column(Float, nullable=True)
    standard_error = Column(Float, default=0.25)
    n_responses = Column(Integer, default=0)
    confidence = Column(String(20), default="MODERATE") # HIGH, MODERATE, LOW
    computed_at = Column(DateTime, default=datetime.datetime.utcnow)

class ComputedRisk(Base):
    __tablename__ = "computed_risk"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String(50), ForeignKey("recompute_runs.id"), nullable=False, index=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), nullable=False, index=True)
    batch_id = Column(String(100), nullable=False, index=True)
    student_name = Column(String(150), nullable=False)
    risk_score = Column(Float, nullable=False) # Probability 0.0 - 1.0
    risk_tier = Column(String(20), default="LOW") # HIGH, MODERATE, LOW
    attendance_rate = Column(Float, nullable=True)
    attendance_slope = Column(Float, nullable=True)
    fee_delay_days = Column(Float, nullable=True)
    mock_accuracy = Column(Float, nullable=True)
    top_reasons_json = Column(Text, default="[]")
    intervention_status = Column(String(50), default="UNASSIGNED") # UNASSIGNED, ASSIGNED, IN_PROGRESS, FOLLOW_UP
    computed_at = Column(DateTime, default=datetime.datetime.utcnow)

class ComputedPercentile(Base):
    __tablename__ = "computed_percentiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String(50), ForeignKey("recompute_runs.id"), nullable=False, index=True)
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), nullable=False, index=True)
    p10 = Column(Float, nullable=False)
    p50 = Column(Float, nullable=False)
    p90 = Column(Float, nullable=False)
    interval_width = Column(Float, nullable=False)
    coverage_stat = Column(Float, default=90.0)
    up_to_month = Column(Integer, default=3)
    computed_at = Column(DateTime, default=datetime.datetime.utcnow)

class UploadSource(Base):
    __tablename__ = "upload_sources"

    id = Column(String(50), primary_key=True, index=True) # e.g. UPL_01
    tenant_id = Column(String(50), nullable=False, index=True)
    file_name = Column(String(200), nullable=False)
    file_type = Column(String(50), default="RESPONSES") # ROSTER, RESPONSES, ATTENDANCE, FEES, ENGAGEMENT, ANSWER_KEY
    rows_count = Column(Integer, default=0)
    status = Column(String(50), default="ACTIVE") # ACTIVE, REVERTED
    uploaded_by = Column(String(100), default="Teacher")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class WhatsAppMessageLog(Base):
    __tablename__ = "whatsapp_message_logs"

    id = Column(String(50), primary_key=True, index=True) # e.g. WA_MSG_xxxx
    tenant_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    student_name = Column(String(150), nullable=False)
    guardian_name = Column(String(150), nullable=False)
    recipient_phone = Column(String(30), nullable=False)
    message_type = Column(String(50), default="PARENT_DIGEST") # PARENT_DIGEST, BATCH_BROADCAST
    template_name = Column(String(100), default="parent_weekly_progress_digest")
    language = Column(String(10), default="en")
    meta_message_id = Column(String(100), nullable=True, index=True)
    dispatch_state = Column(String(50), default="ACCEPTED") # ACCEPTED, REJECTED, FAILED
    delivery_status = Column(String(50), default="PENDING") # PENDING, SENT, DELIVERED, READ, FAILED
    error_message = Column(Text, nullable=True)
    cost_inr = Column(Float, default=0.275)
    dpdp_consent_verified = Column(Boolean, default=True)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
