# Cadence

Habit tracking, time tracking, and journaling — one local-first mobile app for iOS and Android.

## Stack

- **Expo** (React Native) + TypeScript
- **Expo Router** for navigation
- **SQLite** (`expo-sqlite`) + **Drizzle ORM** schema
- **TanStack Query** for async reads/mutations
- **Zustand** for ephemeral UI state only

Architecture details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Getting started

```bash
npm install
npm start
```

Then press `a` for Android, `i` for iOS (macOS), or scan the QR code with Expo Go.

## Project layout

```
app/                 # Expo Router routes (thin)
src/
  domain/            # Pure types + helpers
  db/                # SQLite client, schema, migrations, repos
  features/          # habits | time | journal | day
  shared/            # providers, UI tokens
  store/             # Zustand UI state
docs/
  ARCHITECTURE.md
```

## Current phase

**Phase 0 — Foundation**

- App boots with migrations
- Four tabs: Today, Habits, Time, Journal
- Domain model + Drizzle schema in place
- Repository interfaces stubbed (implementations next)

Next: Phase 1 — Habits CRUD and check-ins.
