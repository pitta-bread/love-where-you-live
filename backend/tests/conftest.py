import sys
from collections.abc import Generator
from pathlib import Path
from tempfile import TemporaryDirectory

import psycopg
import pytest
from fastapi.testclient import TestClient
from pgserver import get_server
from sqlmodel import Session, SQLModel, create_engine

sys.path.append(str(Path(__file__).resolve().parents[2]))

from backend.app.db.session import get_session
from backend.app.main import app


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    with TemporaryDirectory() as temp_dir:
        pgdata = Path(temp_dir) / "pgdata"
        pgdata.mkdir()

        server = get_server(pgdata, cleanup_mode="delete")
        test_db_name = "love_where_you_live_test"
        admin_uri = server.get_uri("postgres")

        with psycopg.connect(admin_uri, autocommit=True) as connection:
            with connection.cursor() as cursor:
                cursor.execute(f'DROP DATABASE IF EXISTS "{test_db_name}"')
                cursor.execute(f'CREATE DATABASE "{test_db_name}"')

        test_db_uri = server.get_uri(test_db_name)
        database_url = test_db_uri.replace("postgresql://", "postgresql+psycopg://")
        engine = create_engine(database_url, echo=False)
        SQLModel.metadata.create_all(engine)

        def get_test_session() -> Generator[Session, None, None]:
            with Session(engine) as session:
                yield session

        app.dependency_overrides[get_session] = get_test_session

        with TestClient(app) as test_client:
            yield test_client

        app.dependency_overrides.clear()
