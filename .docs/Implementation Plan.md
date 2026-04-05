# Cadence — Implementation Plan

This document turns the vision in [App Design and features](./App%20Design%20and%20features.md) into a phased build plan. Tasks use `- [ ]` so you can track progress in Obsidian or any Markdown viewer.

**Suggested sequencing:** complete Phases 0–3 before parallelizing mobile (4–5) with backend (6–8). Neo4j-heavy work (9–10) can start after core extraction APIs exist. Phases 11–14 layer product polish and scale readiness.

**Locked stack choices:**

- [x] **Speech:** **Deepgram** — live streaming STT; align product copy with “voice” rather than vendor name. Relay streams through the Python API so the Deepgram key never ships in the app.
- [x] **Agent runtime:** **Python service** (FastAPI or similar) running **LangGraph**, **Pydantic**, and **Groq** — not Supabase Edge Functions for the main agent graph.
- [x] **Hosting for API:** **Fly.io (recommended)** — deploy a small **always-on** machine (VM), pick a **region close to your users** and to Groq’s API egress (for many setups, a US region such as `iad` is a reasonable default; validate latency from your target markets). Fly avoids serverless **cold starts**, handles **WebSockets / SSE** for streaming agent replies, and fits a long-running Python process with Neo4j driver pooling. **Railway** is a strong alternative if you want the **simplest** GitHub-to-deploy path and are fine with its pricing model; avoid **Render free tier** for this stack if **cold starts** would hurt the “snappy chat” goal (paid Render is fine).

---

## Phase 0 — Product, UX, and technical foundations

**Goal:** Freeze scope for MVP, define contracts, and avoid rework.

- [ ] Write a **one-page MVP definition**: must-have vs later (e.g. widget in MVP or v1.1).
- [ ] List **3–5 primary user journeys** (e.g. voice log → confirmed entry; text log → clarification; ask correlation question).
- [ ] Define **personas** (optional): casual logger vs quantified-self power user — affects density of UI.
- [ ] Choose **platform order**: iOS-first, Android-first, or simultaneous (Expo supports both; widgets differ).
- [ ] Document **privacy stance**: what is stored, retention, export, delete account — for App Store / Play copy later.
- [ ] Create a **glossary**: Entry, Log, Session, Rhythm Score, Node, Edge, Canonical activity, Time anchor.
- [ ] Decide **timezone rule**: device timezone vs profile timezone vs per-entry override.
- [ ] Decide **offline behavior**: queue logs locally vs require network for MVP.
- [ ] Pick **repository layout**: monorepo (`apps/mobile`, `services/api`) vs polyrepo.
- [ ] Add **branch strategy** and **conventional commits** (or your preference) to team notes.
- [ ] Register **accounts**: Expo, Supabase, Neo4j Aura, Groq, **Deepgram**, error tracking (e.g. Sentry).

---

## Phase 1 — Repository, tooling, and environments

**Goal:** A clean workspace that builds on CI and runs locally with one command each for app and API.

- [ ] Initialize **Git** with meaningful `.gitignore` (Node, Python, Expo, env files, secrets).
- [ ] Add **README** with prerequisites (Node LTS, Python version, Expo CLI / EAS).
- [ ] Scaffold **Expo (React Native)** app in `apps/mobile` (or chosen path).
- [ ] Enable **TypeScript** strict mode in the mobile app.
- [ ] Add **ESLint + Prettier** (or Biome) for mobile; align rules with team preference.
- [ ] Scaffold **Python** service in `services/api` with `pyproject.toml` or `requirements.txt`.
- [ ] Pin **Python version** (`.python-version` or `tool.poetry` / `uv` lockfile).
- [ ] Add **Ruff** (lint) and **mypy** (types) for Python API.
- [ ] Add **pre-commit** hooks (format, lint) for both stacks.
- [ ] Create **`.env.example`** for mobile (public URLs, anon keys only) and **`.env.example`** for API (secrets named, never committed).
- [ ] Document **local run** commands: `pnpm expo start` / `npm`, `uvicorn`, etc.
- [ ] Add **GitHub Actions** (or equivalent) workflow: lint mobile, lint API, run unit tests (stub OK initially).
- [ ] Add **secret management** plan: EAS secrets, GitHub encrypted secrets, Supabase dashboard keys.

---

## Phase 2 — Mobile app shell (navigation, layout, design system)

**Goal:** Navigable app with placeholder screens and consistent UI tokens before features land.

