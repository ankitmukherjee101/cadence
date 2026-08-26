import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull().default('sparkles'),
  category: text('category'),
  scheduleJson: text('schedule_json').notNull(),
  streakJson: text('streak_json').notNull().default('{"mode":"scheduled","graceDays":0}'),
  timerMode: text('timer_mode').notNull().default('stopwatch'),
  pomodoroMinutes: integer('pomodoro_minutes').notNull().default(25),
  color: text('color'),
  archivedAt: text('archived_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const habitLogs = sqliteTable(
  'habit_logs',
  {
    id: text('id').primaryKey(),
    habitId: text('habit_id')
      .notNull()
      .references(() => habits.id),
    date: text('date').notNull(),
    status: text('status').notNull(),
    completedAt: text('completed_at'),
    note: text('note'),
  },
  (table) => [uniqueIndex('habit_logs_habit_date_uidx').on(table.habitId, table.date)],
);

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color'),
});

export const timeSessions = sqliteTable('time_sessions', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  tagId: text('tag_id').references(() => tags.id),
  habitId: text('habit_id').references(() => habits.id),
  mode: text('mode').notNull().default('stopwatch'),
  targetDurationMs: integer('target_duration_ms'),
  startedAt: text('started_at').notNull(),
  endedAt: text('ended_at'),
  notes: text('notes'),
  /** ISO timestamp while currently paused; null when running */
  pausedAt: text('paused_at'),
  /** Accumulated completed pause intervals (ms) */
  pausedTotalMs: integer('paused_total_ms').notNull().default(0),
});

export const journalEntries = sqliteTable('journal_entries', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  title: text('title'),
  body: text('body').notNull(),
  mood: integer('mood'),
  habitId: text('habit_id').references(() => habits.id),
  sessionId: text('session_id').references(() => timeSessions.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const schema = {
  habits,
  habitLogs,
  tags,
  timeSessions,
  journalEntries,
};
