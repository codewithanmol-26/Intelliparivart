"""
Builds docs/supabase_single_institution_seed.sql with complete schema DDL
and INSERT statements for:
- 1 Institution (Apex JEE & Medical Academy, Patna)
- 1 Owner (owner@apex.edu)
- 5 Teachers
- 100 Students
- 100 Parents
- 4 Batches, 12 Syllabus Topics, and Questions
"""

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

import pandas as pd
from backend.app.auth import hash_password

single_dir = Path("data/single_institute")
df_inst = pd.read_csv(single_dir / "institutes.csv")
df_batches = pd.read_csv(single_dir / "batches.csv")
df_std = pd.read_csv(single_dir / "students.csv")
df_users = pd.read_csv(single_dir / "users.csv")
df_topics = pd.read_csv("data/syllabus_topics.csv")
df_questions = pd.read_csv("data/questions.csv")

# Standard passwords
DEFAULT_HASH = hash_password("pass123")
OWNER_HASH = hash_password("owner")
TEACHER_HASH = hash_password("teacher")
STUDENT_HASH = hash_password("student")
PARENT_HASH = hash_password("parent")

sql_lines = []
sql_lines.append("-- =============================================================================")
sql_lines.append("-- Intelliprivart: Supabase PostgreSQL Single Institution Seed Script")
sql_lines.append("-- Exactly 1 Institution, 1 Owner, 5 Teachers, 100 Students, 100 Parents")
sql_lines.append("-- Nextute EdTech x Finance Club, IIT Patna | Case B: The Data Moat")
sql_lines.append("-- =============================================================================\n")

