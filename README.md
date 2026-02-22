# love-where-you-live

House searching online. What if, you could put in all the places you regularly go into a free web tool, like the office, the gym, and preferred child-care. This app works out for you and shows you all the travel times for a list of your favourited houses/flats, and helps you understand the logistically best option for you.

## Plan on a page / Roadmap

https://excalidraw.com/#json=6goSZ0LxCfiajLjZzWG0z,XSoldNg6rcnPcWaRvl8_JQ

## Backend quick start (FastAPI + SQLModel + Postgres)

1. Install dependencies:

   ```bash
   uv sync --dev
   ```

2. Copy backend environment values:

   ```bash
   cp backend/.env.example .env
   ```

3. Apply migrations:

   ```bash
   uv run alembic upgrade head
   ```

4. Run the API:

   ```bash
   uv run uvicorn backend.app.main:app --reload
   ```

## Quality checks

- Lint:

  ```bash
  uvx ruff check --fix
  ```

- Tests:

  ```bash
  uv pytest
  ```
