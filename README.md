# Cadence

Monorepo layout:

| Path | Stack | Role |
|------|--------|------|
| `apps/mobile` | Expo (React Native) | Client app |
| `services/api` | FastAPI (Python) | Agent API, Deepgram relay, Groq, LangGraph (to be wired) |
| `supabase/migrations` | SQL | Postgres + pgvector + RLS |

Product and build plan live in [`.docs/App Design and features.md`](.docs/App%20Design%20and%20features.md) and [`.docs/Implementation Plan.md`](.docs/Implementation%20Plan.md).

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

Copy `apps/mobile/.env.example` to `apps/mobile/.env` and fill Supabase + API URL when ready.

**Expo vs Next.js:** This app is **not** Next.js. Do not add `@supabase/ssr`, `middleware.ts`, or `NEXT_PUBLIC_*`. The client lives in `apps/mobile/lib/supabase.ts` and uses **AsyncStorage** so sessions persist and refresh on device.

## API (local)

```powershell
cd services\api
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env — optional for /health only
uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```

Open [http://127.0.0.1:8080/docs](http://127.0.0.1:8080/docs).

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
4. Set secrets (example):

   ```powershell
   cd services\api
   fly secrets set SUPABASE_URL=... SUPABASE_JWT_SECRET=... GROQ_API_KEY=... DEEPGRAM_API_KEY=... CORS_ORIGINS=https://your-app.example
   ```

5. Deploy: `fly deploy`.

`primary_region` in `fly.toml` is set to `iad` (US East); change it if your users are elsewhere.

## Neo4j Aura

Create a free database at [neo4j.com/cloud](https://neo4j.com/cloud/), then add `NEO4J_URI`, `NEO4J_USER`, and `NEO4J_PASSWORD` to `services/api/.env` / Fly secrets when graph ingestion is implemented.

## Groq and Deepgram

Add API keys to `services/api/.env` locally and to Fly secrets in production. Do not put these keys in the Expo app; the mobile client should only talk to your API and Supabase (anon key).