sql_lines.append("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";\n")

# DDL Statements
sql_lines.append("""
-- 1. Institutes Table
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

-- 2. Batches Table
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

-- 3. Students Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    batch_id VARCHAR(100) NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    pseudonymous_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    class_level VARCHAR(50) NOT NULL,
    join_date DATE NOT NULL,
    parent_contact_consent BOOLEAN DEFAULT TRUE,
    guardian_name VARCHAR(150),
    guardian_phone VARCHAR(30),
    latent_ability_theta DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_students_tenant ON students(tenant_id);
CREATE INDEX IF NOT EXISTS idx_students_batch ON students(batch_id);

-- 4. Syllabus Topics Table
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

-- 6. Tests Table
CREATE TABLE IF NOT EXISTS tests (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    batch_id VARCHAR(100) NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    test_number INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    test_date DATE NOT NULL,
    academic_month INTEGER DEFAULT 1,
    total_questions INTEGER DEFAULT 20,
    max_score DOUBLE PRECISION DEFAULT 80.0,
    exam_type VARCHAR(50) DEFAULT 'JEE Advanced',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Users Table
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
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
""")

# Clean existing records for this tenant to allow idempotent rerun
sql_lines.append("-- -------------------------------------------------------------")
sql_lines.append("-- Idempotent cleanup of existing INST_PATNA_01 records")
sql_lines.append("-- -------------------------------------------------------------")
sql_lines.append("DELETE FROM users WHERE tenant_id = 'INST_PATNA_01';")
sql_lines.append("DELETE FROM students WHERE tenant_id = 'INST_PATNA_01';")
sql_lines.append("DELETE FROM tests WHERE tenant_id = 'INST_PATNA_01';")
sql_lines.append("DELETE FROM batches WHERE tenant_id = 'INST_PATNA_01';")
sql_lines.append("DELETE FROM institutes WHERE id != 'INST_PATNA_01';\n")

# Insert 1 Institute
sql_lines.append("-- 1. Insert Single Institution (Apex JEE & Medical Academy, Patna)")
r = df_inst.iloc[0]
sql_lines.append(f"INSERT INTO institutes (id, name, city, city_tier, exam_focus, subscription_plan, annual_fee_per_student) "
                 f"VALUES ('{r['id']}', '{r['name']}', '{r['city']}', '{r['city_tier']}', '{r['exam_focus']}', '{r['subscription_plan']}', {r['annual_fee_per_student']}) "
                 f"ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n")

# Insert Batches
sql_lines.append("-- 2. Insert 4 Batches for INST_PATNA_01")
for _, r in df_batches.iterrows():
    sql_lines.append(f"INSERT INTO batches (id, tenant_id, name, class_level, target_exam, faculty_lead) "
                     f"VALUES ('{r['id']}', '{r['tenant_id']}', '{r['name']}', '{r['class_level']}', '{r['target_exam']}', '{r['faculty_lead']}') "
                     f"ON CONFLICT (id) DO NOTHING;")
sql_lines.append("")

# Insert Syllabus Topics
sql_lines.append("-- 3. Insert Syllabus Topics")
for _, r in df_topics.iterrows():
    sql_lines.append(f"INSERT INTO syllabus_topics (id, subject, chapter, topic, exam_focus, difficulty_center) "
                     f"VALUES ('{r['id']}', '{r['subject']}', '{r['chapter']}', '{r['topic']}', '{r.get('exam_focus', 'JEE/NEET')}', {r.get('difficulty_center', 0.0)}) "
                     f"ON CONFLICT (id) DO NOTHING;")
sql_lines.append("")

# Insert 100 Students
sql_lines.append("-- 4. Insert Exactly 100 Students for INST_PATNA_01")
for _, r in df_std.iterrows():
    g_name = str(r['guardian_name']).replace("'", "''")
    s_name = str(r['name']).replace("'", "''")
    sql_lines.append(f"INSERT INTO students (id, tenant_id, batch_id, pseudonymous_code, name, class_level, join_date, parent_contact_consent, guardian_name, guardian_phone, latent_ability_theta) "
                     f"VALUES ('{r['id']}', '{r['tenant_id']}', '{r['batch_id']}', '{r['pseudonymous_code']}', '{s_name}', '{r['class_level']}', '{r['join_date']}', {str(r['parent_contact_consent']).upper()}, '{g_name}', '{r['guardian_phone']}', {r['latent_ability_theta']}) "
                     f"ON CONFLICT (id) DO NOTHING;")
sql_lines.append("")

# Insert 4 Tests
sql_lines.append("-- 5. Insert Milestone Tests for Batches")
test_records = [
    ("TEST_JEE_M03", "INST_PATNA_01", "BATCH_TOP30", 3, "JEE Advanced Milestone 3: Mechanics & Thermodynamics", "2025-06-15", 3, 20, 80.0, "JEE Advanced"),
    ("TEST_NEET_M04", "INST_PATNA_01", "BATCH_NEET12", 4, "NEET-UG Milestone 4: Human Physiology & Genetics", "2025-07-20", 4, 20, 80.0, "NEET-UG"),
    ("TEST_FND_M01", "INST_PATNA_01", "BATCH_FND11", 1, "Foundation 11th Milestone 1: Mathematical Vectors & Kinematics", "2025-05-10", 1, 20, 80.0, "Foundation (11th)"),
    ("TEST_ELEV_M02", "INST_PATNA_01", "BATCH_ELEV12", 2, "Elevate JEE Main Milestone 2: Coordinate Geometry & Electrostatics", "2025-06-25", 2, 20, 80.0, "JEE Main"),
]
for t in test_records:
    sql_lines.append(f"INSERT INTO tests (id, tenant_id, batch_id, test_number, title, test_date, academic_month, total_questions, max_score, exam_type) "
                     f"VALUES ('{t[0]}', '{t[1]}', '{t[2]}', {t[3]}, '{t[4]}', '{t[5]}', {t[6]}, {t[7]}, {t[8]}, '{t[9]}') "
                     f"ON CONFLICT (id) DO NOTHING;")
sql_lines.append("")

# Insert 206 Users: 1 Owner, 5 Teachers, 100 Students, 100 Parents
sql_lines.append("-- 6. Insert 206 User Accounts (1 Owner, 5 Teachers, 100 Students, 100 Parents)")
for _, u in df_users.iterrows():
    u_role = u["role"]
    if u_role == "owner":
        h_pass = OWNER_HASH
    elif u_role == "teacher":
        h_pass = TEACHER_HASH
    elif u_role == "student":
        h_pass = STUDENT_HASH
    elif u_role == "parent":
        h_pass = PARENT_HASH
    else:
        h_pass = DEFAULT_HASH
    
    std_id_val = f"'{u['student_id']}'" if pd.notna(u["student_id"]) and u["student_id"] else "NULL"
    u_name = str(u["full_name"]).replace("'", "''")
    sql_lines.append(f"INSERT INTO users (id, email, hashed_password, full_name, role, tenant_id, student_id) "
                     f"VALUES ('{u['id']}', '{u['email']}', '{h_pass}', '{u_name}', '{u_role}', '{u['tenant_id']}', {std_id_val}) "
                     f"ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, student_id = EXCLUDED.student_id;")

sql_lines.append("\n-- End of Supabase Single Institution Seed Script")

out_path = Path("docs/supabase_single_institution_seed.sql")
with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

print(f"Generated {out_path} with {len(sql_lines)} lines.")
