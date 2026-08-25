# Cadence Architecture

Cadence is a local-first habit tracking, time tracking, and journaling app for iOS and Android. This document describes the recommended technical architecture for the Expo + SQLite implementation.

## 1. Product framing

Cadence is **one app with three lenses on the same day**, not three separate tools glued together.

| Domain | Primary job | Core unit |
|--------|-------------|-----------|
| Habits | Build consistency through scheduled actions | Check-in for a habit on a date |
| Time | Capture how attention was spent | Timed session with start/end |
| Journal | Reflect in writing | Entry tied to a date (and optionally a mood/tags) |

The unifying concept is the **Day**: a chronological timeline that merges habit completions, time sessions, and journal entries into a single narrative of “what happened today.”

### Product principles that drive architecture

1. **Local-first** — The app is fully usable offline. SQLite is the source of truth on device.
2. **Privacy by default** — Journal content stays on-device until the user explicitly opts into sync/backup.
3. **Instant feel** — Reads and writes hit local storage; no spinner for basic CRUD.
4. **One composition** — Today / Day views compose features; features do not own isolated silos of UX.
5. **Ship the loop first** — Sync, accounts, widgets, and social features are deferred until the core loops work.

## 2. Technology stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Runtime | Expo (React Native) | Single codebase for iOS and Android |
| Language | TypeScript (strict) | Shared types across UI, domain, and DB |
| Navigation | Expo Router (file-based) | Tabs + nested stacks |
| Local database | SQLite via `expo-sqlite` | Durable, queryable, migration-friendly |
| Schema / queries | Drizzle ORM (preferred) or raw SQL repositories | Typed schema, migrations, less boilerplate |
| Server/async cache | TanStack Query | Cache + invalidation for repository reads |
| Ephemeral UI state | Zustand (light) | Sheets, timer UI, filters — not business data |
| Notifications | `expo-notifications` | Habit reminders |
| Dates | `date-fns` or `dayjs` | Consistent local-date handling |
| Testing | Jest + React Native Testing Library | Unit tests for use cases and repositories |

### Why this stack

- Expo minimizes native project maintenance while still allowing custom native modules later via continuous native generation / prebuild.
- SQLite fits streak calculations, date-range queries, and offline journaling better than AsyncStorage or document stores.
- Feature folders keep habits / time / journal independently evolvable while sharing a Day composition layer.

### Explicit non-goals (v1)

- Multi-device sync and cloud accounts
- End-to-end encryption (revisit when sync lands)
- Native home-screen widgets (phase 2)
- Social sharing or public feeds
- Heavy analytics SDKs

