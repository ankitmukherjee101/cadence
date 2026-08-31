import { and, asc, desc, eq, gte, isNull, lte, sql } from 'drizzle-orm';

import type {
  DayEvent,
  DaySummary,
  Habit,
  HabitAnalytics,
  HabitLog,
  HabitSchedule,
  JournalEntry,
  LocalDate,
  StreakSettings,
  TimeSession,
  TimerMode,
} from '@/src/domain';
import {
  addDays,
  composeDayEvents,
  computeCurrentStreak,
  DEFAULT_STREAK_SETTINGS,
  encodePomodoroNotes,
  normalizeStreakSettings,
  parseLocalDate,
  parsePomodoroNotes,
  sessionDurationMs,
  startOfWeekMonday,
  todayLocalDate,
  toLocalDate,
} from '@/src/domain';

import { getDb, type CadenceDb } from '../client';
import { habitLogs, habits, journalEntries, timeSessions } from '../schema';
import { createId, nowIso } from '../utils';

function parseSchedule(json: string): HabitSchedule {
  return JSON.parse(json) as HabitSchedule;
}

function parseStreak(json: string | null | undefined): StreakSettings {
  if (!json) return { ...DEFAULT_STREAK_SETTINGS };
  try {
    return normalizeStreakSettings(JSON.parse(json));
  } catch {
    return { ...DEFAULT_STREAK_SETTINGS };
  }
}

function parseTimerMode(value: string): TimerMode {
  return value === 'pomodoro' ? 'pomodoro' : 'stopwatch';
}

