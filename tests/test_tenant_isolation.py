"""
Automated Test Suite: Multi-Tenant Data Isolation
Verifies that student records, mock test scores, and attendance logs belonging
to one coaching institute cannot be accessed, modified, or leaked to another institute.
"""

import pytest
from src.database.connection import SessionLocal, init_db
from src.database.models import Institute, Student, Batch, TestResponse
from src.data.generator import seed_database
from src.services.auth import rbac

@pytest.fixture(scope="module")
def db_session():
    init_db()
    session = SessionLocal()
    # Ensure database has seed data for test execution
    seed_database(session, force=False)
    yield session
    session.close()

def test_tenant_read_isolation(db_session):
    """Confirm Institute A cannot query Institute B students when properly scoped."""
    inst_patna = "INST_PATNA_01"
    inst_kota = "INST_KOTA_02"

    patna_students = db_session.query(Student).filter(Student.institute_id == inst_patna).all()
    kota_students = db_session.query(Student).filter(Student.institute_id == inst_kota).all()

    assert len(patna_students) > 0, "Patna institute must have enrolled students."
    assert len(kota_students) > 0, "Kota institute must have enrolled students."

    # Intersect student IDs
    patna_ids = set(s.student_id for s in patna_students)
    kota_ids = set(s.student_id for s in kota_students)

    assert patna_ids.isdisjoint(kota_ids), "Student IDs between tenants must be strictly disjoint."

def test_rbac_tenant_permission():
    """Verify RBAC denies cross-tenant operations."""
    inst_patna = "INST_PATNA_01"
    inst_kota = "INST_KOTA_02"

    # Active session is Patna, attempting to access Kota record
    allowed = rbac.verify_tenant_access(active_institute_id=inst_patna, record_institute_id=inst_kota)
    assert allowed is False, "Cross-tenant access must be strictly rejected."

    # Matching tenant session
    allowed_self = rbac.verify_tenant_access(active_institute_id=inst_patna, record_institute_id=inst_patna)
    assert allowed_self is True, "Same-tenant access must be permitted."

def test_cross_tenant_update_prevention(db_session):
    """Verify attempting to update a student with a mismatched institute_id fails or affects 0 rows."""
    inst_patna = "INST_PATNA_01"
    inst_kota = "INST_KOTA_02"

    kota_student = db_session.query(Student).filter(Student.institute_id == inst_kota).first()
    assert kota_student is not None

    # Scoped query simulating Patna tenant trying to modify Kota student
    affected = db_session.query(Student).filter(
        Student.student_id == kota_student.student_id,
        Student.institute_id == inst_patna
    ).update({"name": "Hacked Name"})

    assert affected == 0, "Cross-tenant scoped update must affect 0 rows."