- [ ] Choose **navigation**: Expo Router (file-based) or React Navigation — implement root layout.
- [ ] Create screens: **Home**, **Chat / Log**, **History**, **Settings** (adjust names to product).
- [ ] Implement **tab or stack** navigation matching primary journeys.
- [ ] Define **design tokens**: color palette, typography scale, spacing, radii, elevation.
- [ ] Build **base components**: `Button`, `Text`, `Screen`, `Card`, `Input`, `Icon` wrapper.
- [ ] Implement **light/dark mode** (optional for MVP; if deferred, document as post-MVP).
- [ ] Add **safe area** handling and keyboard-avoiding behavior for chat input.
- [ ] Add **loading** and **empty** states shared across screens.
- [ ] Wire **React Query** or similar for server state (optional but recommended before API integration).
- [ ] Add **global error boundary** and user-friendly error toast/banner.
- [ ] Configure **app.json / app.config** for name, slug, icons, splash (placeholders OK).

---

## Phase 3 — Supabase project (Postgres, auth-ready schema)

**Goal:** Managed Postgres as source of truth for users, entries metadata, and vectors later.

- [ ] Create **Supabase project** (region closest to majority users).
- [ ] Enable **Supabase Auth** (email magic link, OAuth providers as needed).
- [ ] Install **Supabase CLI** locally; link project.
- [ ] Create **`supabase/migrations`** in repo (or dedicated `packages/db`).
- [ ] Migration: **`profiles`** table — `id` (FK auth.users), `display_name`, `timezone`, `created_at`, `updated_at`.
- [ ] Migration: **`entries`** — `id`, `user_id`, `raw_text`, `source` (voice/text), `created_at`, `local_timestamp`, `tz_offset_minutes`, `processing_status`, `neo4j_sync_status`, optional `structured_payload` (JSONB).
- [ ] Migration: **`entry_embeddings`** (deferred if you prefer single table) — `entry_id`, `embedding vector(1536)` or model-specific dimension; **enable pgvector** extension first.
- [ ] Migration: **`conversations` / `messages`** if you persist chat for agent state — `thread_id`, role, content, tool_calls JSONB, timestamps.
- [ ] Migration: **`clarification_turns`** or embed in `messages` — track pending clarifications.
- [ ] Add **RLS policies**: users read/write only their rows; service role bypasses for API.
- [ ] Add **indexes**: `(user_id, created_at DESC)`, GIN on JSONB if querying structured fields.
- [ ] Document **RLS testing** checklist (manual SQL as each user).
- [ ] Generate **TypeScript types** from DB (`supabase gen types`) for mobile and optional shared package.

---

## Phase 4 — Mobile ↔ Supabase integration

**Goal:** Signed-in user can persist and list raw entries from the device.

- [ ] Add **`@supabase/supabase-js`** to mobile with **AsyncStorage** session persistence.
- [ ] Implement **auth screens**: sign up, sign in, sign out, password reset if using passwords.
- [ ] Implement **session restore** on cold start.
- [ ] Create **API module** in mobile: `createEntry`, `listEntries`, `getProfile`, `updateProfile`.
- [ ] Handle **RLS errors** and token refresh gracefully.
- [ ] Add **optimistic UI** or pending state when saving entries (optional).
- [ ] Implement **Settings**: display email, timezone picker, save to `profiles.timezone`.
- [ ] Pass **device timezone** to backend on each log request (for temporal grounding).

---

## Phase 5 — Voice capture and streaming transcription

**Goal:** Large record control, live partial transcript, finalized text for the pipeline.

- [ ] Add **microphone permissions** flow with clear copy (iOS `Info.plist`, Android permissions via Expo config plugin if needed).
- [ ] Implement **push-to-talk** or **tap-to-toggle** record UX per design doc.
- [ ] Choose **audio format** (sample rate, mono) compatible with chosen STT API.
- [ ] Integrate **Deepgram live streaming** (WebSocket): **backend relay** from mobile → Python API → Deepgram so the **API key stays server-side**.
- [ ] Build **transcript UI**: partial text updates, final transcript, edit-before-send.
- [ ] Add **cancel** and **re-record** actions.
- [ ] Handle **network loss** during recording (message + retry).
- [ ] Log **audio duration** metrics for cost monitoring (server-side).

---

## Phase 6 — API service skeleton and Groq integration

**Goal:** Authenticated HTTP API that calls Groq with strict structured output.

- [ ] Framework: **FastAPI** (or similar) with **OpenAPI** docs.
- [ ] Add **CORS** restricted to app origins / deep links.
- [ ] Middleware: **request ID**, structured logging, timeout enforcement.
- [ ] Verify **Supabase JWT** on protected routes (JWKS from Supabase).
- [ ] Map JWT `sub` to **internal user_id** consistently.
- [ ] Install **Groq SDK**; load `GROQ_API_KEY` from environment.
- [ ] Define **Pydantic models** for extraction output: activities, durations, sentiments, intensities, notes, ambiguity flags.
- [ ] Define **canonical vocabularies**: activity types, mood scale, intensity enums — store as code or DB seed.
- [ ] Implement **prompt templates** with schema instructions and few-shot examples.
- [ ] Use **structured output** mode / JSON schema / tool use — whatever Groq supports best for reliability.
- [ ] Add **retry with backoff** on transient failures; cap tokens and cost per request.
- [ ] Unit tests: **golden utterances** → expected normalized output (table-driven).

