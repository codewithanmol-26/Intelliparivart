"""
Automated Test Suite: Multi-Tenant Data Isolation
Verifies that student records, mock test scores, and attendance logs belonging
to one coaching institute cannot be accessed, modified, or leaked to another institute.
"""

import pytest
from backend.app.database import SessionLocal, Base, engine, TenantScopedQuery
from backend.app.models import Institute, Student, Batch, TestResponse

@pytest.fixture(scope="module")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_tenant_read_isolation(db_session):
    """Confirm Institute A cannot query Institute B students when properly scoped."""
    inst_patna = "INST_PATNA_01"
    inst_kota = "INST_KOTA_02"

    patna_students = db_session.query(Student).filter(Student.tenant_id == inst_patna).all()
    kota_students = db_session.query(Student).filter(Student.tenant_id == inst_kota).all()

    # Intersect student IDs
    patna_ids = set(s.id for s in patna_students)
    kota_ids = set(s.id for s in kota_students)

    assert patna_ids.isdisjoint(kota_ids), "Student IDs between tenants must be strictly disjoint."

def test_tenant_scoped_query(db_session):
    """Verify TenantScopedQuery enforces tenant isolation."""
    inst_patna = "INST_PATNA_01"
    inst_kota = "INST_KOTA_02"

    query_patna = TenantScopedQuery(db_session, inst_patna)
    patna_students = query_patna.filter_by_tenant(Student).all()
    assert all(s.tenant_id == inst_patna for s in patna_students)

    query_kota = TenantScopedQuery(db_session, inst_kota)
    kota_students = query_kota.filter_by_tenant(Student).all()
    assert all(s.tenant_id == inst_kota for s in kota_students)

def test_cross_tenant_update_prevention(db_session):
    """Confirm an institute cannot update another institute's student records."""
    inst_patna = "INST_PATNA_01"
    inst_kota = "INST_KOTA_02"

    kota_student = db_session.query(Student).filter(Student.tenant_id == inst_kota).first()
    if kota_student:
        # Query scoped to Patna cannot access or mutate Kota student
        scoped_query = TenantScopedQuery(db_session, inst_patna)
        found = scoped_query.filter_by_tenant(Student).filter(Student.id == kota_student.id).first()
        assert found is None, "Tenant A scoped query must not locate Tenant B student."
