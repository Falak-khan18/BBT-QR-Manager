# BBT QR Manager

Production-style monorepo: **FastAPI** (PostgreSQL, SQLAlchemy, Alembic, JWT) and **Next.js** (TypeScript, Tailwind, shadcn/ui, React Hook Form, Zod, Axios). QR images encode a **stable redirect URL** (`/r/{short_code}`). Changing the row in the database updates the final destination without regenerating the QR itself.

## Submission checklist (assessment brief)

See **[docs/ASSESSMENT.md](docs/ASSESSMENT.md)** for the full mapping to **Section 01 (GitHub)**, **Section 02 (Figma)**, and **Section 03 (live demo)**, including the **hard requirement** that the QR **image** must not change when the destination URL is updated.

Short guides: **[docs/GITHUB_WORKFLOW.md](docs/GITHUB_WORKFLOW.md)** · **[docs/FIGMA.md](docs/FIGMA.md)**

## Live demo on a physical phone (Section 03)

Your phone cannot open `http://localhost:8000` on your laptop. Before scanning:

1. Use a host the phone can reach: your machine’s **LAN IP** (e.g. `192.168.1.42`) or an **ngrok** (etc.) URL forwarding to port **8000**.
2. Set **both** to the same origin (**no trailing slash**):
   - Backend `REDIRECT_BASE_URL` (e.g. `http://192.168.1.42:8000`)
   - Frontend `NEXT_PUBLIC_REDIRECT_BASE_URL` (same value)
3. Rebuild the Next.js app if you change `NEXT_PUBLIC_*` after a production build.

Then: create campaign → scan → change destination only → scan the **same** QR again; the **bitmap** must be unchanged.

## Architecture

```txt
QR scan  →  GET /r/{short_code}  →  DB lookup  →  HTTP 302  →  destination_url
```

The SPA talks to versioned JSON under `/api/v1`. Auth uses bearer JWTs stored in `localStorage` on the client.

## Prerequisites

- Python 3.12+
- Node 20+
- PostgreSQL 15+ (local or Docker)

## Environment variables

### Backend (`server/.env` — copy from `server/.env.example`)

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLAlchemy URL, e.g. `postgresql+psycopg2://user:pass@localhost:5432/bbt_qr` |
| `SECRET_KEY` | JWT signing secret |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime |
| `CORS_ORIGINS` | Comma-separated browser origins (e.g. `http://localhost:3000`) — single string, not JSON |
| `REDIRECT_BASE_URL` | Public origin where `/r/{code}` is served (**no trailing slash**) |

### Frontend (`client/.env.local` — copy from `client/.env.example`)

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API origin (`http://localhost:8000` in dev) |
| `NEXT_PUBLIC_REDIRECT_BASE_URL` | Same as backend `REDIRECT_BASE_URL`; used in UI copy + should match QR encoding |

## Local backend setup

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # edit DATABASE_URL / secrets
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Interactive docs: http://localhost:8000/docs  
- Health: http://localhost:8000/health  
- Redirect endpoint: http://localhost:8000/r/{short_code}

## Local frontend setup

```bash
cd client
npm install
cp .env.example .env.local   # align URLs with running API
npm run dev
```

App: http://localhost:3000

## Docker Compose (all services)

From the repository root:

```bash
docker compose up --build
```

- API: http://localhost:8000  
- UI: http://localhost:3000  
- Postgres: localhost:5432 (`postgres` / `postgres`, DB `bbt_qr`)

The `server` container runs `alembic upgrade head` before starting Uvicorn.

## Database & migrations

Create initial schema (after changing models):

```bash
cd server
source .venv/bin/activate
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

This repo already ships with `001_initial_schema`.

## API overview (`/api/v1`)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create user |
| POST | `/auth/login` | No | JWT access token |
| GET | `/auth/me` | Bearer | Current profile |
| GET | `/qr` | Bearer | List caller’s QR codes |
| POST | `/qr` | Bearer | Create (server assigns `short_code`) |
| GET | `/qr/{uuid}` | Bearer | Fetch one |
| PATCH | `/qr/{uuid}` | Bearer | Update title / destination |
| DELETE | `/qr/{uuid}` | Bearer | Remove |
| GET | `/r/{short_code}` | No | 302 redirect |

Pydantic validates bodies; services wrap DB access; SQLAlchemy errors surface as JSON `500` with a safe message.

## Demo script (Section 03 — for presenters)

1. In the **Next.js** dashboard, **create** a new QR campaign with a destination URL.  
2. **Scan the QR on a phone** (use LAN IP or tunnel in env — see above); confirm the first redirect.  
3. Return to the dashboard and **change only the destination URL**; save.  
4. **Scan the same QR again** — it must open the new URL.

**Hard check:** The **QR bitmap** in the dashboard must look **identical** before and after step 3 (same modules, same encoded string).

**Talking point:** The QR image stays the same because it only encodes the **redirect** endpoint (`…/r/{short_code}`); the backend resolves the latest **destination** from PostgreSQL on each scan.

**Demo user & sample QR rows:** run `docker compose exec server python scripts/seed_demo.py`, then sign in as **`bbt-demo@example.com` / `DemoPass123`**. Full phone-scan steps: **[docs/SCAN_AND_TEST.md](docs/SCAN_AND_TEST.md)**.

## Project layout

```txt
server/app           # FastAPI application package
server/alembic       # migrations
client/src/features  # feature-oriented API modules + UI
client/src/lib       # axios client, helpers
```

## Testing checklist

- Register + login + `/auth/me` with token  
- CRUD on `/qr` and 401 when token missing  
- GET `/r/{code}` 302 vs 404 for unknown codes  
- CORS from configured frontend origin