function mapHabit(row: typeof habits.$inferSelect): Habit {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    category: row.category ?? undefined,
    schedule: parseSchedule(row.scheduleJson),
    streak: parseStreak(row.streakJson),
    timerMode: parseTimerMode(row.timerMode),
    pomodoroMinutes: row.pomodoroMinutes,
    color: row.color ?? undefined,
    archivedAt: row.archivedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapLog(row: typeof habitLogs.$inferSelect): HabitLog {
  return {
    id: row.id,
    habitId: row.habitId,
    date: row.date,
    status: row.status as HabitLog['status'],
    completedAt: row.completedAt,
    note: row.note ?? undefined,
  };
}

function mapSession(row: typeof timeSessions.$inferSelect): TimeSession {
  return {
    id: row.id,
    label: row.label,
    tagId: row.tagId ?? undefined,
    habitId: row.habitId ?? undefined,
    mode: parseTimerMode(row.mode),
    targetDurationMs: row.targetDurationMs ?? undefined,
    startedAt: row.startedAt,
    endedAt: row.endedAt,
    notes: row.notes ?? undefined,
    pausedAt: row.pausedAt ?? null,
    pausedTotalMs: row.pausedTotalMs ?? 0,
  };
}

function mapJournal(row: typeof journalEntries.$inferSelect): JournalEntry {
  return {
    id: row.id,
    date: row.date,
    title: row.title ?? undefined,
    body: row.body,
    mood: row.mood ?? undefined,
    habitId: row.habitId ?? undefined,
    sessionId: row.sessionId ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export type CreateHabitInput = {
  name: string;
  icon: string;
  category?: string;
  schedule?: HabitSchedule;
  streak?: StreakSettings;
  timerMode?: TimerMode;
  pomodoroMinutes?: number;
  color?: string;
};

export type UpdateHabitInput = Partial<
  Pick<
    Habit,
    'name' | 'icon' | 'category' | 'schedule' | 'streak' | 'timerMode' | 'pomodoroMinutes' | 'color'
  >
>;

export function createHabitsRepository(db: CadenceDb = getDb()) {
  return {
    async listActive(): Promise<Habit[]> {
      const rows = await db
        .select()
        .from(habits)
        .where(isNull(habits.archivedAt))
        .orderBy(asc(habits.createdAt));
      return rows.map(mapHabit);
    },

    async getById(id: string): Promise<Habit | null> {
      const rows = await db.select().from(habits).where(eq(habits.id, id)).limit(1);
      return rows[0] ? mapHabit(rows[0]) : null;
    },

    async create(input: CreateHabitInput): Promise<Habit> {
      const now = nowIso();
      const id = createId();
      const streak = normalizeStreakSettings(input.streak ?? DEFAULT_STREAK_SETTINGS);
      const row = {
        id,
        name: input.name.trim(),
        icon: input.icon || 'sparkles',
        category: input.category?.trim() || null,
        scheduleJson: JSON.stringify(input.schedule ?? { kind: 'daily' as const }),
        streakJson: JSON.stringify(streak),
        timerMode: input.timerMode ?? 'stopwatch',
        pomodoroMinutes: input.pomodoroMinutes ?? 25,
        color: input.color ?? null,
        archivedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      await db.insert(habits).values(row);
      return mapHabit(row);
    },

    async update(id: string, patch: UpdateHabitInput): Promise<Habit> {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Habit not found');

      const streak = normalizeStreakSettings(patch.streak ?? existing.streak);
      const updated = {
        name: patch.name?.trim() ?? existing.name,
        icon: patch.icon ?? existing.icon,
        category: patch.category !== undefined ? patch.category?.trim() || null : existing.category ?? null,
        scheduleJson: JSON.stringify(patch.schedule ?? existing.schedule),
        streakJson: JSON.stringify(streak),
        timerMode: patch.timerMode ?? existing.timerMode,
        pomodoroMinutes: patch.pomodoroMinutes ?? existing.pomodoroMinutes,
        color: patch.color !== undefined ? patch.color ?? null : existing.color ?? null,
        updatedAt: nowIso(),
      };

      await db.update(habits).set(updated).where(eq(habits.id, id));
      const next = await this.getById(id);
      if (!next) throw new Error('Habit not found after update');
      return next;
    },

    async archive(id: string): Promise<void> {
      await db
        .update(habits)
        .set({ archivedAt: nowIso(), updatedAt: nowIso() })
        .where(eq(habits.id, id));
    },

    async unarchive(id: string): Promise<Habit> {
      await db
        .update(habits)
        .set({ archivedAt: null, updatedAt: nowIso() })
        .where(eq(habits.id, id));
      const next = await this.getById(id);
      if (!next) throw new Error('Habit not found');
      return next;
    },

    async listArchived(): Promise<Habit[]> {
      const rows = await db
        .select()
        .from(habits)
        .where(sql`${habits.archivedAt} IS NOT NULL`)
        .orderBy(desc(habits.archivedAt));
      return rows.map(mapHabit);
    },

    async upsertLog(input: {
      habitId: string;
      date: LocalDate;
      status: HabitLog['status'];
      note?: string;
    }): Promise<HabitLog> {
      const existing = await db
        .select()
        .from(habitLogs)
        .where(and(eq(habitLogs.habitId, input.habitId), eq(habitLogs.date, input.date)))
        .limit(1);

      const completedAt = input.status === 'completed' ? nowIso() : null;

      if (existing[0]) {
        await db
          .update(habitLogs)
          .set({
            status: input.status,
            completedAt,
            note: input.note ?? existing[0].note,
          })
          .where(eq(habitLogs.id, existing[0].id));
        return mapLog({
          ...existing[0],
          status: input.status,
          completedAt,
          note: input.note ?? existing[0].note,
        });
      }

      const row = {
        id: createId(),
        habitId: input.habitId,
        date: input.date,
        status: input.status,
        completedAt,
        note: input.note ?? null,
      };
      await db.insert(habitLogs).values(row);
      return mapLog(row);
    },

    async listLogsForDate(date: LocalDate): Promise<HabitLog[]> {
      const rows = await db.select().from(habitLogs).where(eq(habitLogs.date, date));
      return rows.map(mapLog);
    },

    async listCompletedDates(habitId: string, from: LocalDate, to: LocalDate): Promise<LocalDate[]> {
      const rows = await db
        .select({ date: habitLogs.date })
        .from(habitLogs)
        .where(
          and(
            eq(habitLogs.habitId, habitId),
            eq(habitLogs.status, 'completed'),
            gte(habitLogs.date, from),
            lte(habitLogs.date, to),
          ),
        );
      return rows.map((r) => r.date);
    },

    async deleteLog(habitId: string, date: LocalDate): Promise<void> {
      await db
        .delete(habitLogs)
        .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)));
    },
  };
}

export type HabitsRepository = ReturnType<typeof createHabitsRepository>;

export function createTimeRepository(db: CadenceDb = getDb()) {
  return {
    async getRunning(): Promise<TimeSession | null> {
      const rows = await db
        .select()
        .from(timeSessions)
        .where(isNull(timeSessions.endedAt))
        .orderBy(desc(timeSessions.startedAt))
        .limit(1);
      return rows[0] ? mapSession(rows[0]) : null;
    },

    async getById(id: string): Promise<TimeSession | null> {
      const rows = await db.select().from(timeSessions).where(eq(timeSessions.id, id)).limit(1);
      return rows[0] ? mapSession(rows[0]) : null;
    },

    async listRecent(limit = 50): Promise<TimeSession[]> {
      const rows = await db
        .select()
        .from(timeSessions)
        .orderBy(desc(timeSessions.startedAt))
        .limit(limit);
      return rows.map(mapSession);
    },

    async listForDate(date: LocalDate): Promise<TimeSession[]> {
      // Sessions store UTC ISO — map to local calendar date in JS
      const rows = await db.select().from(timeSessions).orderBy(asc(timeSessions.startedAt));
      return rows
        .map(mapSession)
        .filter((s) => toLocalDate(new Date(s.startedAt)) === date);
    },

    async start(input: {
      label: string;
      habitId: string;
      mode: TimerMode;
      targetDurationMs?: number;
      tagId?: string;
      notes?: string;
    }): Promise<TimeSession> {
      const running = await this.getRunning();
      if (running) {
        throw new Error('A session is already running');
      }

      const row = {
        id: createId(),
        label: input.label,
        tagId: input.tagId ?? null,
        habitId: input.habitId,
        mode: input.mode,
        targetDurationMs: input.targetDurationMs ?? null,
        startedAt: nowIso(),
        endedAt: null,
        notes: input.notes ?? null,
        pausedAt: null,
        pausedTotalMs: 0,
      };
      await db.insert(timeSessions).values(row);
      return mapSession(row);
    },

    async stop(id: string): Promise<TimeSession> {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Session not found');
      if (existing.endedAt) return existing;

      const endedAt = nowIso();
      let pausedTotalMs = existing.pausedTotalMs ?? 0;
      if (existing.pausedAt) {
        pausedTotalMs += Math.max(
          0,
          new Date(endedAt).getTime() - new Date(existing.pausedAt).getTime(),
        );
      }

      await db
        .update(timeSessions)
        .set({
          endedAt,
          pausedAt: null,
          pausedTotalMs,
        })
        .where(eq(timeSessions.id, id));
      return { ...existing, endedAt, pausedAt: null, pausedTotalMs };
    },

    async pause(id: string): Promise<TimeSession> {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Session not found');
      if (existing.endedAt) throw new Error('Session already ended');
      if (existing.pausedAt) return existing;

      const pausedAt = nowIso();
      await db.update(timeSessions).set({ pausedAt }).where(eq(timeSessions.id, id));
      return { ...existing, pausedAt };
    },

    async resume(id: string): Promise<TimeSession> {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Session not found');
      if (existing.endedAt) throw new Error('Session already ended');
      if (!existing.pausedAt) return existing;

      const now = Date.now();
      const delta = Math.max(0, now - new Date(existing.pausedAt).getTime());
      const pausedTotalMs = (existing.pausedTotalMs ?? 0) + delta;

      let notes = existing.notes ?? null;
      const pomodoro = existing.mode === 'pomodoro' ? parsePomodoroNotes(existing.notes, existing.startedAt) : null;
      if (pomodoro) {
        const shifted = new Date(new Date(pomodoro.phaseStartedAt).getTime() + delta).toISOString();
        notes = encodePomodoroNotes({ ...pomodoro, phaseStartedAt: shifted });
      }

      await db
        .update(timeSessions)
        .set({
          pausedAt: null,
          pausedTotalMs,
          notes,
        })
        .where(eq(timeSessions.id, id));

      return {
        ...existing,
        pausedAt: null,
        pausedTotalMs,
        notes: notes ?? undefined,
      };
    },

    /**
     * Insert a completed session on a local calendar date (backfill / journal log).
     * Anchors `endedAt` at `endedMinutes` past local midnight on `date` (default noon),
     * with `startedAt` = ended − duration.
     */
    async logCompleted(input: {
      label: string;
      habitId: string;
      durationMs: number;
      date: LocalDate;
      /** Minutes from local midnight when the session ended (0–1439). Defaults to noon. */
      endedMinutes?: number;
      notes?: string;
    }): Promise<TimeSession> {
      const durationMs = Math.max(60_000, Math.round(input.durationMs));
      const dayStart = parseLocalDate(input.date);
      const endedMins = Math.min(
        23 * 60 + 59,
        Math.max(0, Math.round(input.endedMinutes ?? 12 * 60)),
      );
      const hour = Math.floor(endedMins / 60);
      const minute = endedMins % 60;
      const endedLocal = new Date(
        dayStart.getFullYear(),
        dayStart.getMonth(),
        dayStart.getDate(),
        hour,
        minute,
        0,
        0,
      );
      const startedLocal = new Date(endedLocal.getTime() - durationMs);
      // If duration would spill into the previous calendar day, clamp start to local midnight
      if (toLocalDate(startedLocal) < input.date) {
        startedLocal.setTime(dayStart.getTime());
        endedLocal.setTime(startedLocal.getTime() + durationMs);
      }

      const row = {
        id: createId(),
        label: input.label,
        tagId: null,
        habitId: input.habitId,
        mode: 'stopwatch' as const,
        targetDurationMs: durationMs,
        startedAt: startedLocal.toISOString(),
        endedAt: endedLocal.toISOString(),
        notes: input.notes ?? null,
        pausedAt: null,
        pausedTotalMs: 0,
      };
      await db.insert(timeSessions).values(row);
      return mapSession(row);
    },

    async updateRunning(
      id: string,
      patch: { notes?: string; targetDurationMs?: number | null },
    ): Promise<TimeSession> {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Session not found');
      if (existing.endedAt) throw new Error('Session already ended');

      await db
        .update(timeSessions)
        .set({
          notes: patch.notes !== undefined ? patch.notes : existing.notes ?? null,
          targetDurationMs:
            patch.targetDurationMs !== undefined
              ? patch.targetDurationMs
              : (existing.targetDurationMs ?? null),
        })
        .where(eq(timeSessions.id, id));

      const next = await this.getById(id);
      if (!next) throw new Error('Session not found after update');
      return next;
    },

    /**
     * Delete a completed session. Linked journal notes are unlinked (kept as free writes).
     * Does not adjust habit logs — callers should remove the day log when no sessions remain.
     */
    async delete(id: string): Promise<TimeSession> {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Session not found');
      if (!existing.endedAt) throw new Error('Cannot delete a running session');

      await db
        .update(journalEntries)
        .set({ sessionId: null })
        .where(eq(journalEntries.sessionId, id));
      await db.delete(timeSessions).where(eq(timeSessions.id, id));
      return existing;
    },

    async hasCompletedSessionOnDate(habitId: string, date: LocalDate): Promise<boolean> {
      const rows = await db
        .select()
        .from(timeSessions)
        .where(and(eq(timeSessions.habitId, habitId), sql`${timeSessions.endedAt} IS NOT NULL`));
      return rows.some((row) => toLocalDate(new Date(mapSession(row).startedAt)) === date);
    },

    async getHabitDayMinutes(
      habitId: string,
      from: LocalDate,
      to: LocalDate,
    ): Promise<{ date: LocalDate; totalMs: number }[]> {
      const rows = await db
        .select()
        .from(timeSessions)
        .where(and(eq(timeSessions.habitId, habitId), sql`${timeSessions.endedAt} IS NOT NULL`));

      const byDate = new Map<LocalDate, number>();
      for (const row of rows) {
        const session = mapSession(row);
        if (!session.endedAt) continue;
        const date = toLocalDate(new Date(session.startedAt));
        if (date < from || date > to) continue;
        byDate.set(date, (byDate.get(date) ?? 0) + sessionDurationMs(session));
      }

      return [...byDate.entries()]
        .map(([date, totalMs]) => ({ date, totalMs }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },

    async getHabitAnalytics(habitId: string): Promise<HabitAnalytics> {
      const today = todayLocalDate();
      const weekStart = addDays(today, -6);
      const monthStart = addDays(today, -29);
      // 52 Monday-start weeks through the current week
      const rangeStart = addDays(startOfWeekMonday(today), -51 * 7);

      const habitRows = await db.select().from(habits).where(eq(habits.id, habitId)).limit(1);
      const habit = habitRows[0] ? mapHabit(habitRows[0]) : null;

      const rows = await db
        .select()
        .from(timeSessions)
        .where(and(eq(timeSessions.habitId, habitId), sql`${timeSessions.endedAt} IS NOT NULL`));

      const sessions = rows.map(mapSession).filter((s) => s.endedAt);
      const dayMinutes = await this.getHabitDayMinutes(habitId, rangeStart, today);

      let totalMsAll = 0;
      let totalMsToday = 0;
      let totalMsWeek = 0;
      let totalMsMonth = 0;
      const completedDates = new Set<LocalDate>();

      for (const session of sessions) {
        const ms = sessionDurationMs(session);
        const date = toLocalDate(new Date(session.startedAt));
        totalMsAll += ms;
        if (date === today) totalMsToday += ms;
        if (date >= weekStart) totalMsWeek += ms;
        if (date >= monthStart) totalMsMonth += ms;
        completedDates.add(date);
      }

      // Prefer habit_logs for streak so manual/skip status stays consistent
      const logRows = await db
        .select({ date: habitLogs.date })
        .from(habitLogs)
        .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.status, 'completed')));
      for (const row of logRows) completedDates.add(row.date);

      const sessionCount = sessions.length;
      const averageSessionMs = sessionCount > 0 ? Math.round(totalMsAll / sessionCount) : 0;

      return {
        habitId,
        dayMinutes,
        totalMsToday,
        totalMsAll,
        totalMsWeek,
        totalMsMonth,
        sessionCount,
        averageSessionMs,
        currentStreak: computeCurrentStreak(completedDates, today, {
          streak: habit?.streak,
          schedule: habit?.schedule,
        }),
      };
    },
  };
}

