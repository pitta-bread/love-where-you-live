# AGENTS.md

You can update this file yourself with minor edits if you need to remember something long term. Just let the user know when you do.

## Project Overview

House searching. What if, you could put in all the places you regularly go into a free web tool, like the office, the gym, and preferred child-care. This app works out for you and shows you all the travel times for a list of your favourited houses/flats, and helps you understand the logistically best option for you.

Find more context in at the [docs](./docs/project-context.md).

## Development Commands and General Workflow

1. In planning stages, always thoroughly research and ask lots of clarifying questions of the user. You'll include proposed validation steps in the plan.
2. Before coding, check branch and make sure you are on the correct feature branch. If not, create a new branch for the feature you are working on, and switch to it.
3. When coding, always follow existing code style and conventions, including any below.
4. If there is backend logic, write unit tests for it.
5. Lint as per the directions below.
6. Run unit tests as per the directions below.
7. Give validation steps to the user, who may run the server themselves and test the feature, or ask you to for them.
8. Once validated and user has confirmed ready to, commit changes with a short descriptive message, and push to the feature branch.

### Linting

```bash
uvx ruff check --fix
```

Ruff is configured in `pyproject.toml`.

### Running Unit Tests

```bash
uv pytest
```

### Frontend (Svelte/TS) Workflow

Run these from `svelte-frontend/`:

```bash
npm ci
npm run dev
npm run check
npm run lint
npm run format
npm run test
npm run build
```

Pre-commit frontend quality gate:

```bash
npm run check && npm run lint && npm run test && npm run build
```

Svelte/TypeScript best-practice defaults:

- Keep TypeScript `strict` enabled.
- Avoid `any` unless there is a documented exception.
- Keep shared frontend domain types under `src/lib/types`.
- Keep route files thin and move reusable UI into `src/lib/components`.
- Prefer presentational components in early phases; avoid hidden fetch side effects.
- Keep accessibility basics in place (`alt`, semantic headings, keyboard-safe controls once interactivity exists).
- Keep styling tokens centralized in `src/app.css` and avoid ad-hoc inline style drift.

Validation workflow note:

- Run Python lint/tests when backend code changes.
- Run frontend checks when files under `svelte-frontend/` change.

### Repo Notes (Minimal)

- Root `.gitignore` came from a Python template and ignores `lib/`; keep the explicit unignore for `svelte-frontend/src/lib/**`.
- Vercel aliases can be set (for example `love-where-you-live.vercel.app`), but project protection may still require auth until disabled in Vercel settings.

## Tech Stack

- Svelte
- Postgres (without additional dependancies via pgserver python package)
- FastAPI for the backend, SQLModel for the ORM (all Python)
- Vercel for free cloud hosting of the web app, both FE and BE (hobby tier)
- Google Maps Platform API for mapping and location and transit times
- Github, Codex, VS Code for coding and repo hosting
- Github Actions for CI/CD, if needed depending on Vercel
