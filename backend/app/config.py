"""
Intelliprivart Backend Configuration
Supports Render (FastAPI), Supabase (PostgreSQL), and Local SQLite fallback.
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Intelliprivart"
    PROJECT_VERSION: str = "2.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Supabase PostgreSQL or local SQLite fallback
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{BASE_DIR / 'data' / 'intelliprivart.db'}"
    )
    
    # Pluggable LLM Provider (Works 100% offline with zero external key)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "DETERMINISTIC_FALLBACK")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")

    # Multi-tenant security & JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET_KEY", os.getenv("JWT_SECRET", "intelliprivart-competition-key-2026-secure"))
    DEFAULT_TENANT_ID: str = "INST_PATNA_01"

    # Meta WhatsApp Business Cloud API
    WHATSAPP_PHONE_NUMBER_ID: str = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    WHATSAPP_ACCESS_TOKEN: str = os.getenv("WHATSAPP_ACCESS_TOKEN", os.getenv("WHATSAPP_API_TOKEN", os.getenv("META_WHATSAPP_TOKEN", "")))
    WHATSAPP_BUSINESS_ACCOUNT_ID: str = os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID", "")
    WHATSAPP_GRAPH_API_VERSION: str = os.getenv("WHATSAPP_GRAPH_API_VERSION", "v20.0")
    WHATSAPP_VERIFY_TOKEN: str = os.getenv("WHATSAPP_VERIFY_TOKEN", "")
    WHATSAPP_APP_SECRET: str = os.getenv("WHATSAPP_APP_SECRET", "")
    WHATSAPP_TEMPLATE_NAME: str = os.getenv("WHATSAPP_TEMPLATE_NAME", "parent_weekly_progress_digest")
    WHATSAPP_FALLBACK_SIMULATION: bool = os.getenv("WHATSAPP_FALLBACK_SIMULATION", "true").lower() in ("true", "1", "yes")

    # Directory Paths
    DATA_DIR: Path = BASE_DIR / "data"
    OMR_DIR: Path = BASE_DIR / "data" / "omr_samples"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