---

## Phase 7 — Normalization and temporal grounding

**Goal:** “An hour” → 60; “this morning” → anchored instant in user’s timezone.

- [ ] Implement **duration parser** layer: combine LLM output with **parsed timedelta** validation.
- [ ] Reject or clamp **nonsense durations** (e.g. negative, > 24h for a single activity unless allowed).
- [ ] Implement **temporal grounding module** inputs: `utterance`, `user_tz`, `device_now` (ISO), optional `profile_defaults`.
- [ ] Encode rules for **“this morning”**, **“afternoon”**, **“last night”**, **“yesterday”** relative to local midnight.
- [ ] Store both **UTC timestamp** and **local civil date** for the entry to simplify queries.
- [ ] Add **unit tests** across DST boundaries (use `zoneinfo` / `tzdata`).
- [ ] Log **grounding decisions** for debugging (structured, no PII in plain text logs if possible).

---

## Phase 8 — Persist structured entries and processing pipeline

**Goal:** End-to-end: transcript/text → structured JSON → Supabase row updates → client confirmation.

- [ ] API route: **`POST /entries/ingest`** — accepts text, optional audio metadata, `client_timestamp`, `timezone`.
- [ ] Pipeline steps: **validate** → **extract (Groq)** → **ground time** → **merge with user corrections** (later).
- [ ] Update **`entries.processing_status`**: `pending` → `processing` → `completed` / `failed`.
- [ ] Store **structured_payload** JSONB with version field for migrations of schema.
- [ ] Return **human-readable summary** + machine payload for UI confirmation card.
- [ ] Mobile: **confirmation sheet** — user can edit fields or confirm.
- [ ] API route: **`PATCH /entries/:id`** for user corrections; optionally trigger **re-graph sync**.
- [ ] Add **idempotency key** header for ingest to prevent duplicate entries on retry.

---

## Phase 9 — Neo4j graph model and Aura setup

**Goal:** Graph representation of days, domains, activities, metrics, and entries for correlation queries.

- [ ] Create **Neo4j Aura** free tier instance; record connection URI and credentials in secret store.
- [ ] Choose **driver** for Python: `neo4j` official driver with connection pooling.
- [ ] Document **node labels**: `User`, `Day`, `Entry`, `Activity`, `Domain`, `Metric`, `Mood` (tune to your ontology).
- [ ] Document **relationship types**: `LOGGED_ON`, `CATEGORIZED_AS`, `IN_DOMAIN`, `FOLLOWED_BY`, `ASSOCIATED_WITH`, etc.
- [ ] Implement **MERGE patterns** for stable nodes (e.g. `Day` from date string per user).
- [ ] Implement **ingestion function**: structured entry → parameterized Cypher (no string concat of user text into query).
- [ ] Map **each extraction field** to graph elements (including sentiment as property or linked node).
- [ ] Store **Supabase entry id** on `Entry` node for cross-reference.
- [ ] Update **`neo4j_sync_status`** in Postgres after successful write.
- [ ] Add **batch repair job**: re-sync entries where sync failed.
- [ ] Indexes / constraints in Neo4j on `(User.id)`, `(Entry.supabase_id)` uniqueness.

---

## Phase 10 — LangGraph agent, tools, and clarification loop

**Goal:** Stateful agent that extracts, writes graph, asks follow-ups when ambiguous.

- [ ] Install **LangGraph** and **LangChain** Groq chat model bindings as needed.
- [ ] Define **graph state**: messages, pending_extractions, user_id, entry_id, flags.
- [ ] Nodes: **classify_intent**, **extract_entities**, **ground_temporal**, **persist_supabase**, **persist_neo4j**, **respond_user**, **clarify**.
- [ ] Edges: conditional on **ambiguity score** or missing required fields → **clarify** vs **commit**.
- [ ] Tools: **query_user_entries** (Postgres), **semantic_search_journal** (pgvector, later), **run_cypher_read** (carefully sandboxed), **suggest_correlation** (template queries).
- [ ] Implement **max turns** and **max tool calls** to prevent runaway loops.
- [ ] Persist **thread state** to Supabase (`conversations` / `messages`) for resume across sessions.
- [ ] API: **`POST /agent/chat`** streaming SSE or WebSocket for tokens (match mobile UX).
- [ ] Tests: scripted dialogues asserting tool invocation and final state.

