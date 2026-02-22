# love-where-you-live

House searching online. What if, you could put in all the places you regularly go into a free web tool, like the office, the gym, and preferred child-care. This app works out for you and shows you all the travel times for a list of your favourited houses/flats, and helps you understand the logistically best option for you.

## Plan on a page / Roadmap

https://excalidraw.com/#json=6goSZ0LxCfiajLjZzWG0z,XSoldNg6rcnPcWaRvl8_JQ

## Backend quick start (FastAPI + SQLModel + Postgres via pgserver)

1. Install dependencies:

   ```bash
   uv sync --dev
   ```

2. Start a local Postgres instance (pgserver), run migrations, and launch the API:

   ```bash
   uv run python -m backend.scripts.dev_pgserver
   ```

   This command starts Postgres at `.pgserver/data`, ensures the `love_where_you_live` database exists, applies Alembic migrations, and runs Uvicorn with the generated `DATABASE_URL`.

## Quality checks

- Lint:

  ```bash
  uvx ruff check --fix
  ```

- Tests:

  ```bash
  uv run pytest
  ```
