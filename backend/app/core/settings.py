from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_database_url(database_url: str) -> str:
    trimmed = database_url.strip()

    if trimmed.startswith("postgres://"):
        return "postgresql+psycopg://" + trimmed.removeprefix("postgres://")

    if trimmed.startswith("postgresql://"):
        return "postgresql+psycopg://" + trimmed.removeprefix("postgresql://")

    return trimmed


class Settings(BaseSettings):
    database_url: str = "sqlite:///./local.db"

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url_value(cls, value: str) -> str:
        return normalize_database_url(value)

    model_config = SettingsConfigDict(env_file=".env", env_prefix="", extra="ignore")


settings = Settings()