---

## Phase 11 — pgvector semantic search

**Goal:** “Find when I talked about stress before exams” over past entries.

- [ ] Enable **pgvector** in Supabase if not already (`create extension vector`).
- [ ] Choose **embedding model** (OpenAI, local, or other) — dimension must match column.
- [ ] API: **`POST /entries/:id/embed`** or async worker to embed on `completed` entries.
- [ ] Background: **queue** embedding jobs (Supabase `pgmq`, Edge Function cron, or worker on API host).
- [ ] Implement **similarity search** API: query text → embed → `ORDER BY embedding <=> query LIMIT k` with RLS.
- [ ] Mobile: **search UI** — list results with snippet + jump to entry detail.
- [ ] Add **hybrid** optional later: keyword + vector.

---

## Phase 12 — Rhythm score and home widget

**Goal:** Single number (or small set) summarizing “how the day looks” to the model + user.

- [ ] Define **Rhythm Score v1** formula (e.g. weighted activities, sleep, mood trend — document explicitly).
- [ ] Implement **deterministic calculation** from last N hours of structured data (Postgres and/or Neo4j read).
- [ ] API: **`GET /insights/rhythm?date=`** returning score, components, short natural language summary via Groq (optional).
- [ ] Mobile **Home** card showing score and **tap for breakdown**.
- [ ] **iOS widget** (Expo config plugin or native module): read shared app group / background fetch limitations documented.
- [ ] **Android widget** equivalent if in scope.
- [ ] **Cache** score server-side or client-side with invalidation on new entry.

---

## Phase 13 — Haptics, push notifications, and polish

**Goal:** Tactile confirmation and gentle nudges aligned with product tone.

- [ ] On successful parse **commit**, trigger **light impact** haptic (`expo-haptics`).
- [ ] Add **user toggle** in Settings to disable haptics.
- [ ] Configure **Expo Notifications**; request permission with justified copy.
- [ ] Define **notification scenarios**: daily reminder, streak, “you haven’t logged…” (opt-in).
- [ ] Server: **schedule** or **trigger** pushes via FCM/APNs through Expo push API (if used).
- [ ] **Accessibility**: screen reader labels on record button, transcript, and scores.
- [ ] **Localization** structure (even if English-only MVP): extract strings.

---

## Phase 14 — Security, observability, and cost controls

**Goal:** Safe-enough MVP for real users and predictable bills.

- [ ] **Rate limit** API per user and per IP (middleware or gateway).
- [ ] **Audit** that no service keys ship in mobile bundles (use EAS secret scanning / `strings` check).
- [ ] **Rotate keys** procedure documented.
- [ ] **PII minimization** in logs; redact tokens and raw audio.
- [ ] **Error tracking**: Sentry in mobile + API with environment tags.
- [ ] **Metrics**: request latency, Groq token usage, STT minutes, Neo4j query time.
- [ ] **Alerts** when error rate or cost exceeds threshold.
- [ ] **Backup strategy**: Supabase PITR if on paid tier; export scripts for Neo4j if needed.

---

## Phase 15 — QA, release, and iteration

**Goal:** TestFlight / internal testing and a feedback loop.

- [ ] **Test plan** matrix: auth, ingest, offline, DST, clarification flow, graph sync failure recovery.
- [ ] **Device farm** or manual pass on low-end Android + recent iPhone.
- [ ] **EAS Build** pipelines for `preview` and `production`.
- [ ] **Store listings**: screenshots, privacy policy URL, support email.
- [ ] **Beta** via TestFlight / Play internal track; gather crashes and UX notes.
- [ ] **Post-MVP backlog** slot: correlations UI (“Sunday sleep vs Monday lift”), exports, Apple Health / Google Fit.

---

## Appendix — Traceability to original vision

| Vision item | Primary phase(s) |
|-------------|------------------|
| Stateful phone agent | 10, 4, 8 |
| Messy time → structured graph | 6–10 |
| Expo + haptics + voice + push | 2, 5, 13 |
| LangGraph orchestration | 10 |
| Supabase + pgvector | 3, 11 |
| Neo4j correlations | 9, 10 |
| Groq fast chat | 6, 10 |
| Pydantic extraction | 6 |
| Temporal grounding | 7 |
| Clarification loop | 10 |
| Rhythm widget | 12 |

---

## How to use this doc

- Check off tasks as you complete them; **split any task** that grows past ~1–2 days into sub-bullets.
- When **MVP scope** changes, revisit Phase 0 and re-stub later phases before building.

Last updated: aligned with `.docs/App Design and features.md` as of project start.
