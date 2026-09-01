# Cadence Architecture

Cadence is a local-first habit tracking, time tracking, and journaling app for iOS and Android. This document describes the technical architecture for the Expo + SQLite implementation as shipped.

## 1. Product framing

Cadence is **one app with three lenses on the same data**, not three separate tools glued together.

| Domain | Primary job | Core unit |
|--------|-------------|-----------|
| Habits | Build consistency through timed practice | Timed session that completes a habit for a date |
| Time | Capture how attention was spent | Timed session with start/end (habit-bound in the current product) |
| Journal | Reflect in writing | Entry tied to a date (optionally to a habit/session) |

The unifying concept is the **Day**: a chronological timeline that merges timed sessions and journal entries into a single narrative of “what happened.”

### Product principles that drive architecture

1. **Local-first** — The app is fully usable offline. SQLite is the source of truth on device.
2. **Privacy by default** — Journal content stays on-device until the user explicitly opts into sync/backup.
3. **Instant feel** — Reads and writes hit local storage; no spinner for basic CRUD.
4. **Habits-first action** — Habits is the action hub; Analytics shows patterns; Journal narrates the day.
5. **Timer-first completion** — Ending a live session marks the habit complete for that local date. Journal can also **backfill** a finished session (duration + habit) without running the timer live.
6. **Session-level timer settings** — Stopwatch vs pomodoro (and pomodoro lengths) are chosen when starting a session, not fixed on the habit. Last choice per habit is remembered in AsyncStorage.
7. **Ship the loop first** — Sync, accounts, widgets, and social features are deferred until the core loops work.

## 2. Technology stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Runtime | Expo ~57 (React Native) | Single codebase for iOS and Android |
| Language | TypeScript (strict) | Shared types across UI, domain, and DB |
| Navigation | Expo Router (file-based) | Tabs + nested stacks |
| Local database | SQLite via `expo-sqlite` | Durable, queryable, migration-friendly |
| Schema / queries | Drizzle ORM | Typed schema; SQL migrations in `migrate.ts` |
| Server/async cache | TanStack Query | Cache + invalidation for repository reads |
| Ephemeral UI state | Zustand | Sheets, journal prompt, habit form, analytics selection |
| Session prefs | AsyncStorage | Last stopwatch/pomodoro choice per habit |
| Icons | Lucide (`lucide-react-native`) | Curated icon ids stored on habits |
| Typography | DM Sans + Literata | Loaded in root layout via `@expo-google-fonts/*` |
| Motion / feedback | Reanimated + `expo-haptics` | Session UI motion; light selection/success haptics |
| Notifications | `expo-notifications` | Session phase end + habit reminders (local). Lazy-loaded; no-op in Expo Go on Android |
| Dates | `date-fns` + domain helpers | Local dates; weeks start Monday for analytics |

### Explicit non-goals (v1)

- Multi-device sync and cloud accounts
- Separate Today / Time tabs in the tab bar
- End-to-end encryption (revisit when sync lands)
- Native home-screen widgets (phase 2+)
- Social sharing or public feeds
- Heavy analytics SDKs
- Remote push notifications in Expo Go on Android (SDK 53+); use a development build for full local notification support there
- Automated test suite (deferred; add Jest + RNTL when needed)
- Export backup (optional polish)

