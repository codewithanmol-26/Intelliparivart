"""
Data Moat - Database Connection & Session Management
Provides SQLAlchemy session factories, connection pooling, and automated schema initialization.
Supports PostgreSQL production databases and SQLite local development fallbacks.
"""

import os
from contextlib import contextmanager
from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker, Session
from src.config import settings
from src.database.models import Base

# Configure engine with robust pooling
connect_args = {}
if settings.is_sqlite:
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        echo=False
    )

    # Enable SQLite WAL mode and foreign keys for high concurrent performance
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()
else:
    # PostgreSQL production pooling
    engine = create_engine(
        settings.DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Create all tables defined in models if they do not exist."""
    Base.metadata.create_all(bind=engine)

@contextmanager
def get_db_session():
    """Context manager for transactional database operations."""
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

def get_db():
    """FastAPI dependency yielding a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_db_health() -> dict:
    """Verifies active database connection and dialect."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1")).scalar()
            return {
                "status": "healthy" if result == 1 else "unhealthy",
                "dialect": engine.dialect.name,
                "url": str(settings.DATABASE_URL).split("@")[-1] if "@" in str(settings.DATABASE_URL) else str(settings.DATABASE_URL)
            }
    except Exception as e:
        return {
            "status": "error",
            "dialect": engine.dialect.name,
            "error": str(e)
        }
