# Cadence

Monorepo layout:

| Path | Stack | Role |
|------|--------|------|
| `apps/mobile` | Expo (React Native) | Client app |
| `services/api` | FastAPI (Python) | Agent API, Deepgram relay, Groq, LangGraph (to be wired) |
| `supabase/migrations` | SQL | Postgres + pgvector + RLS |

Product and build plan live in [`.docs/App Design and features.md`](.docs/App%20Design%20and%20features.md) and [`.docs/Implementation Plan.md`](.docs/Implementation%20Plan.md). The Implementation Plan includes a short **project status** section that is updated as work progresses.

## Environment variables

Keep **secrets out of Git**. Only `.env.example` files are committed.

| Location | Variables | Notes |
|----------|-----------|--------|
| `apps/mobile/.env` | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, optional `EXPO_PUBLIC_API_URL` | Public client key only (anon / publishable). Never Groq, Deepgram, Neo4j, or `service_role`. Restart Expo after changes. |
| `services/api/.env` | `GROQ_API_KEY`, `DEEPGRAM_API_KEY`, `NEO4J_URI`, `NEO4J_USERNAME` or `NEO4J_USER`, `NEO4J_PASSWORD`, optional `SUPABASE_*`, `CORS_ORIGINS`, optional Aura metadata in `.env.example` | Server-side only. Restart uvicorn after changes (`get_settings()` is cached on startup). |

**Production (Fly.io):** set the API variables with `fly secrets set` from `services/api` (see below). Do not bake secrets into the mobile app binary.

## Prerequisites

- Node.js LTS and npm (Expo)
- Python 3.12+ (API)
- Optional: [Docker](https://docs.docker.com/get-docker/) (API container), [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/), [Supabase CLI](https://supabase.com/docs/guides/cli) for linked migrations

## Mobile app

```powershell
cd apps\mobile
npm install
npm run start
```

Copy `apps/mobile/.env.example` to `apps/mobile/.env` and fill Supabase + optional API URL.

**Expo vs Next.js:** This app is **not** Next.js. Do not add `@supabase/ssr`, `middleware.ts`, or Next-style cookie middleware. Use `apps/mobile/lib/supabase.ts` (**AsyncStorage** for session persistence).

**Signed-in dev check:** `apps/mobile/app/index.tsx` runs a quick `profiles` query after login. Replace with real home when you build the shell UI.

## API (local)

```powershell
cd services\api
python -m venv .venv
# PowerShell: .\.venv\Scripts\Activate.ps1   |  cmd.exe: .venv\Scripts\activate.bat
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit .env (see Environment variables above)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```

Open [http://127.0.0.1:8080/docs](http://127.0.0.1:8080/docs).

**Smoke-test Groq / Deepgram / Neo4j** (uses `services/api/.env`):

```powershell
cd services\api
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts\check_connections.py
```

Each line prints `OK`, `FAIL` (with error), or `SKIP` if the related env vars are empty.

## API (Docker)

```powershell
cd services\api
docker build -t cadence-api .
docker run --rm -p 8080:8080 -e PORT=8080 cadence-api
```

## Supabase (cloud)

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the contents of `supabase/migrations/20260404120000_initial_schema.sql`, or install the Supabase CLI, run `supabase link`, then `supabase db push`.
3. Copy **Project URL** and the **public client key** (legacy **anon** `eyJ...` or new **publishable** `sb_publishable_...`) into `apps/mobile/.env` as `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy **JWT Secret** (Settings → API) into `services/api/.env` as `SUPABASE_JWT_SECRET` when you implement auth middleware.

## Fly.io (API deploy)

1. Install `flyctl` and log in: `fly auth login`.
2. From `services/api`, create the app once (unique name): `fly apps create cadence-api-yourname`.
3. Set `app` in `fly.toml` to that name.
4. Set secrets (example — align with `services/api/.env.example`):

   ```powershell
   cd services\api
   fly secrets set SUPABASE_URL=... SUPABASE_JWT_SECRET=... GROQ_API_KEY=... DEEPGRAM_API_KEY=... NEO4J_URI=... NEO4J_USERNAME=... NEO4J_PASSWORD=... CORS_ORIGINS=https://your-app.example
   ```

5. Deploy: `fly deploy`.

`primary_region` in `fly.toml` is set to `iad` (US East); change it if your users are elsewhere.

## Neo4j Aura

Create a free database at [neo4j.com/cloud](https://neo4j.com/cloud/). Put **`NEO4J_URI`** (e.g. `neo4j+s://…`), **`NEO4J_USERNAME`** (or **`NEO4J_USER`**), and **`NEO4J_PASSWORD`** in `services/api/.env` and in Fly secrets for production. The Python API does not open a Neo4j connection until graph ingestion is implemented.

**Neo4j (Aura) connection issues:**

- **Routing:** “Unable to retrieve routing information” — use the **Neo4j URI** from Aura (`neo4j+s://….databases.neo4j.io`), not a browser URL. If routing keeps failing, try **`bolt+s://`** with the same host; `scripts/check_connections.py` retries with `bolt+s` after a routing error.
- **Neo4j driver + `ssl_context`:** With **`neo4j+s://`** / **`bolt+s://`**, the official driver **does not allow** passing **`ssl_context`** (encryption is defined by the URI). The check script sets **`SSL_CERT_FILE`** to **`certifi`**’s CA bundle before connecting so OpenSSL can still verify Aura’s certificate on Windows. Run `pip install -r requirements.txt` and `pip install -U certifi` in `.venv`. If TLS still fails, try a **different network** (e.g. phone hotspot).

## Groq and Deepgram

Keys live in **`services/api/.env`** (local) and **Fly secrets** (deployed). The mobile app must never embed them; Expo only uses the Supabase public key and your API base URL when those features exist.

## Supabase CLI

**Optional.** You can keep applying SQL from `supabase/migrations/*.sql` via the **Supabase Dashboard → SQL Editor**. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) when you want `supabase link`, `db push`, or `gen types`.
