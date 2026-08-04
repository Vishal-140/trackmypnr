"""
Centralized environment/config loading.

Per spec Section 20: never hardcode API keys or secrets — everything below is
read from environment variables, with sane defaults only for non-secret values.
"""
from __future__ import annotations

import base64
import json
from functools import lru_cache
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Firebase ---
    firebase_project_id: str = Field(default="", alias="FIREBASE_PROJECT_ID")
    # Base64-encoded service account JSON (Render env var friendly).
    firebase_service_account_json: str = Field(default="", alias="FIREBASE_SERVICE_ACCOUNT_JSON")
    # Optional: path to a mounted secret file (Render "Secret Files"), takes
    # precedence over the base64 env var if set.
    firebase_service_account_file: Optional[str] = Field(default=None, alias="FIREBASE_SERVICE_ACCOUNT_FILE")

    # --- PNR provider (RapidAPI) ---
    pnr_api_key: str = Field(default="", alias="PNR_API_KEY")
    pnr_api_host: str = Field(
        default="irctc-indian-railway-pnr-status.p.rapidapi.com", alias="PNR_API_HOST"
    )
    pnr_api_timeout_seconds: float = Field(default=8.0, alias="PNR_API_TIMEOUT_SECONDS")

    # --- Cache ---
    cache_ttl_seconds: int = Field(default=120, alias="CACHE_TTL_SECONDS")
    cache_max_size: int = Field(default=2048, alias="CACHE_MAX_SIZE")

    # --- CORS ---
    allowed_origins: str = Field(
        default="https://trackmypnr.co.in,https://www.trackmypnr.co.in",
        alias="ALLOWED_ORIGINS",
    )

    # --- Rate limiting ---
    check_rate_limit: str = Field(default="10/minute", alias="CHECK_RATE_LIMIT")

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    def firebase_credentials_dict(self) -> Optional[dict]:
        """Return the service account credentials as a dict, or None if unset.

        Supports either a mounted secret file (preferred on Render) or a
        base64-encoded JSON blob in an env var.
        """
        if self.firebase_service_account_file:
            with open(self.firebase_service_account_file, "r", encoding="utf-8") as f:
                return json.load(f)
        if self.firebase_service_account_json:
            decoded = base64.b64decode(self.firebase_service_account_json)
            return json.loads(decoded)
        return None


@lru_cache
def get_settings() -> Settings:
    return Settings()