export type TimeRepository = ReturnType<typeof createTimeRepository>;

export function createJournalRepository(db: CadenceDb = getDb()) {
  return {
    async listForDate(date: LocalDate): Promise<JournalEntry[]> {
      const rows = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.date, date))
        .orderBy(asc(journalEntries.createdAt));
      return rows.map(mapJournal);
    },

    async getById(id: string): Promise<JournalEntry | null> {
      const rows = await db.select().from(journalEntries).where(eq(journalEntries.id, id)).limit(1);
      return rows[0] ? mapJournal(rows[0]) : null;
    },

    async create(input: {
      date: LocalDate;
      body: string;
      title?: string;
      mood?: number;
      habitId?: string;
      sessionId?: string;
    }): Promise<JournalEntry> {
      const now = nowIso();
      const row = {
        id: createId(),
        date: input.date,
        title: input.title ?? null,
        body: input.body,
        mood: input.mood ?? null,
        habitId: input.habitId ?? null,
        sessionId: input.sessionId ?? null,
        createdAt: now,
        updatedAt: now,
      };
      await db.insert(journalEntries).values(row);
      return mapJournal(row);
    },

    async update(
      id: string,
      patch: Partial<Pick<JournalEntry, 'title' | 'body' | 'mood' | 'date'>>,
    ): Promise<JournalEntry> {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Journal entry not found');

      const next = {
        title: patch.title !== undefined ? patch.title ?? null : existing.title ?? null,
        body: patch.body ?? existing.body,
        mood: patch.mood !== undefined ? patch.mood ?? null : existing.mood ?? null,
        date: patch.date ?? existing.date,
        updatedAt: nowIso(),
      };
      await db.update(journalEntries).set(next).where(eq(journalEntries.id, id));
      const updated = await this.getById(id);
      if (!updated) throw new Error('Journal entry not found after update');
      return updated;
    },
  };
}

