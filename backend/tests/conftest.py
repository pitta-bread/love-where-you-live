import sys
from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.settings import settings
from app.db.session import get_session
from app.main import app


@pytest.fixture(autouse=True)
def reset_security_settings() -> Generator[None, None, None]:
    original_secret = settings.api_shared_secret
    yield
    settings.api_shared_secret = original_secret


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    engine = create_engine(
        'sqlite://',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    def get_test_session() -> Generator[Session, None, None]:
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_test_session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
