import re

from app.core.settings import (
    compile_cors_allowed_origin_regex,
    normalize_database_url,
    parse_cors_allowed_origins,
    split_cors_allowed_origins,
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


def test_split_cors_allowed_origins_separates_wildcards() -> None:
    exact_origins, wildcard_origins = split_cors_allowed_origins(
        [
            'https://love-where-you-live.vercel.app',
            'https://love-where-you-live-*-pitta-breads-projects.vercel.app',
            'http://localhost:5173',
        ]
    )

    assert exact_origins == [
        'https://love-where-you-live.vercel.app',
        'http://localhost:5173',
    ]
    assert wildcard_origins == [
        'https://love-where-you-live-*-pitta-breads-projects.vercel.app'
    ]


def test_compile_cors_allowed_origin_regex_returns_none_without_wildcards() -> None:
    compiled_regex = compile_cors_allowed_origin_regex([])

    assert compiled_regex is None


def test_compile_cors_allowed_origin_regex_matches_expected_preview_origin() -> None:
    compiled_regex = compile_cors_allowed_origin_regex(
        ['https://love-where-you-live-*-pitta-breads-projects.vercel.app']
    )

    assert compiled_regex is not None
    assert re.fullmatch(
        compiled_regex,
        'https://love-where-you-live-feature-x-pitta-breads-projects.vercel.app',
    )


def test_compile_cors_allowed_origin_regex_blocks_domain_suffix_attack() -> None:
    compiled_regex = compile_cors_allowed_origin_regex(
        ['https://love-where-you-live-*-pitta-breads-projects.vercel.app']
    )

    assert compiled_regex is not None
    assert not re.fullmatch(
        compiled_regex,
        'https://love-where-you-live-feature-x-pitta-breads-projects.vercel.app.evil.com',
    )


def test_compile_cors_allowed_origin_regex_blocks_dotted_wildcard_value() -> None:
    compiled_regex = compile_cors_allowed_origin_regex(
        ['https://love-where-you-live-*-pitta-breads-projects.vercel.app']
    )

    assert compiled_regex is not None
    assert not re.fullmatch(
        compiled_regex,
        'https://love-where-you-live-a.b-pitta-breads-projects.vercel.app',
    )
