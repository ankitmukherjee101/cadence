import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  scheduleJson: text('schedule_json').notNull(),
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
  startedAt: text('started_at').notNull(),
  endedAt: text('ended_at'),
  notes: text('notes'),
});

export const journalEntries = sqliteTable('journal_entries', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  title: text('title'),
  body: text('body').notNull(),
  mood: integer('mood'),
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
