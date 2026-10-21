-- =============================================================================
-- Intelliprivart: Supabase PostgreSQL Schema & Tenant Isolation Setup
-- Case B: The Data Moat | Nextute EdTech × Finance Club, IIT Patna 2026
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Institutes (Tenants)
CREATE TABLE IF NOT EXISTS institutes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    city_tier VARCHAR(50) DEFAULT 'Tier-2',
    exam_focus VARCHAR(100) DEFAULT 'JEE/NEET',
    subscription_plan VARCHAR(100) DEFAULT 'Tier 2: Intelligence',
    annual_fee_per_student DOUBLE PRECISION DEFAULT 60000.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Batches
CREATE TABLE IF NOT EXISTS batches (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    class_level VARCHAR(50) NOT NULL,
    target_exam VARCHAR(100) NOT NULL,
    faculty_lead VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_batches_tenant ON batches(tenant_id);

-- 3. Students
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    batch_id VARCHAR(100) NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    pseudonymous_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    class_level VARCHAR(50) NOT NULL,
    join_date DATE NOT NULL,
    parent_contact_consent BOOLEAN DEFAULT TRUE,
    latent_ability_theta DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_students_tenant ON students(tenant_id);
CREATE INDEX IF NOT EXISTS idx_students_batch ON students(batch_id);

-- 4. Syllabus Topics
CREATE TABLE IF NOT EXISTS syllabus_topics (
    id VARCHAR(50) PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(150) NOT NULL,
    topic VARCHAR(150) NOT NULL,
    exam_focus VARCHAR(100) DEFAULT 'JEE/NEET',
    difficulty_center DOUBLE PRECISION DEFAULT 0.0
);

-- 5. Questions (Calibrated 2PL IRT Item Bank)
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50),
    topic_id VARCHAR(50) NOT NULL REFERENCES syllabus_topics(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(150) NOT NULL,
    topic VARCHAR(150) NOT NULL,
    difficulty_b DOUBLE PRECISION DEFAULT 0.0,
    discrimination_a DOUBLE PRECISION DEFAULT 1.0,
    correct_option VARCHAR(20) DEFAULT 'Option_A',
    tagging_status VARCHAR(50) DEFAULT 'VERIFIED'
);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);

-- 6. Tests
CREATE TABLE IF NOT EXISTS tests (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    batch_id VARCHAR(100) NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    test_number INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    test_date DATE NOT NULL,
    academic_month INT DEFAULT 1,
    total_questions INT DEFAULT 20,
    max_score DOUBLE PRECISION DEFAULT 80.0,
    exam_type VARCHAR(100) DEFAULT 'JEE Main'
);
CREATE INDEX IF NOT EXISTS idx_tests_tenant ON tests(tenant_id);

-- 7. Test Responses
CREATE TABLE IF NOT EXISTS test_responses (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    test_id VARCHAR(50) NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    question_id VARCHAR(50) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    response VARCHAR(20) NOT NULL,
    is_correct INT NOT NULL,
    time_taken_sec INT DEFAULT 60,
    test_date DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_responses_tenant ON test_responses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_responses_student ON test_responses(student_id);

-- 8. Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    present_flag INT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_att_tenant ON attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_att_student ON attendance(student_id);

-- 9. Fees
CREATE TABLE IF NOT EXISTS fees (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    instalment_no INT NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    amount DOUBLE PRECISION DEFAULT 6000.0,
    payment_status VARCHAR(50) DEFAULT 'PAID'
);
CREATE INDEX IF NOT EXISTS idx_fees_tenant ON fees(tenant_id);

-- 10. Interventions (Supportive Mentorship Actions)
CREATE TABLE IF NOT EXISTS interventions (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    intervention_type VARCHAR(100) NOT NULL,
    reason VARCHAR(250) NOT NULL,
    assigned_to VARCHAR(150) DEFAULT 'Prof. R. K. Verma',
    status VARCHAR(50) DEFAULT 'ASSIGNED',
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_interventions_tenant ON interventions(tenant_id);

-- 11. Review Queue (Quarantine)
CREATE TABLE IF NOT EXISTS review_queue (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    source_type VARCHAR(50) DEFAULT 'CSV_UPLOAD',
    raw_payload_json TEXT NOT NULL,
    detected_error VARCHAR(250) NOT NULL,
    suggested_fix VARCHAR(250),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Audit Logs (DPDP Act Compliance Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    actor_role VARCHAR(50) DEFAULT 'Teacher',
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details_json TEXT
);

-- 13. Users (Authentication)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(200) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tenant_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================================================
-- Initial Seed Data: Institutes
-- =============================================================================
INSERT INTO institutes (id, name, city, city_tier, exam_focus, annual_fee_per_student)
VALUES 
    ('INST_PATNA_01', 'Apex JEE & Medical Academy, Patna', 'Patna', 'Tier-2', 'JEE/NEET', 60000.0),
    ('INST_KOTA_02', 'Chaitanya Science Forum, Kota', 'Kota', 'Tier-2', 'JEE Advanced', 85000.0),
    ('INST_LUCKNOW_03', 'Drona Medical Institute, Lucknow', 'Lucknow', 'Tier-2', 'NEET', 65000.0)
ON CONFLICT (id) DO NOTHING;

-- Initial Seed Data: Default Demo Users (Password: 'owner', 'teacher', 'student', 'parent')
INSERT INTO users (id, email, hashed_password, full_name, role, tenant_id, student_id)
VALUES
    ('USR_OWNER_01', 'owner@apex.edu', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Dr. S. K. Narayan', 'owner', 'INST_PATNA_01', NULL),
    ('USR_TEACHER_01', 'teacher@apex.edu', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Prof. R. K. Verma', 'teacher', 'INST_PATNA_01', NULL),
    ('USR_STUDENT_01', 'student@apex.edu', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Ishaan Prasad', 'student', 'INST_PATNA_01', 'STD_NA_01_001'),
    ('USR_PARENT_01', 'parent@apex.edu', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Mahesh Prasad (Guardian)', 'parent', 'INST_PATNA_01', 'STD_NA_01_001')
ON CONFLICT (email) DO NOTHING;
