import re

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


def split_cors_allowed_origins(
    origins: list[str],
) -> tuple[list[str], list[str]]:
    exact_origins: list[str] = []
    wildcard_origins: list[str] = []

    for origin in origins:
        if '*' in origin:
            wildcard_origins.append(origin)
            continue

        exact_origins.append(origin)

    return exact_origins, wildcard_origins


def compile_cors_allowed_origin_regex(wildcard_origins: list[str]) -> str | None:
    if not wildcard_origins:
        return None

    wildcard_pattern = r'[A-Za-z0-9-]+'
    compiled_patterns: list[str] = []

    for wildcard_origin in wildcard_origins:
        escaped_origin = re.escape(wildcard_origin)
        compiled_patterns.append(escaped_origin.replace(r'\*', wildcard_pattern))

    return f"^(?:{'|'.join(compiled_patterns)})$"


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
