"""
Data Moat - System Configuration & Environment Settings
Handles database connections, environment variables, security credentials, and AI provider settings.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of the repository
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file if it exists
load_dotenv(BASE_DIR / ".env")

class Settings:
    # Project Identity
    PROJECT_NAME: str = "Data Moat"
    PROJECT_SUBTITLE: str = "AI-Powered Institute Intelligence Platform"
    COMPETITION: str = "Nextute EdTech × Finance Club, IIT Patna 2026"
    VERSION: str = "1.0.0"

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "demo").lower()
    DEBUG: bool = ENVIRONMENT != "production"

    # Database Settings
    # Production uses PostgreSQL; falls back to SQLite for local development/demo
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'datamoat.db'}")
    
    # If DATABASE_URL is SQLite, ensure proper path
    if DATABASE_URL.startswith("sqlite:///"):
        sqlite_path = DATABASE_URL.replace("sqlite:///", "")
        if not os.path.isabs(sqlite_path):
            DATABASE_URL = f"sqlite:///{BASE_DIR / sqlite_path}"

    # Multi-tenancy & Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "datamoat-competition-secret-2026")
    DEFAULT_TENANT_ID: str = "INST_PATNA_01"

    # Roles
    ROLE_PLATFORM_ADMIN: str = "Platform Administrator"
    ROLE_INSTITUTE_OWNER: str = "Institute Owner"
    ROLE_TEACHER: str = "Teacher / Mentor"
    ROLE_STUDENT: str = "Student"
    ROLE_PARENT: str = "Parent"

    ROLES = [
        ROLE_INSTITUTE_OWNER,
        ROLE_TEACHER,
        ROLE_STUDENT,
        ROLE_PARENT,
        ROLE_PLATFORM_ADMIN
    ]

    # Optional Generative AI Provider Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEFAULT_LLM_PROVIDER: str = os.getenv("DEFAULT_LLM_PROVIDER", "DETERMINISTIC_FALLBACK")

    # Data & Output Directories
    DATA_DIR: Path = BASE_DIR / "sample_data"
    SYNTHETIC_DIR: Path = BASE_DIR / "Intelliprivart_ML" / "data" / "synthetic"
    REPORTS_DIR: Path = BASE_DIR / "generated_reports"
    MODELS_DIR: Path = BASE_DIR / "saved_models"

    @property
    def is_postgres(self) -> bool:
        return self.DATABASE_URL.startswith("postgresql")

    @property
    def is_sqlite(self) -> bool:
        return self.DATABASE_URL.startswith("sqlite")

settings = Settings()

# Ensure necessary directories exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.REPORTS_DIR.mkdir(parents=True, exist_ok=True)
settings.MODELS_DIR.mkdir(parents=True, exist_ok=True)
