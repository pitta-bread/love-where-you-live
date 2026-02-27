from collections.abc import Generator
from contextlib import contextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient

from app.core.settings import (
    compile_cors_allowed_origin_regex,
    split_cors_allowed_origins,
)


@contextmanager
def create_cors_test_client(origins: list[str]) -> Generator[TestClient, None, None]:
    app = FastAPI()
    exact_origins, wildcard_origins = split_cors_allowed_origins(origins)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=exact_origins,
        allow_origin_regex=compile_cors_allowed_origin_regex(wildcard_origins),
        allow_credentials=False,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    @app.get('/health')
    def health() -> dict[str, str]:
        return {'status': 'ok'}

    with TestClient(app) as client:
        yield client


def test_health(client):
    response = client.get('/health')

    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}


def test_hello(client):
    response = client.get('/hello')

    assert response.status_code == 200
    assert response.json() == {
        'message': 'Hello world from Love Where You Live backend'
    }


def test_cors_allows_configured_origin(client):
    response = client.get('/health', headers={'Origin': 'http://localhost:5173'})

    assert response.status_code == 200
    assert response.headers['access-control-allow-origin'] == 'http://localhost:5173'


def test_cors_blocks_unconfigured_origin(client):
    response = client.get('/health', headers={'Origin': 'https://malicious.example'})

    assert response.status_code == 200
    assert 'access-control-allow-origin' not in response.headers


def test_cors_disables_credentials_header(client):
    response = client.get('/health', headers={'Origin': 'http://localhost:5173'})

    assert response.status_code == 200
    assert 'access-control-allow-credentials' not in response.headers


def test_cors_allows_wildcard_preview_origin() -> None:
    with create_cors_test_client(
        [
            'https://love-where-you-live-*-pitta-breads-projects.vercel.app',
            'https://love-where-you-live.vercel.app',
        ]
    ) as client:
        response = client.get(
            '/health',
            headers={
                'Origin': 'https://love-where-you-live-feature-x-pitta-breads-projects.vercel.app'
            },
        )

    assert response.status_code == 200
    assert (
        response.headers['access-control-allow-origin']
        == 'https://love-where-you-live-feature-x-pitta-breads-projects.vercel.app'
    )


def test_cors_allows_exact_canonical_origin_with_wildcard_config() -> None:
    with create_cors_test_client(
        [
            'https://love-where-you-live-*-pitta-breads-projects.vercel.app',
            'https://love-where-you-live.vercel.app',
        ]
    ) as client:
        response = client.get(
            '/health',
            headers={'Origin': 'https://love-where-you-live.vercel.app'},
        )

    assert response.status_code == 200
    assert (
        response.headers['access-control-allow-origin']
        == 'https://love-where-you-live.vercel.app'
    )


def test_cors_blocks_overmatched_wildcard_origin() -> None:
    with create_cors_test_client(
        ['https://love-where-you-live-*-pitta-breads-projects.vercel.app']
    ) as client:
        response = client.get(
            '/health',
            headers={
                'Origin': 'https://love-where-you-live-feature-x-pitta-breads-projects.vercel.app.evil.com'
            },
        )

    assert response.status_code == 200
    assert 'access-control-allow-origin' not in response.headers


def test_cors_blocks_dotted_wildcard_origin() -> None:
    with create_cors_test_client(
        ['https://love-where-you-live-*-pitta-breads-projects.vercel.app']
    ) as client:
        response = client.get(
            '/health',
            headers={
                'Origin': 'https://love-where-you-live-a.b-pitta-breads-projects.vercel.app'
            },
        )

    assert response.status_code == 200
    assert 'access-control-allow-origin' not in response.headers
