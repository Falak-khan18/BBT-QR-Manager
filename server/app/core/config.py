from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors_csv(value: str) -> list[str]:
    if not value.strip():
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/bbt_qr"
    )
    SECRET_KEY: str = Field(default="dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    # Comma-separated origins (env cannot be typed as list[str] — pydantic-settings expects JSON arrays)
    CORS_ORIGINS: str = Field(default="http://localhost:3000")
    # Public URL where GET /r/{short_code} is reachable (no trailing slash)
    REDIRECT_BASE_URL: AnyHttpUrl = Field(default="http://localhost:8000")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
