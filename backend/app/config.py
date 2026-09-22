"""
Centralized application configuration.
Loads values from a .env file via python-dotenv, then reads them with
plain os.environ — no extra settings framework beyond what's in the stack.
"""
import os
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self):
        self.google_api_key: str = os.environ.get(
            "GEMINI_API_KEY",
            os.environ.get("GOOGLE_API_KEY", "")
        )

        self.gemini_model: str = os.environ.get(
            "GEMINI_MODEL",
            "gemini-1.5-pro"
        )

        self.tavily_api_key: str = os.environ.get("TAVILY_API_KEY", "")

        self.database_url: str = os.environ.get(
            "DATABASE_URL",
            "sqlite:///./multi_agent.db"
        )

        self.frontend_origin: str = os.environ.get(
            "FRONTEND_ORIGIN",
            "http://localhost:5173"
        )

        self.app_env: str = os.environ.get("APP_ENV", "development")
        self.log_level: str = os.environ.get("LOG_LEVEL", "INFO")

        # --- Auth ---
        # Used to sign session tokens. Set a real random value in production
        # via the SECRET_KEY env var — this default is fine for local dev only.
        self.secret_key: str = os.environ.get("SECRET_KEY", "dev-only-change-me")
        self.token_ttl_days: int = int(os.environ.get("TOKEN_TTL_DAYS", "30"))

        # Google Sign-In. Create an OAuth Client ID (Web application) at
        # https://console.cloud.google.com/apis/credentials and set this
        # (and VITE_GOOGLE_CLIENT_ID in the frontend .env to the same value)
        # for the "Continue with Google" button to work.
        self.google_client_id: str = os.environ.get("GOOGLE_CLIENT_ID", "")


@lru_cache
def get_settings() -> Settings:
    return Settings()