export type JournalRepository = ReturnType<typeof createJournalRepository>;

export function createDayRepository(
  db: CadenceDb = getDb(),
  habitsRepo = createHabitsRepository(db),
  timeRepo = createTimeRepository(db),
  journalRepo = createJournalRepository(db),
) {
  return {
    async getSummary(date: LocalDate): Promise<DaySummary> {
      const [activeHabits, logs, sessions, entries] = await Promise.all([
        habitsRepo.listActive(),
        habitsRepo.listLogsForDate(date),
        timeRepo.listForDate(date),
        journalRepo.listForDate(date),
      ]);

      const habitById = new Map(activeHabits.map((h) => [h.id, h]));
      for (const log of logs) {
        if (!habitById.has(log.habitId)) {
          const h = await habitsRepo.getById(log.habitId);
          if (h) habitById.set(h.id, h);
        }
      }
      for (const session of sessions) {
        if (session.habitId && !habitById.has(session.habitId)) {
          const h = await habitsRepo.getById(session.habitId);
          if (h) habitById.set(h.id, h);
        }
      }
      for (const entry of entries) {
        if (entry.habitId && !habitById.has(entry.habitId)) {
          const h = await habitsRepo.getById(entry.habitId);
          if (h) habitById.set(h.id, h);
        }
      }

      const sessionHabitIds = new Set(
        sessions.filter((s) => s.habitId && s.endedAt).map((s) => s.habitId as string),
      );

      const sessionEvents: DayEvent[] = sessions.map((session) => {
        const habit = session.habitId ? habitById.get(session.habitId) : undefined;
        return {
          type: 'time_session' as const,
          at: session.endedAt ?? session.startedAt,
          data: {
            ...session,
            habitName: habit?.name,
            habitIcon: habit?.icon,
          },
        };
      });

      const habitLogEvents: DayEvent[] = [];
      for (const log of logs) {
        if (log.status === 'completed' && sessionHabitIds.has(log.habitId)) continue;
        const habit = habitById.get(log.habitId);
        habitLogEvents.push({
          type: 'habit_log',
          at: log.completedAt ?? `${date}T12:00:00.000Z`,
          data: {
            ...log,
            habitName: habit?.name ?? 'Habit',
            habitIcon: habit?.icon,
          },
        });
      }

      const journalEntriesForCompose = entries.map((entry) => {
        const habit = entry.habitId ? habitById.get(entry.habitId) : undefined;
        return {
          at: entry.createdAt,
          data: {
            ...entry,
            habitName: habit?.name,
            habitIcon: habit?.icon,
          },
        };
      });

      const events = composeDayEvents({
        sessions: sessionEvents,
        habitLogs: habitLogEvents,
        journalEntries: journalEntriesForCompose,
      });

      const completed = logs.filter((l) => l.status === 'completed').length;
      const totalMs = sessions
        .filter((s) => s.endedAt)
        .reduce((sum, s) => sum + sessionDurationMs(s), 0);

      return {
        date,
        events,
        habitStats: { due: activeHabits.length, completed },
        timeStats: { totalMs },
        journalStats: { entryCount: entries.length },
      };
    },
  };
}

export type DayRepository = ReturnType<typeof createDayRepository>;
