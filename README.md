# love-where-you-live

House searching online. What if, you could put in all the places you regularly go into a free web tool, like the office, the gym, and preferred child-care. This app works out for you and shows you all the travel times for a list of your favourited houses/flats, and helps you understand the logistically best option for you.

## Plan on a page / Roadmap

https://excalidraw.com/#json=6goSZ0LxCfiajLjZzWG0z,XSoldNg6rcnPcWaRvl8_JQ

## Backend quick start (local SQLite)

Run backend commands from `backend/`.

1. Install dependencies:

   ```bash
   cd backend
   uv sync --dev
   ```

2. Copy environment values:

   ```bash
   cp .env.example .env
   ```

3. Run the API:

   ```bash
   uv run uvicorn app.main:app --reload
   ```

The app creates tables automatically on startup for local development.

## Vercel monorepo setup (separate frontend + backend projects)

### Backend project

1. Create a dedicated Vercel project for the backend in this same repo.
2. Set **Root Directory** to `backend`.
3. Do not add a `vercel.json` for backend routing unless custom behavior is needed; Vercel can detect FastAPI with zero config when the root contains a valid entrypoint.
4. The backend entrypoint is `app/index.py` (repo path `backend/app/index.py`) and exports a FastAPI `app`.

5. In Backend Project Settings → Build & Development Settings, override Install Command to:

   ```bash
   uv sync --locked
   ```

   This uses `pyproject.toml` + `uv.lock` directly (no `requirements.txt` needed).

### Frontend project

1. Create or keep a separate Vercel project for the Svelte app.
2. Set **Root Directory** to `svelte-frontend`.
3. Keep "Skip deployments when there are no changes to the root directory" enabled for both projects.

### Database and env vars

1. In Neon, create a Postgres project/database and copy the connection string.
2. In the backend Vercel project settings, add `DATABASE_URL` for Production and Preview.
3. Use SQLAlchemy/psycopg format:

   ```text
   postgresql+psycopg://USER:PASSWORD@HOST/DBNAME?sslmode=require
   ```

4. Run migrations against production DB before/with deploy:

   ```bash
   cd backend
   DATABASE_URL='postgresql+psycopg://USER:PASSWORD@HOST/DBNAME?sslmode=require' uv run alembic upgrade head
   ```

5. Add backend request protection + strict CORS env vars in Vercel (Preview + Production):

   - Backend project:
     - `API_SHARED_SECRET` (random long value)
     - `CORS_ALLOWED_ORIGINS` (comma-separated frontend origins)
   - Frontend project:
     - `BACKEND_API_SHARED_SECRET` (must match backend secret)

6. Keep all future public backend endpoints under `/api/v1` so they inherit shared-secret protection.


### Related Projects (recommended)

For monorepo preview environments, link the frontend project to the backend project using Vercel Related Projects so preview frontend deployments can automatically reference matching backend preview hosts.

## Quality checks

- Lint:

  ```bash
  cd backend
  uvx ruff check --fix
  ```

- Tests:

  ```bash
  cd backend
  uv run pytest
  ```
