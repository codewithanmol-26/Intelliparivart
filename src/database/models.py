"""
Data Moat - SQLAlchemy 2.x ORM Models
Defines tenant-isolated schema for Institutes, Batches, Students, Tests, Questions,
Responses, Attendance, Fees, Outcomes, Interventions, and Audit Logs.
"""

from datetime import datetime, date
from typing import Optional, List
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Date, DateTime, Text, ForeignKey, Index
)
from sqlalchemy.orm import DeclarativeBase, relationship

class Base(DeclarativeBase):
    pass

class Institute(Base):
    __tablename__ = "institutes"

    institute_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    city = Column(String(100), nullable=False)
    city_tier = Column(String(20), default="Tier-2")
    exam_focus = Column(String(50), default="JEE/NEET")
    student_count = Column(Integer, default=0)
    plan = Column(String(50), default="Growth")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    batches = relationship("Batch", back_populates="institute", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="institute", cascade="all, delete-orphan")
    tests = relationship("Test", back_populates="institute", cascade="all, delete-orphan")
    interventions = relationship("Intervention", back_populates="institute", cascade="all, delete-orphan")

class Batch(Base):
    __tablename__ = "batches"

    batch_id = Column(String(80), primary_key=True, index=True)
    institute_id = Column(String(50), ForeignKey("institutes.institute_id"), nullable=False, index=True)
    name = Column(String(120), nullable=False)
    target_exam = Column(String(50), default="JEE")
    target_year = Column(Integer, default=2026)
    faculty_in_charge = Column(String(100), default="Academic Mentor")
    created_at = Column(DateTime, default=datetime.utcnow)

    institute = relationship("Institute", back_populates="batches")
    students = relationship("Student", back_populates="batch")

class Student(Base):
    __tablename__ = "students"

    student_id = Column(String(50), primary_key=True, index=True)
    institute_id = Column(String(50), ForeignKey("institutes.institute_id"), nullable=False, index=True)
    batch_id = Column(String(80), ForeignKey("batches.batch_id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    class_level = Column(String(20), default="12th")
    join_date = Column(Date, default=date.today)
    fee_plan = Column(String(100), default="Standard-10-Installments")
    parent_contact_consent = Column(Boolean, default=True)  # DPDP Act 2023 VPC compliant
    parent_name = Column(String(100), default="Parent/Guardian")
    phone_anonymized = Column(String(25), default="+91 98XXX XXXXX")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    institute = relationship("Institute", back_populates="students")
    batch = relationship("Batch", back_populates="students")
    test_responses = relationship("TestResponse", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    fee_records = relationship("Fee", back_populates="student", cascade="all, delete-orphan")
    engagement_records = relationship("Engagement", back_populates="student", cascade="all, delete-orphan")
    outcome = relationship("Outcome", back_populates="student", uselist=False, cascade="all, delete-orphan")
    interventions = relationship("Intervention", back_populates="student", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_student_inst_batch", "institute_id", "batch_id"),
    )

class Question(Base):
    __tablename__ = "questions"

    question_id = Column(String(50), primary_key=True, index=True)
    subject = Column(String(50), nullable=False, index=True)
    chapter = Column(String(100), nullable=False)
    topic = Column(String(100), nullable=False, index=True)
    sub_topic = Column(String(120), nullable=True)
    difficulty_b = Column(Float, default=0.0)      # 2PL IRT Difficulty parameter b (-3 to +3)
    discrimination_a = Column(Float, default=1.0)  # 2PL IRT Discrimination parameter a (0.5 to 2.5)
    source = Column(String(100), default="NTA Question Bank")
    correct_option = Column(String(10), default="Option_A")

    responses = relationship("TestResponse", back_populates="question")

class Test(Base):
    __tablename__ = "tests"

    test_id = Column(String(60), primary_key=True, index=True)
    institute_id = Column(String(50), ForeignKey("institutes.institute_id"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    test_date = Column(Date, nullable=False, index=True)
    total_marks = Column(Integer, default=100)
    exam_type = Column(String(50), default="JEE Main")

    institute = relationship("Institute", back_populates="tests")
    responses = relationship("TestResponse", back_populates="test", cascade="all, delete-orphan")

class TestResponse(Base):
    __tablename__ = "test_responses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    test_id = Column(String(60), ForeignKey("tests.test_id"), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), nullable=False, index=True)
    question_id = Column(String(50), ForeignKey("questions.question_id"), nullable=False, index=True)
    response = Column(String(20), nullable=False)
    is_correct = Column(Integer, default=0)        # 1 for correct, 0 for incorrect
    time_taken_sec = Column(Integer, default=60)
    test_date = Column(Date, nullable=False, index=True)

    test = relationship("Test", back_populates="responses")
    student = relationship("Student", back_populates="test_responses")
    question = relationship("Question", back_populates="responses")

    __table_args__ = (
        Index("idx_resp_student_date", "student_id", "test_date"),
        Index("idx_resp_test_student", "test_id", "student_id"),
    )

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    session_id = Column(String(60), nullable=False)
    present_flag = Column(Integer, default=1)       # 1 for present, 0 for absent

    student = relationship("Student", back_populates="attendance_records")

    __table_args__ = (
        Index("idx_attn_student_date", "student_id", "date"),
    )

class Fee(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), nullable=False, index=True)
    instalment_no = Column(Integer, nullable=False)
    due_date = Column(Date, nullable=False)
    paid_date = Column(Date, nullable=True)
    amount = Column(Float, default=6000.0)
    status = Column(String(20), default="PAID")     # PAID, DEFAULTED, PENDING

    student = relationship("Student", back_populates="fee_records")

    __table_args__ = (
        Index("idx_fee_student_status", "student_id", "status"),
    )

class Engagement(Base):
    __tablename__ = "engagement"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    doubts_asked = Column(Integer, default=0)
    homework_submitted = Column(Integer, default=1) # 1 submitted, 0 missed
    app_logins = Column(Integer, default=1)

    student = relationship("Student", back_populates="engagement_records")

class Outcome(Base):
    __tablename__ = "outcomes"

    student_id = Column(String(50), ForeignKey("students.student_id"), primary_key=True, index=True)
    dropped_out_flag = Column(Integer, default=0)   # 1 if dropped out, 0 otherwise
    dropout_month = Column(Integer, nullable=True)
    final_mock_percentile = Column(Float, nullable=True)
    actual_exam_percentile = Column(Float, nullable=True)

    student = relationship("Student", back_populates="outcome")

class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    institute_id = Column(String(50), ForeignKey("institutes.institute_id"), nullable=False, index=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), nullable=False, index=True)
    assigned_by = Column(String(100), default="Academic Mentor")
    assigned_date = Column(Date, default=date.today)
    target_topic = Column(String(100), nullable=False)
    action_type = Column(String(100), default="1-on-1 Concept Review")
    action_details = Column(Text, nullable=True)
    status = Column(String(40), default="New") # New, Reviewed, Intervention assigned, Follow-up due, Resolved, Needs further support
    follow_up_date = Column(Date, nullable=True)
    outcome_notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    institute = relationship("Institute", back_populates="interventions")
    student = relationship("Student", back_populates="interventions")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    institute_id = Column(String(50), nullable=False, index=True)
    user_role = Column(String(50), default="Teacher")
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(80), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
