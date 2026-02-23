# love-where-you-live

House searching online. What if, you could put in all the places you regularly go into a free web tool, like the office, the gym, and preferred child-care. This app works out for you and shows you all the travel times for a list of your favourited houses/flats, and helps you understand the logistically best option for you.

## Plan on a page / Roadmap

https://excalidraw.com/#json=6goSZ0LxCfiajLjZzWG0z,XSoldNg6rcnPcWaRvl8_JQ

## Backend quick start (local SQLite)

1. Install dependencies:

   ```bash
   uv sync --dev
   ```

2. Copy environment values:

   ```bash
   cp backend/.env.example .env
   ```

3. Run the API:

   ```bash
   uv run uvicorn backend.app.main:app --reload
   ```

The app creates tables automatically on startup for local development.

## Vercel production setup (Neon Postgres)

1. In Neon, create a Postgres project/database and copy the connection string.
2. In Vercel project settings, add environment variable `DATABASE_URL` for Production.
3. Use SQLAlchemy/psycopg format, for example:

   ```text
   postgresql+psycopg://USER:PASSWORD@HOST/DBNAME?sslmode=require
   ```

4. Run migrations against production DB before/with deploy:

   ```bash
   DATABASE_URL='postgresql+psycopg://USER:PASSWORD@HOST/DBNAME?sslmode=require' uv run alembic upgrade head
   ```

## Quality checks

- Lint:

  ```bash
  uvx ruff check --fix
  ```

- Tests:

  ```bash
  uv run pytest
  ```
