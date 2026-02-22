import os
import subprocess
from pathlib import Path

import psycopg
from pgserver import get_server

PGDATA_DIR = Path(".pgserver/data")
DB_NAME = "love_where_you_live"


def ensure_database(server_uri: str) -> None:
    create_db_sql = (
        "SELECT 'CREATE DATABASE {db}' "
        "WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '{db}')\\gexec"
    ).format(db=DB_NAME)

    with psycopg.connect(server_uri, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute(create_db_sql)


def main() -> None:
    PGDATA_DIR.parent.mkdir(parents=True, exist_ok=True)
    PGDATA_DIR.mkdir(exist_ok=True)

    server = get_server(PGDATA_DIR, cleanup_mode=None)
    admin_uri = server.get_uri("postgres")
    db_uri = server.get_uri(DB_NAME)

    ensure_database(admin_uri)

    database_url = db_uri.replace("postgresql://", "postgresql+psycopg://")
    env = os.environ.copy()
    env["DATABASE_URL"] = database_url

    subprocess.run(["uv", "run", "alembic", "upgrade", "head"], check=True, env=env)
    subprocess.run(
        ["uv", "run", "uvicorn", "backend.app.main:app", "--reload"],
        check=True,
        env=env,
    )


if __name__ == "__main__":
    main()
