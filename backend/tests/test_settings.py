from app.core.settings import (
    normalize_database_url,
    parse_cors_allowed_origins,
)


def test_normalize_postgres_scheme_to_psycopg() -> None:
    database_url = 'postgres://user:pass@host:5432/dbname'

    normalized = normalize_database_url(database_url)

    assert normalized == 'postgresql+psycopg://user:pass@host:5432/dbname'


def test_normalize_postgresql_scheme_to_psycopg() -> None:
    database_url = 'postgresql://user:pass@host:5432/dbname?sslmode=require'

    normalized = normalize_database_url(database_url)

    assert (
        normalized
        == 'postgresql+psycopg://user:pass@host:5432/dbname?sslmode=require'
    )


def test_keep_sqlite_scheme_unchanged() -> None:
    database_url = 'sqlite:///./local.db'

    normalized = normalize_database_url(database_url)

    assert normalized == database_url


def test_keep_psycopg_scheme_unchanged() -> None:
    database_url = 'postgresql+psycopg://user:pass@host:5432/dbname'

    normalized = normalize_database_url(database_url)

    assert normalized == database_url


def test_parse_cors_allowed_origins_from_csv() -> None:
    origins = parse_cors_allowed_origins(
        ' https://app.example.com/ , http://localhost:5173 '
    )

    assert origins == ['https://app.example.com', 'http://localhost:5173']
