# Sales Analytics Platform

Public repository for a Full Stack technical challenge focused on sales consolidation from CSV files.

## Project Structure

- `backend/`: Python API with FastAPI and pytest tooling.
- `frontend/`: React 18 application built with Vite and pnpm, using PrimeReact.

## Current Setup (Phase 0)

- Backend uses `pyproject.toml` with initial dependencies:
  - `fastapi`
  - `uvicorn`
  - `pytest`
  - `pytest-cov`
- Frontend was created with pnpm + Vite and pinned to React 18.
- PrimeReact and PrimeIcons are installed in the frontend.

## Prerequisites

- Python 3.11+
- Node.js 18+ (or newer LTS)
- pnpm

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -e .[dev]
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```
