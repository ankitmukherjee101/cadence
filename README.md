# Cadence

**Cadence** is a local-first habit, time, and journaling app for iOS and Android. One app, three lenses on the same day: practice habits with a timer, see patterns over time, and write what happened.

Data stays on your device in SQLite. There is no account, no cloud sync, and no remote analytics in v1.

## Features

### Habits
- Create habits with Lucide icons, categories, optional daily reminders, and streak settings (calendar vs scheduled days, optional grace days). Weekly schedules are supported in the domain/data model; create UI is daily-only today.
- Start a **stopwatch** or **pomodoro** session from the habit list; mode and lengths are chosen per session (last choice remembered per habit).
- Ending a session marks the habit complete for that local date.
- Archive / restore habits without losing history.

### Sessions
- One running session at a time, with a sticky bar above the tab bar.
- Full-screen active session UI with pause/resume, pomodoro phase automation (focus → short break → … → long break → complete), and phase-end local notifications.
- Sessions survive app kills: state lives in SQLite and time is wall-clock derived.
- After stop, an optional journal prompt for a short reflection.

### Journal
- Day timeline merging practice sessions and free writes (paper-styled UI).
- Manual entries, date navigation, and entry detail editing.
- Session-linked reflections nest into that day’s practice card.
- **Log habit** backfill: record a finished session (habit + duration) for a past or current date without running the live timer.
- Delete a completed session from the timeline (clears the day’s habit log if nothing else remains).

### Analytics
- Per-habit 52-week contribution heatmap (weeks start Monday).
- Total / week / month time, session count, average length, and current streak.

## Stack

| Layer | Choice |
|-------|--------|
| App | Expo ~57, React Native, TypeScript (strict) |
| Navigation | Expo Router (file-based) |
| Database | `expo-sqlite` + Drizzle ORM |
| Async data | TanStack Query |
| UI state | Zustand (sheets / prompts only) |
| Session prefs | AsyncStorage (last timer mode per habit) |
| Icons | Lucide |
| Fonts | DM Sans + Literata |
| Motion / haptics | Reanimated, `expo-haptics` |
| Notifications | `expo-notifications` (local; see notes below) |

Full engineering detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Product brief for design tools: [docs/PRODUCT.md](docs/PRODUCT.md).

## Requirements

- Node.js 20+ recommended
- npm (lockfile is committed)
- [Expo Go](https://expo.dev/go) for quick device testing, **or** a development build for full notification support on Android

## Getting started

```bash
npm install
npm start
```

Then:

- press `a` for Android emulator / device
- press `i` for iOS simulator (macOS)
- scan the QR code with Expo Go on a physical device

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start and open Android |
| `npm run ios` | Start and open iOS |
| `npm run web` | Start web (limited; mobile-first app) |
| `npm run typecheck` | `tsc --noEmit` |

## Project layout

```
cadence/
├── app/                      # Expo Router routes (thin wrappers)
│   ├── (tabs)/               # Habits · Analytics · Journal
│   ├── session/active.tsx    # Full-screen timer
│   └── journal/[id].tsx      # Entry detail
├── src/
│   ├── domain/               # Pure types + helpers (no React/SQLite)
│   ├── db/                   # Client, schema, migrations, repositories
│   ├── features/
│   │   ├── habits/           # List, form, start sheet, data hooks
│   │   ├── time/             # Active session screen
│   │   ├── journal/          # Day timeline, log-habit sheet
│   │   └── analytics/        # Heatmap + stats
│   ├── shared/
│   │   ├── providers/        # Query, database, session lifecycle
│   │   ├── ui/               # Design tokens, shared components
│   │   └── lib/              # Query keys, notifications, haptics, prefs
│   └── store/                # Zustand ephemeral UI state
├── docs/
│   ├── ARCHITECTURE.md
│   └── PRODUCT.md
├── assets/
└── package.json
```

**Dependency rule:** UI → hooks → repositories → SQLite. Domain code stays pure.

## How the core loop works

1. **Habits** tab lists active habits. Tap one → choose stopwatch or pomodoro → session starts.
2. While running, the global bar (and Active Session screen) show elapsed or phase remaining. Pause freezes the clock; resume continues without losing remaining pomodoro time.
3. Stop (or finish the pomodoro cycle) → habit marked complete for that local date → optional journal reflection.
4. **Journal** shows the day’s timeline. You can also **Log habit** to backfill time you already practiced.
5. **Analytics** shows the long view for a selected habit.

Calendar dates are always **device-local** `YYYY-MM-DD`. Timestamps in SQLite are ISO-8601 UTC.

## Local data & privacy

- Source of truth: on-device SQLite (`expo-sqlite`).
- Schema migrations run on launch (`src/db/migrate.ts`). Never edit a shipped migration; append a new version.
- Journal bodies and habit history stay on device. No sync or cloud accounts in v1.
- Avoid putting journal text into logs or crash reports.

## Notifications (dev notes)

Local notifications are used for:

- Pomodoro phase end
- Optional habit reminders (`reminderMinutes` on the schedule)

On **Android Expo Go** (SDK 53+), `expo-notifications` is not loaded (import throws); Cadence no-ops notifications there. Use a **development build** if you need to verify alerts on Android. iOS Expo Go and custom builds behave normally.

## Design

Cadence uses a dark charcoal UI with a champagne-silver accent — closer to a calm instrument than neon SaaS. Tokens live in `src/shared/ui/tokens.ts`. Journal surfaces lean on Literata; chrome uses DM Sans.

## Current status

Phases 0–5 (foundation through polish) are implemented for the core product loop:

- Habits hub + live sessions (stopwatch / pomodoro, pause, notifications)
- Journal day timeline + backfill + reflections
- Analytics heatmap and streaks
- Archive, empty states, session prefs, haptics

Still deferred: cloud sync / accounts, export backup, automated tests, home-screen widgets.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the decision log, schema, and coding conventions.

## Contributing locally

1. Prefer thin route files under `app/` that import screens from `src/features/*/screens`.
2. Put business writes behind TanStack mutations in `useHabitsData` (or feature hooks) — not raw `useEffect` SQL.
3. Keep duration / pause / streak math in `src/domain`.
4. After schema changes, add a new migration version and update the architecture doc.
5. Run `npm run typecheck` before opening a PR.

## License

Private project (`"private": true` in `package.json`). Not published as an open-source package.
