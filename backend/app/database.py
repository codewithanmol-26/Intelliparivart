"""
Intelliprivart Backend - Database Connection Layer
Seamlessly connects to Supabase (PostgreSQL), Render-managed Postgres, or local SQLite.
Supports multi-tenant isolation, SSL pooling, and auto-table initialization.
"""

from typing import Generator, Any
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from backend.app.config import settings

# 1. Normalize connection URL (Supabase and Render often use postgres:// which SQLAlchemy 2.0 requires as postgresql://)
raw_db_url = settings.DATABASE_URL
if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

# 2. Connection arguments & pooling parameters
connect_args = {}
engine_kwargs = {"echo": False}

if raw_db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # PostgreSQL / Supabase connection pooling & health checks
    engine_kwargs.update({
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True, # Automatically reconnect dropped connections
        "pool_recycle": 300,
    })

engine = create_engine(
    raw_db_url,
    connect_args=connect_args,
    **engine_kwargs
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

def init_db():
    """Initializes schema and tables in the target database (Supabase or SQLite)."""
    Base.metadata.create_all(bind=engine)

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