## 3. High-level architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Presentation                         │
│  Expo Router screens · feature UI · design system        │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                   Application layer                      │
│  Use cases / commands · TanStack Query hooks             │
│  “completeHabit”, “stopSession”, “saveJournalEntry”      │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Domain model                          │
│  Habit · HabitLog · TimeSession · JournalEntry · Day     │
│  Pure types + small domain helpers (streaks, ranges)     │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                   Infrastructure                         │
│  Repositories · SQLite / Drizzle · notifications         │
└─────────────────────────────────────────────────────────┘
```

### Dependency rule

- UI may depend on application hooks and domain types.
- Application depends on domain + repository interfaces.
- Infrastructure implements repositories against SQLite.
- Domain depends on **nothing** from React, Expo, or SQLite.

This is intentionally lightweight Clean Architecture — four layers, no ceremony beyond what keeps boundaries clear.

## 4. Repository layout

```
cadence/
├── app/                          # Expo Router routes only
│   ├── (tabs)/
│   │   ├── index.tsx             # Today (Day timeline)
│   │   ├── habits.tsx
│   │   ├── time.tsx
│   │   ├── journal.tsx
│   │   └── _layout.tsx
│   ├── habit/[id].tsx
│   ├── journal/[id].tsx
│   ├── session/[id].tsx
│   ├── _layout.tsx
│   └── +not-found.tsx
├── src/
│   ├── features/
│   │   ├── habits/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── use-cases/
│   │   │   └── index.ts
│   │   ├── time/
│   │   ├── journal/
│   │   └── day/                  # Composes the three for Today
│   ├── domain/
│   │   ├── habit.ts
│   │   ├── time-session.ts
│   │   ├── journal-entry.ts
│   │   ├── day.ts
│   │   └── dates.ts              # Local-date helpers
│   ├── db/
│   │   ├── client.ts             # openDatabase / Drizzle client
│   │   ├── schema.ts
│   │   ├── migrations/
│   │   └── repositories/
│   │       ├── habits-repository.ts
│   │       ├── time-repository.ts
│   │       ├── journal-repository.ts
│   │       └── day-repository.ts
│   ├── shared/
│   │   ├── ui/                   # Buttons, sheets, typography, tokens
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── notifications/
│   └── store/                    # Zustand UI stores only
├── assets/
├── docs/
│   └── ARCHITECTURE.md
├── app.json
├── package.json
└── tsconfig.json
```

### Ownership rules

| Path | Owns |
|------|------|
| `app/` | Routing and screen wiring only — thin |
| `src/features/*` | Feature UI, hooks, use cases |
| `src/domain/` | Types and pure logic |
| `src/db/` | Schema, migrations, repository implementations |
| `src/shared/ui/` | Cross-feature design system |
| `src/store/` | Transient UI state (open sheets, active timer display) |

Features **must not** import SQL or open the database directly. They go through repositories / hooks.

## 5. Domain model

### 5.1 Habit

```ts
type HabitId = string;
type LocalDate = string; // YYYY-MM-DD in the user's local timezone

type HabitSchedule =
  | { kind: "daily" }
  | { kind: "weekly"; daysOfWeek: number[] }; // 0=Sun … 6=Sat

type Habit = {
  id: HabitId;
  name: string;
  schedule: HabitSchedule;
  color?: string;
  archivedAt: string | null; // ISO timestamp
  createdAt: string;
  updatedAt: string;
};

type HabitLogStatus = "completed" | "skipped";

type HabitLog = {
  id: string;
  habitId: HabitId;
  date: LocalDate;
  status: HabitLogStatus;
  completedAt: string | null;
  note?: string;
};
```

**Rules**

- One meaningful log per `(habitId, date)` (unique constraint).
- Streaks are derived from logs + schedule, not stored as source of truth (optional cache later).
- Archiving hides a habit from Today without deleting history.

### 5.2 Time session

```ts
type TimeSession = {
  id: string;
  label: string;
  tagId?: string;
  habitId?: HabitId; // optional link to a habit
  startedAt: string; // ISO
  endedAt: string | null; // null = running
  notes?: string;
};
```

**Rules**

- At most one **running** session at a time in v1 (enforced in use case).
- Duration is always derived: `endedAt - startedAt` (or `now - startedAt` while running).
- Sessions survive app kills because state lives in SQLite, not only memory.

### 5.3 Journal entry

```ts
type JournalEntry = {
  id: string;
  date: LocalDate;
  title?: string;
  body: string;
  mood?: number; // e.g. 1–5
  createdAt: string;
  updatedAt: string;
};
```

**Rules**

- Multiple entries per day are allowed.
- Body is plain text in v1 (rich text later).
- No cloud upload of body without an explicit sync product decision.

### 5.4 Day (composition)

```ts
type DayEvent =
  | { type: "habit_log"; at: string; data: HabitLog & { habitName: string } }
  | { type: "time_session"; at: string; data: TimeSession }
  | { type: "journal_entry"; at: string; data: JournalEntry };

type DaySummary = {
  date: LocalDate;
  events: DayEvent[]; // sorted by `at`
  habitStats: { due: number; completed: number };
  timeStats: { totalMs: number };
  journalStats: { entryCount: number };
};
```

The **Today** screen loads a `DaySummary` for the local date. Feature screens drill into their own lists/filters but still use the same underlying tables.

## 6. Database design

### 6.1 Tables (v1)

```sql
habits (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  schedule_json TEXT NOT NULL,
  color         TEXT,
  archived_at   TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

habit_logs (
  id            TEXT PRIMARY KEY,
  habit_id      TEXT NOT NULL REFERENCES habits(id),
  date          TEXT NOT NULL, -- YYYY-MM-DD
  status        TEXT NOT NULL, -- completed | skipped
  completed_at  TEXT,
  note          TEXT,
  UNIQUE(habit_id, date)
);

time_sessions (
  id            TEXT PRIMARY KEY,
  label         TEXT NOT NULL,
  tag_id        TEXT,
  habit_id      TEXT REFERENCES habits(id),
  started_at    TEXT NOT NULL,
  ended_at      TEXT,
  notes         TEXT
);

journal_entries (
  id            TEXT PRIMARY KEY,
  date          TEXT NOT NULL, -- YYYY-MM-DD
  title         TEXT,
  body          TEXT NOT NULL,
  mood          INTEGER,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

tags (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  color         TEXT
);

-- Optional indexes
CREATE INDEX idx_habit_logs_date ON habit_logs(date);
CREATE INDEX idx_time_sessions_started ON time_sessions(started_at);
CREATE INDEX idx_journal_entries_date ON journal_entries(date);
```

### 6.2 Migrations

- All schema changes go through versioned migrations under `src/db/migrations/`.
- On app launch, run migrations before rendering authenticated/main UI.
- Never edit an already-shipped migration; add a new one.

### 6.3 IDs and clocks

- IDs: UUID v4 (or ULID) generated in the repository/use case.
- Timestamps: ISO-8601 UTC strings in the DB.
- Calendar dates: `YYYY-MM-DD` in the **device local timezone**. Never derive “today” from UTC date alone.

### 6.4 Repository responsibilities

Each repository:

- Performs CRUD and query shaping for its aggregate.
- Returns domain types (not raw DB rows) to the app layer.
- Owns uniqueness / invariant checks that are data-local (e.g. unique habit log per day).
- Does **not** own cross-feature workflows (those live in use cases / day composition).

`day-repository` (or a day query service) joins/reads across tables to build `DaySummary`.

## 7. Application layer (use cases)

Prefer small, named use cases over fat screen components.

| Use case | Behavior |
|----------|----------|
| `createHabit` | Validate name/schedule; insert habit |
| `completeHabitForDate` | Upsert completed log; invalidate day + habit queries |
| `skipHabitForDate` | Upsert skipped log |
| `archiveHabit` | Soft-archive |
| `startTimeSession` | Stop any running session (or reject); insert new running row |
| `stopTimeSession` | Set `endedAt` |
| `createJournalEntry` | Insert entry for a local date |
| `updateJournalEntry` | Update body/title/mood + `updatedAt` |
| `getDaySummary` | Compose events + stats for a date |

### Query / mutation pattern

```ts
// hooks wrap repositories with TanStack Query
useDaySummary(date)          // queryKey: ['day', date]
useHabits()                  // queryKey: ['habits']
useCompleteHabit()           // mutation → invalidate ['day', date], ['habits', …]
```

**Invalidation rule:** after any write that affects a date, invalidate that day’s query and the owning feature’s list queries.

## 8. Presentation & navigation

### Tab map (v1)

| Tab | Route | Purpose |
|-----|-------|---------|
| Today | `(tabs)/index` | Day timeline + quick actions |
| Habits | `(tabs)/habits` | Habit list, streaks, manage |
| Time | `(tabs)/time` | Active timer + session history |
| Journal | `(tabs)/journal` | Entry list / calendar entry points |

Detail screens live outside tabs as stacks: `habit/[id]`, `session/[id]`, `journal/[id]`.

### UI guidelines (engineering implications)

- Shared primitives live in `src/shared/ui` (tokens, typography, buttons, bottom sheets).
- Feature components do not reinvent spacing/color — consume tokens.
- Today is a **composition screen**: it imports feature widgets (`HabitCheckRow`, `ActiveTimerCard`, `JournalSnippet`) rather than reimplementing domain logic.

### State split

| Kind of state | Where |
|---------------|-------|
| Persisted business data | SQLite |
| Async read models | TanStack Query |
| Modal open, selected filter, draft timer label | Zustand or local `useState` |
| Running timer display tick | UI interval reading `startedAt` from DB/query |

Do not mirror full habit/session lists into Zustand.

## 9. Cross-cutting concerns

### 9.1 App bootstrap

1. Open SQLite / Drizzle client.
2. Run migrations.
3. Mount React Query provider.
4. Render Expo Router root layout.

Use a splash / loading gate until migrations succeed.

### 9.2 Notifications

- Schedule local notifications from habit schedules.
- Reschedule on habit create/update/archive.
- Notification payload includes `habitId` for deep link into Today/Habits.
- Keep scheduling logic in `src/shared/notifications`, called from habit use cases.

### 9.3 Background & process death

- Running time sessions are DB rows with `ended_at IS NULL`.
- On cold start, if a running session exists, Time tab and Today show it as active.
- Do not rely solely on in-memory timers.

### 9.4 Error handling

- Repository errors → typed results or thrown domain errors.
- UI shows non-blocking toasts/banners for recoverable failures.
- Migration failure → blocking error screen with retry (data integrity > partial boot).

### 9.5 Testing strategy

| Layer | What to test |
|-------|--------------|
| Domain helpers | Streak calculation, schedule “due today”, duration math |
| Use cases | Invariants (one running session; upsert log) with fake repos |
| Repositories | Integration tests against in-memory/test SQLite where practical |
| Screens | Light RTL tests for critical flows |

### 9.6 Accessibility & i18n

- Use semantic labels on checkboxes/timer controls from day one.
- Keep user-facing strings in a single module (even before full i18n) to avoid hardcoding sprawl.

## 10. Security & privacy

- No secrets in the repo; future API keys via Expo env / EAS secrets.
- Journal and personal logs are local-only in v1.
- When sync is introduced: treat journal body as sensitive; plan for auth + transport security + clear user consent. Encryption-at-rest beyond OS defaults can be a later milestone.
- Avoid logging entry bodies in analytics or crash reports.

## 11. Sync roadmap (future, not v1)

When multi-device sync is needed:

1. Introduce auth and a backend (e.g. Supabase) **or** a sync engine (e.g. PowerSync / Electric).
2. Add `updated_at` / soft-delete (`deleted_at`) consistently if not already present.
3. Keep SQLite as the offline source of truth; sync becomes a background reconciler.
4. Conflict policy: last-write-wins per row is acceptable for v1 sync; journal merges may need richer rules later.

Until then, optional **export/import** (JSON) is a simpler backup path than full sync.

## 12. Build & release

| Concern | Approach |
|---------|----------|
| Dev | Expo Go or development builds |
| Native modules | Prefer Expo SDK modules; use `npx expo prebuild` when needed |
| CI | Typecheck, lint, unit tests on PR |
| Store builds | EAS Build |
| Channels | EAS Update for JS-only OTA when eligible |

## 13. Implementation phases

### Phase 0 — Foundation (current)

- Expo app with TypeScript + Expo Router
- Folder structure, design tokens stub
- SQLite client + initial schema/migrations
- Empty tab shells

### Phase 1 — Habits

- CRUD habits
- Complete/skip for today
- Basic streak display

### Phase 2 — Time

- Start/stop session
- History by day
- Optional habit/tag link

### Phase 3 — Journal

- Create/edit entries
- List by day
- Mood optional

### Phase 4 — Day composition

- Today timeline merging all three
- Quick actions from Today

### Phase 5 — Polish

- Habit reminder notifications
- Empty states, editing flows, archive
- Export backup (optional)

### Phase 6 — Sync / accounts (optional)

- Only after core loops feel solid

## 14. Coding conventions

- Prefer named exports from feature `index.ts` barrels for public API only.
- Keep route files thin: import a screen component from `features/*/screens`.
- Colocate feature-specific components under that feature.
- Use `LocalDate` branded/string convention consistently; never pass `Date` across repository boundaries without converting.
- Avoid `any`; enable TypeScript strict mode.
- No business writes from raw `useEffect` in screens — go through mutations/use cases.

## 15. Decision log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cross-platform | Expo | Speed + shared RN ecosystem |
| Persistence | SQLite | Relational queries for days/streaks/history |
| Navigation | Expo Router | File-based routing, deep links |
| Global business state | Not Redux | SQLite + Query is enough |
| Sync | Deferred | Local-first product; sync is a product decision |
| Day as composition | Yes | Makes Cadence one product instead of three |

---

*This document is the source of truth for Cadence’s engineering architecture. Update it when decisions change.*
