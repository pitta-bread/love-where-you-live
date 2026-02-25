from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_database_url(database_url: str) -> str:
    trimmed = database_url.strip()

    if trimmed.startswith('postgres://'):
        return 'postgresql+psycopg://' + trimmed.removeprefix('postgres://')

    if trimmed.startswith('postgresql://'):
        return 'postgresql+psycopg://' + trimmed.removeprefix('postgresql://')

    return trimmed


def parse_cors_allowed_origins(origins: str | list[str]) -> list[str]:
    if isinstance(origins, str):
        split_origins = origins.split(',')
    else:
        split_origins = origins

    return [origin.strip().rstrip('/') for origin in split_origins if origin.strip()]


class Settings(BaseSettings):
    database_url: str = 'sqlite:///./local.db'
    api_shared_secret: str | None = None
    cors_allowed_origins: list[str] = ['http://localhost:5173', 'http://127.0.0.1:5173']

    @field_validator('database_url', mode='before')
    @classmethod
    def normalize_database_url_value(cls, value: str) -> str:
        return normalize_database_url(value)

    @field_validator('cors_allowed_origins', mode='before')
    @classmethod
    def parse_cors_allowed_origins_value(
        cls, value: str | list[str]
    ) -> list[str]:
        return parse_cors_allowed_origins(value)

    model_config = SettingsConfigDict(
        env_file='.env',
        env_prefix='',
        extra='ignore',
    )


settings = Settings()
