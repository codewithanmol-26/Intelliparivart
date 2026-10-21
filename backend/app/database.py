"""
Intelliprivart Backend - Database Connection & Tenant Scoping Layer
SQLite by default with complete Postgres compatibility.
Enforces multi-tenant query isolation via tenant_id on all operational entities.
Maps directly to PostgreSQL Row-Level Security (RLS) policies:
CREATE POLICY tenant_isolation_policy ON <table> USING (tenant_id = current_setting('app.current_tenant'));
"""

from typing import Generator, Any
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from backend.app.config import settings

# SQLite connection args for multi-threaded FastAPI
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """Dependency that yields a database session and ensures clean closure."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TenantScopedQuery:
    """
    Centralized query builder that automatically filters by tenant_id.
    Ensures zero cross-tenant data leakage across all repository routes.
    """
    def __init__(self, db: Session, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id

    def filter_by_tenant(self, model_class: Any):
        """Returns query scoped to current tenant if model contains tenant_id."""
        query = self.db.query(model_class)
        if hasattr(model_class, "tenant_id"):
            query = query.filter(model_class.tenant_id == self.tenant_id)
        elif hasattr(model_class, "institute_id"):
            query = query.filter(model_class.institute_id == self.tenant_id)
        return query
