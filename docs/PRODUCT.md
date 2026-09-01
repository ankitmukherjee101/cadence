# Cadence — product brief

Use this as design / Stitch context. It describes **what the app is**, not how it is built.

## One-liner

**Cadence** is a calm, local-first mobile app for building habits through timed practice, seeing patterns over time, and journaling the day — one product, three lenses on the same data.

## Product idea

Cadence is **not** three separate tools. Habits, time, and journal share one day narrative:

| Lens | Job | Feels like |
|------|-----|------------|
| **Habits** | Start practice and stay consistent | Action hub — pick a habit, start a timer |
| **Analytics** | See patterns | Quiet heatmap + time stats for one habit |
| **Journal** | Reflect on what happened | Paper day timeline of sessions and free writes |

The unifying unit is the **Day**: timed sessions and journal entries on a local calendar date.

## Who it’s for

Someone who wants a private, focused practice loop — deep work, movement, reading, meditation — without accounts, social feeds, or productivity clutter.

## Core loop

1. Open **Habits**. Tap a habit to **quick-start** with your last timer choice (or tap the timer icon to customize).
2. Choose **stopwatch** or **pomodoro** when customizing (last choice remembered per habit).
3. Practice. A sticky bar shows the live session; tap for the full-screen timer (pause / resume / stop). Screen stays awake.
4. Stop → habit counts as complete for today → optional short journal reflection.
5. **Journal** shows today’s timeline and day stats. Missed tracking? **Log habit** to backfill duration without running the timer.
6. **Analytics** shows a year of practice for a selected habit (52-week heatmap, totals, streak).
7. **Export backup** from the Habits share icon when you want a JSON copy of all data.

## Screens to design around

| Screen | Purpose |
|--------|---------|
| Habits (tab) | Habit list, empty state, add/edit habit, start-session sheet |
| Analytics (tab) | Habit picker, contribution heatmap, time aggregates, streak |
| Journal (tab) | Date nav, paper day timeline, log-habit sheet |
| Active session (modal) | Full-screen timer; cool focus / warm break atmosphere |
| Journal entry (stack) | Read/edit a single entry |
| Global chrome | Sticky active-session bar above tabs; post-stop journal prompt sheet |

**Not in the product (v1):** Today tab, separate Time tab, accounts, sync, social, widgets, import restore.

## Visual direction

Treat Cadence like a **calm instrument**, not neon SaaS.

- **Mood:** Dark, quiet, intentional. Low visual noise.
- **Background:** Near-black charcoal (`#121212`), elevated surfaces slightly lighter.
- **Accent:** Champagne silver (`#C2B9AD`) — primary actions and live session emphasis.
- **Text:** Warm off-white (`#D6D2CC`); muted secondary (`#7A7670`).
- **Typography:** Instrument Sans for UI chrome; Geist for journal entries and data labels.
- **Icons:** Simple Lucide line icons on habits (not emoji-as-brand).
- **Journal:** Paper-like reading surface; timeline of the day, not a chat feed.
- **Session:** Full-bleed atmosphere — cooler for focus, warmer for breaks; circular progress ring; avoid dashboard chrome.

### Avoid

- Purple/indigo gradient “AI app” looks
- Bright neon accents, heavy glow, glassmorphism stacks
- Card grids, stat strip overload, pill clusters in the first viewport
- Light-mode productivity templates as the default
- Crowding Habits with analytics widgets

## Tone of copy

Short, grounded, human. Prefer “Start practice” / “Log habit” / “What happened today?” over gamified jargon. No streak shame language.

## Habits (what users configure)

- Name, optional category, Lucide icon
- Weekday schedule (daily when all days selected) and optional reminder (local notification)
- Streak mode: every calendar day vs scheduled days; optional grace days
- **Skip today** from the habit menu when a due day won’t happen — honest miss, not a fake session
- Timer mode is **not** a fixed habit setting — chosen when customizing a session; quick-start uses last choice

## Privacy stance (product)

Everything stays on the device. No account wall. Journal content is private by default. Design should feel personal and offline-capable, not cloud-first.

## Design constraints for Stitch

- Mobile-first (iOS / Android phone).
- Three primary tabs only: Habits · Analytics · Journal.
- Dark theme as the default visual system.
- One primary action per screen; keep secondary actions in sheets / Advanced.
- Active session should feel immersive and full-screen, not a small inset card.
- Journal day should read as a chronological story, not a dashboard.
