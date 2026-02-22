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

## Tech Stack

- Svelte
- Postgres (without additional dependancies via pgserver python package)
- FastAPI for the backend, SQLModel for the ORM (all Python)
- Vercel for free cloud hosting of the web app, both FE and BE (hobby tier)
- Google Maps Platform API for mapping and location and transit times
- Github, Codex, VS Code for coding and repo hosting
- Github Actions for CI/CD, if needed depending on Vercel
