# Backend local server guide

Run the FastAPI API against PostgreSQL on your machine (outside Docker Compose). The app expects SQLAlchemy’s **`postgresql+psycopg2`** URL format.

## Prerequisites

- **Python 3.12+**
- **PostgreSQL 15+** reachable from your machine (port **5432** unless you change it)

## 1. Create the database

Pick one approach.

### A. PostgreSQL in Docker (API still runs locally)

Runs only Postgres; your FastAPI process uses `localhost:5432`.

```bash
docker run -d --name bbt-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bbt_qr \
  -p 5432:5432 \
  postgres:16-alpine
```

This matches the default URL in `server/.env.example`.

Stop/remove when finished:

```bash
docker stop bbt-postgres && docker rm bbt-postgres
```

### B. PostgreSQL installed on the host

Create an empty database (name **`bbt_qr`**). Examples:

```bash
# If your OS user is a Postgres superuser:
createdb bbt_qr

# Or using psql as the postgres role:
psql -U postgres -h localhost -c "CREATE DATABASE bbt_qr;"
```

Use a dedicated role if you prefer; then set `DATABASE_URL` accordingly:

`postgresql+psycopg2://USER:PASSWORD@localhost:5432/bbt_qr`

### C. Full stack via Compose

From the repo root, Postgres is started with Compose (`postgres` service, DB **`bbt_qr`**). You can point a **local** `DATABASE_URL` at it:

`postgresql+psycopg2://postgres:postgres@localhost:5432/bbt_qr`

(start Postgres first: `docker compose up -d postgres`)

## 2. Configure environment

From **`server/`**:

```bash
cp .env.example .env
```

Edit **`.env`** at minimum:

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Must match the DB you created |
| `SECRET_KEY` | Long random string for JWT signing |
| `CORS_ORIGINS` | Comma-separated, e.g. `http://localhost:3000` |
| `REDIRECT_BASE_URL` | Public origin for `/r/{code}` (**no trailing slash**), e.g. `http://localhost:8000` |

## 3. Virtualenv and dependencies

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## 4. Apply migrations (schema)

With `.env` loaded (run from **`server/`** so Alembic sees `.env`):

```bash
alembic upgrade head
```

This creates tables defined by the migration chain (initial revision **`001_initial_schema`** is included).

## 5. Run the API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Check:

- OpenAPI UI: **http://localhost:8000/docs**
- Health: **http://localhost:8000/health**
- Redirect smoke test (after you have a row): **http://localhost:8000/r/{short_code}**

## 6. Optional demo user and sample QRs

From **`server/`** with venv active and **`DATABASE_URL`** correct:

```bash
python scripts/seed_demo.py
```

Sign in to the app as **`bbt-demo@example.com`** / **`DemoPass123`** (see script header for Docker variant).

## New migrations after model changes

```bash
cd server && source .venv/bin/activate
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

Review the generated revision before committing; autogenerate can miss or over-delete objects.

## Troubleshooting

- **`could not connect to server`** — Postgres not running, wrong host/port, or firewall.
- **`database "bbt_qr" does not exist`** — Create the DB (section 1).
- **`password authentication failed`** — Fix user/password in `DATABASE_URL`.
- **Import / Alembic errors** — Run commands from **`server/`** and ensure `.env` is present there.