## 3. High-level architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Presentation                         │
│  Expo Router screens · feature UI · design system        │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                   Application layer                      │
│  TanStack Query hooks (features/*/hooks)                 │
│  start / pause / stop session, CRUD habits & journal,    │
│  day/stats, journal backfill                             │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Domain model                          │
│  Habit · HabitLog · TimeSession · JournalEntry · Day     │
│  Pure types + helpers (streaks, ranges, duration, icons) │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                   Infrastructure                         │
│  Repositories · SQLite / Drizzle · migrations            │
│  AsyncStorage (session prefs only)                       │
└─────────────────────────────────────────────────────────┘
```

### Dependency rule

- UI may depend on application hooks and domain types.
- Hooks call repository factories from `src/db` (not raw SQL).
- Infrastructure implements repositories against SQLite.
- Domain depends on **nothing** from React, Expo, or SQLite.

## 4. Repository layout

```
cadence/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx             # Habits (action hub)
│   │   ├── analytics.tsx
│   │   ├── journal.tsx
│   │   └── _layout.tsx           # tabs + ActiveSessionBar + JournalPromptSheet
│   ├── journal/[id].tsx
│   ├── session/active.tsx
│   ├── _layout.tsx               # fonts, providers, stack
│   ├── +html.tsx
│   └── +not-found.tsx
├── src/
│   ├── features/
│   │   ├── habits/               # list, form, start-session sheet, hooks
│   │   ├── time/                 # ActiveSessionScreen
│   │   ├── journal/              # day timeline, entry detail, LogHabitSheet
│   │   └── analytics/
│   ├── domain/
│   ├── db/
│   │   ├── client.ts
│   │   ├── schema.ts
│   │   ├── migrate.ts
│   │   ├── repositories/
│   │   └── utils.ts
│   ├── shared/
│   │   ├── providers/            # AppProviders, DatabaseProvider, SessionLifecycleProvider
│   │   ├── ui/                   # tokens, HabitIcon, SessionRing, EmptyState, sheets
│   │   └── lib/                  # query-keys, notifications, haptics, session-prefs
│   ├── store/                    # Zustand UI store
│   └── types/
├── docs/
│   ├── ARCHITECTURE.md
│   └── PRODUCT.md              # Product brief (e.g. design / Stitch context)
├── components/                 # Expo template leftovers (partially still imported)
├── constants/                  # Expo template leftovers
└── …
```

### Ownership rules

| Path | Owns |
|------|------|
| `app/` | Routing and screen wiring only — thin |
| `src/features/*` | Feature UI, hooks, mutations |
| `src/domain/` | Types and pure logic |
| `src/db/` | Schema, migrations, repository implementations |
| `src/shared/ui/` | Cross-feature design system |
| `src/store/` | Transient UI state (open sheets, journal prompt) |

Features **must not** open the database or write SQL. They go through repository factories / hooks.

## 5. Domain model

### 5.1 Habit

```ts
type TimerMode = "stopwatch" | "pomodoro";

type PomodoroConfig = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  rounds: number; // focus rounds before a long break
};

type HabitSchedule =
  | { kind: "daily"; reminderMinutes?: number | null }
  | { kind: "weekly"; daysOfWeek: number[]; reminderMinutes?: number | null };

type StreakMode = "calendar" | "scheduled";

type StreakSettings = {
  mode: StreakMode; // calendar = every day; scheduled = only schedule days
  graceDays: number; // 0–3 missed days allowed before streak breaks
};

type Habit = {
  id: HabitId;
  name: string;
  icon: string; // Lucide icon id (see HABIT_ICON_IDS)
  category?: string;
  schedule: HabitSchedule;
  streak: StreakSettings;
  /** @deprecated Retained for DB compatibility; prefer StartSessionSheet. */
  timerMode: TimerMode;
  /** @deprecated Retained for DB compatibility. */
  pomodoroMinutes: number;
  color?: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
```

**Rules**

- One meaningful log per `(habitId, date)` (unique constraint).
- Completing a timed session upserts a completed `HabitLog` for that local date.
- Multiple sessions the same day are allowed; the daily log stays one completed row.
- Archiving hides a habit from the Habits list without deleting history; restore is supported.
- Timer mode and pomodoro lengths are chosen at session start (`StartSessionSheet`), not edited as primary habit fields.
- Last mode/config per habit is persisted via `session-prefs` (AsyncStorage), not SQLite.
- Optional `reminderMinutes` (minutes from local midnight) schedules a local notification.
- Per-habit `streak` settings drive `computeCurrentStreak` (grace + calendar vs scheduled). If today is still open, counting starts from yesterday.
- Habit form UX: name → category → icon (searchable; first 24 until Advanced), weekday schedule picker, reminder, and streak settings. All seven weekdays selected stores a daily schedule; fewer days stores weekly.
- Schema fields not yet exposed in UI: habit `color`, journal `mood`, `tags` table, habit-log `skipped` status.

### 5.2 Time session

```ts
type PomodoroPhase = "focus" | "short_break" | "long_break";

type PomodoroSessionState = {
  config: PomodoroConfig;
  phase: PomodoroPhase;
  round: number; // 1-based focus round
  phaseStartedAt: string;
};

type TimeSession = {
  id: string;
  label: string;
  tagId?: string;
  habitId?: HabitId; // set for habit-started sessions
  mode: TimerMode;
  targetDurationMs?: number; // current phase target (or logged duration)
  startedAt: string; // overall session start (wall clock)
  endedAt: string | null;
  notes?: string; // encodes PomodoroSessionState as `cadence:pomodoro:{…}`
  pausedAt?: string | null; // set while paused; null when running
  pausedTotalMs: number; // sum of completed pause intervals
};
```

**Rules**

- At most one **running** session at a time in v1 (enforced in the start path). A paused session still counts as running (`ended_at IS NULL`).
- Overall duration is `endedAt − startedAt − pausedTotalMs` (plus any open pause while still paused). Helpers: `sessionDurationMs`, `sessionClock`, `isSessionPaused`.
- Pause freezes the wall clock used for stopwatch and pomodoro phase math. Resume folds the open pause into `pausedTotalMs` and shifts pomodoro `phaseStartedAt` forward by the same delta so remaining time is preserved.
- Sessions survive app kills because state lives in SQLite, not only memory.
- Pomodoro automation: focus → short break (repeat) → after last focus → long break → auto-complete.
- Phase transitions update `notes` + `targetDurationMs` without ending the DB row until the cycle completes or the user stops. Advance is a no-op while paused.
- **Journal backfill:** `logCompleted` inserts an already-finished stopwatch session anchored to a local date (ended at local noon, started = ended − duration), then upserts the habit log. Used by Journal → Log habit.

### 5.3 Journal entry

```ts
type JournalEntry = {
  id: string;
  date: LocalDate;
  title?: string;
  body: string;
  mood?: number;
  habitId?: HabitId;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
};
```

**Rules**

- Multiple entries per day are allowed.
- Manual entries leave `habitId` / `sessionId` null.
- Post-session reflections may link both for timeline context.
- On the day timeline, entries with a matching `sessionId` are **nested** into that session card (`composeDayEvents`); free writes stay standalone events.

### 5.4 Day (composition)

```ts
type DayEvent =
  | { type: "habit_log"; at: string; data: HabitLog & { habitName: string; habitIcon?: string } }
  | {
      type: "time_session";
      at: string;
      data: TimeSession & {
        habitName?: string;
        habitIcon?: string;
        journal?: JournalEntry & { habitName?: string; habitIcon?: string };
      };
    }
  | { type: "journal_entry"; at: string; data: JournalEntry & { habitName?: string; habitIcon?: string } };

type DaySummary = {
  date: LocalDate;
  events: DayEvent[];
  habitStats: { due: number; completed: number };
  timeStats: { totalMs: number };
  journalStats: { entryCount: number };
};
```

The **Journal** day view loads a `DaySummary` for the selected local date. Prefer showing sessions as the habit event when a session exists (avoid duplicating habit_log + session). Deleting a session removes it from the timeline and clears the habit log for that date if no other completed session remains.

### 5.5 Analytics

```ts
type HabitAnalytics = {
  habitId: HabitId;
  dayMinutes: { date: LocalDate; totalMs: number }[];
  totalMsAll: number;
  totalMsWeek: number;
  totalMsMonth: number;
  sessionCount: number;
  averageSessionMs: number;
  currentStreak: number;
};
```

- Contribution graph: **52 weeks**, columns **Monday → Sunday** (`startOfWeekMonday`).
- Streak uses habit logs (+ session dates) with the habit’s `StreakSettings`.
- Helpers live in `src/domain/analytics.ts` and `src/domain/dates.ts`.

## 6. Database design

### 6.1 Tables

```sql
habits (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  icon              TEXT NOT NULL DEFAULT 'sparkles',  -- Lucide id (v2 migration defaulted to emoji; schema uses sparkles)
  category          TEXT,
  schedule_json     TEXT NOT NULL,
  streak_json       TEXT NOT NULL DEFAULT '{"mode":"scheduled","graceDays":0}',
  timer_mode        TEXT NOT NULL DEFAULT 'stopwatch',
  pomodoro_minutes  INTEGER NOT NULL DEFAULT 25,
  color             TEXT,
  archived_at       TEXT,
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL
);

habit_logs (
  id            TEXT PRIMARY KEY,
  habit_id      TEXT NOT NULL REFERENCES habits(id),
  date          TEXT NOT NULL,
  status        TEXT NOT NULL,
  completed_at  TEXT,
  note          TEXT,
  UNIQUE(habit_id, date)
);

time_sessions (
  id                   TEXT PRIMARY KEY,
  label                TEXT NOT NULL,
  tag_id               TEXT,
  habit_id             TEXT REFERENCES habits(id),
  mode                 TEXT NOT NULL DEFAULT 'stopwatch',
  target_duration_ms   INTEGER,
  started_at           TEXT NOT NULL,
  ended_at             TEXT,
  notes                TEXT,
  paused_at            TEXT,              -- ISO while paused; null when running
  paused_total_ms      INTEGER NOT NULL DEFAULT 0
);

journal_entries (
  id            TEXT PRIMARY KEY,
  date          TEXT NOT NULL,
  title         TEXT,
  body          TEXT NOT NULL,
  mood          INTEGER,
  habit_id      TEXT REFERENCES habits(id),
  session_id    TEXT REFERENCES time_sessions(id),
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

tags (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  color         TEXT
);
```

| Version | Changes |
|---------|---------|
| v1 | Base tables: habits, habit_logs, tags, time_sessions, journal_entries |
| v2 | Habit icon/category/timer fields; session mode/target; journal habit/session FKs |
| v3 | `habits.streak_json` |
| v4 | `time_sessions.paused_at`, `time_sessions.paused_total_ms` |

### 6.2 Migrations

- All schema changes go through the ordered list in `src/db/migrate.ts`.
- On app launch, `DatabaseProvider` runs migrations before rendering main UI.
- Never edit an already-shipped migration; add a new one.

### 6.3 IDs and clocks

- IDs: UUID v4 via `expo-crypto` (`createId` in `src/db/utils.ts`).
- Timestamps: ISO-8601 UTC strings in the DB.
- Calendar dates: `YYYY-MM-DD` in the **device local timezone**.

## 7. Application layer (hooks + repositories)

Use cases are expressed as TanStack Query hooks (primarily `src/features/habits/hooks/useHabitsData.ts`) calling repository methods.

| Hook / path | Behavior |
|-------------|----------|
| `useCreateHabit` / `useUpdateHabit` | Habit CRUD incl. schedule, streak, reminder sync |
| `useArchiveHabit` / `useUnarchiveHabit` | Soft-archive + cancel/restore reminders |
| `useStartHabitSession` | Reject if another running; insert session; schedule phase notification |
| `usePauseSession` / `useResumeSession` | Toggle pause; resume reschedules phase-end notification |
| `useStopHabitSession` | Set endedAt (folding open pause); upsert HabitLog; cancel notification; journal prompt |
| `useAdvanceExpiredPomodoro` | Phase advance or complete (foreground tick + AppState resume); skips while paused |
| `useLogCompletedSession` | Journal backfill: insert finished session + habit log for a date |
| `useDeleteSession` | Remove completed session; clear habit log if no other session that day |
| `useCreateJournalEntry` / `useUpdateJournalEntry` | Insert/update entry; optional habitId/sessionId |
| `useDaySummary` | Compose events + stats for a date |
| `useHabitAnalytics` | 52-week heatmap + aggregates + streak |

Repositories: `createHabitsRepository`, `createTimeRepository`, `createJournalRepository`, `createDayRepository` in `src/db/repositories`.

**Invalidation rule:** after any write that affects a date, invalidate that day’s query, habits, running session, and analytics queries as needed (`queryKeys` in `src/shared/lib/query-keys.ts`).

## 8. Presentation & navigation

### Tab map (v1)

| Tab | Route | Purpose |
|-----|-------|---------|
| Habits | `(tabs)/index` | Habit list, add/edit, start tracking |
| Analytics | `(tabs)/analytics` | Per-habit 52-week contribution graph + time stats + streak |
| Journal | `(tabs)/journal` | Paper day timeline + date navigation + log habit backfill |

Detail / focus screens: `session/active` (full-screen modal), `journal/[id]`.

**Global session chrome:** When a session is running (including paused), a sticky bar above the tab bar shows habit + elapsed/remaining time (or Paused); tap opens `session/active`. After stop, `JournalPromptSheet` offers a reflection entry.

### Visual language

- Dark charcoal surfaces with champagne-silver accent (`src/shared/ui/tokens.ts`).
- Sans (DM Sans) for UI chrome; Literata for journal/paper surfaces.
- Active session uses atmosphere backgrounds (cool focus / warm break) and `SessionRing` progress.

### State split

| Kind of state | Where |
|---------------|-------|
| Persisted business data | SQLite |
| Last timer mode/config per habit | AsyncStorage (`session-prefs`) |
| Async read models | TanStack Query |
| Modal open, journal prompt after stop, analytics habit selection | Zustand (`ui-store`) or local `useState` |
| Running timer display tick | Query refetch interval + UI reading `startedAt` / `pausedAt` |

## 9. Cross-cutting concerns

### 9.1 App bootstrap

1. Load custom fonts (DM Sans, Literata, SpaceMono).
2. Mount React Query provider (`AppProviders`).
3. Open SQLite / Drizzle client (`DatabaseProvider`) and run migrations.
4. Mount `SessionLifecycleProvider` (notification permission warm-up + AppState resume).
5. Render Expo Router root layout (dark theme wired to design tokens).

### 9.2 Background & process death

- Running time sessions are DB rows with `ended_at IS NULL` (may have `paused_at` set).
- Elapsed / phase remaining time is **wall-clock derived** (`startedAt` / `phaseStartedAt` / pause fields), not an in-memory counter.
- JS intervals pause while backgrounded. On resume, `SessionLifecycleProvider` advances any expired pomodoro phases (catch-up loop) and may auto-complete — unless the session is paused.
- Starting a pomodoro phase schedules a local notification for that phase’s end; stop / pause / advance cancels and reschedules as needed.
- `src/shared/lib/notifications.ts` lazy-requires `expo-notifications`. On **Android Expo Go** the module is never loaded (SDK 53 throws on import); notifications no-op until a development build.
- On cold start, if a running session exists, Habits and the global bar show it as active (including paused).
- Do not rely on continuous background JS or `expo-background-task` for second-by-second timers.

### 9.3 Accessibility & i18n

- Use semantic labels on timer controls from day one.
- Keep user-facing strings centralized where practical.

## 10. Security & privacy

- Journal and personal logs are local-only in v1.
- Avoid logging entry bodies in analytics or crash reports.

## 11. Implementation phases

### Phase 0 — Foundation ✅

- Expo app with TypeScript + Expo Router
- Folder structure, design tokens
- SQLite client + initial schema/migrations
- Tab shells

### Phase 1 — Schema + domain ✅

- Habit icon/category/timer fields
- Session mode/target
- Journal habit/session FKs
- Repository implementations

### Phase 2 — Habits hub + session loop ✅

- List, create/edit, start/stop
- Per-session timer / pomodoro sheet
- Global active bar
- Post-session journal prompt

### Phase 3 — Journal day + calendar ✅ (core)

- DaySummary timeline, paper styling
- Manual entry, date navigation
- Entry detail route (`journal/[id]`)
- Session-linked notes nested into practice cards
- Log habit backfill + delete completed session from timeline

### Phase 4 — Analytics ✅

- Habit selector, contribution heatmap, time aggregates, streak
- 52-week Monday-start graph
- Per-habit streak settings (`streak_json` / migration v3)

### Phase 5 — Polish ✅

- Empty states, archive confirm + restore
- Background / resume timer behavior (AppState catch-up + phase-end local notifications)
- Pomodoro break automation (focus → short break → … → long break → complete)
- Pause / resume sessions (`paused_at` / `paused_total_ms` / migration v4)
- Habit reminder notifications (optional daily/weekly via schedule; Expo Go Android no-op)
- Last session prefs per habit (AsyncStorage)
- Haptics + session atmosphere / ring UI
- DM Sans + Literata typography
- Removed legacy Habits/Time tabs and Today/Time placeholder screens
- Habit form: name / category / icon, Advanced for reminder + streak

Deferred within polish:
- Export backup (optional)
- Automated tests for domain + repositories

### Phase 6 — Sync / accounts (optional)

- Only after core loops feel solid

## 12. Coding conventions

- Prefer named exports from feature `index.ts` barrels for public API only.
- Keep route files thin: import a screen component from `features/*/screens`.
- Colocate feature-specific components under that feature.
- Use `LocalDate` consistently; never pass `Date` across repository boundaries without converting.
- Avoid `any`; enable TypeScript strict mode.
- No business writes from raw `useEffect` in screens — go through mutations/hooks.
- Habit icons are Lucide ids from `HABIT_ICON_IDS`; render via `HabitIcon`.
- Duration and pause math belong in `src/domain/time-session.ts`, not in screens.

## 13. Decision log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cross-platform | Expo | Speed + shared RN ecosystem |
| Persistence | SQLite | Relational queries for days/streaks/history |
| Navigation | Expo Router | File-based routing, deep links |
| Tabs | Habits · Analytics · Journal | Habits-first; collapse Today + Time |
| Completion | Timer-first + journal backfill | Live sessions are primary; Log habit covers missed tracking |
| Timer settings | Per session + remembered prefs | Different sessions can vary; last choice reduces friction |
| Pause | DB `paused_at` + `paused_total_ms` | Survives process death; wall-clock safe |
| Icons | Lucide icon ids | Consistent cross-platform glyphs; curated allowlist |
| Typography | DM Sans + Literata | Instrument UI + paper journal voice |
| Session background | Wall clock + local notifications | Reliable duration without continuous background JS |
| Notifications in Expo Go (Android) | Lazy no-op | Package throws on import after SDK 53; use a dev build for alerts |
| Streak | Per-habit mode + grace | Scheduled vs calendar days; optional miss allowance |
| Analytics week | Monday start, 52 weeks | Aligns with common planning weeks; full-year heatmap |
| Sync | Deferred | Local-first product; sync is a product decision |
| Day as composition | Yes | Makes Cadence one product instead of three |
| Application layer | Query hooks + repos | Avoid a separate use-case folder until complexity demands it |
| Weekly schedule UX | Weekday picker in habit form | Daily when all days selected; weekly otherwise |
| Schema-only fields | tags / mood / color / skip | Kept for forward compatibility; no product surface yet |

---

*This document is the source of truth for Cadence’s engineering architecture. Product framing for design tools lives in `PRODUCT.md`. Update both when decisions change.*
