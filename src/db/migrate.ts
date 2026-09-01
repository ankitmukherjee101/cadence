import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Phase 0 migrations run as ordered SQL statements.
 * Never edit a shipped migration — append a new version instead.
 */
const MIGRATIONS: { version: number; statements: string[] }[] = [
  {
    version: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        schedule_json TEXT NOT NULL,
        color TEXT,
        archived_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS habit_logs (
        id TEXT PRIMARY KEY NOT NULL,
        habit_id TEXT NOT NULL REFERENCES habits(id),
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        completed_at TEXT,
        note TEXT
      );`,
      `CREATE UNIQUE INDEX IF NOT EXISTS habit_logs_habit_date_uidx
        ON habit_logs(habit_id, date);`,
      `CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);`,
      `CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE,
        color TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS time_sessions (
        id TEXT PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        tag_id TEXT REFERENCES tags(id),
        habit_id TEXT REFERENCES habits(id),
        started_at TEXT NOT NULL,
        ended_at TEXT,
        notes TEXT
      );`,
      `CREATE INDEX IF NOT EXISTS idx_time_sessions_started ON time_sessions(started_at);`,
      `CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        title TEXT,
        body TEXT NOT NULL,
        mood INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );`,
      `CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(date);`,
    ],
  },
  {
    version: 2,
    statements: [
      `ALTER TABLE habits ADD COLUMN icon TEXT NOT NULL DEFAULT '✨';`,
      `ALTER TABLE habits ADD COLUMN category TEXT;`,
      `ALTER TABLE habits ADD COLUMN timer_mode TEXT NOT NULL DEFAULT 'stopwatch';`,
      `ALTER TABLE habits ADD COLUMN pomodoro_minutes INTEGER NOT NULL DEFAULT 25;`,
      `ALTER TABLE time_sessions ADD COLUMN mode TEXT NOT NULL DEFAULT 'stopwatch';`,
      `ALTER TABLE time_sessions ADD COLUMN target_duration_ms INTEGER;`,
      `ALTER TABLE journal_entries ADD COLUMN habit_id TEXT REFERENCES habits(id);`,
      `ALTER TABLE journal_entries ADD COLUMN session_id TEXT REFERENCES time_sessions(id);`,
    ],
  },
  {
    version: 3,
    statements: [
      `ALTER TABLE habits ADD COLUMN streak_json TEXT NOT NULL DEFAULT '{"mode":"scheduled","graceDays":0}';`,
    ],
  },
  {
    version: 4,
    statements: [
      `ALTER TABLE time_sessions ADD COLUMN paused_at TEXT;`,
      `ALTER TABLE time_sessions ADD COLUMN paused_total_ms INTEGER NOT NULL DEFAULT 0;`,
    ],
  },
  {
    version: 5,
    statements: [
      `CREATE UNIQUE INDEX IF NOT EXISTS time_sessions_single_running_uidx
        ON time_sessions((1)) WHERE ended_at IS NULL;`,
    ],
  },
];

async function getUserVersion(sqlite: SQLiteDatabase): Promise<number> {
  const row = await sqlite.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  return row?.user_version ?? 0;
}

async function setUserVersion(sqlite: SQLiteDatabase, version: number): Promise<void> {
  await sqlite.execAsync(`PRAGMA user_version = ${version}`);
}

/** Keep the most recent open session; auto-stop orphaned duplicates. */
async function reconcileDuplicateRunningSessions(sqlite: SQLiteDatabase): Promise<void> {
  const rows = await sqlite.getAllAsync<{ id: string }>(
    'SELECT id FROM time_sessions WHERE ended_at IS NULL ORDER BY started_at DESC',
  );
  if (rows.length <= 1) return;

  const now = new Date().toISOString();
  for (const { id } of rows.slice(1)) {
    await sqlite.runAsync(
      'UPDATE time_sessions SET ended_at = ?, paused_at = NULL WHERE id = ?',
      now,
      id,
    );
  }
}

export async function migrate(sqlite: SQLiteDatabase): Promise<void> {
  const current = await getUserVersion(sqlite);

  for (const migration of MIGRATIONS) {
    if (migration.version <= current) continue;

    if (migration.version === 5) {
      await reconcileDuplicateRunningSessions(sqlite);
    }

    await sqlite.execAsync('BEGIN');
    try {
      for (const statement of migration.statements) {
        await sqlite.execAsync(statement);
      }
      await setUserVersion(sqlite, migration.version);
      await sqlite.execAsync('COMMIT');
    } catch (error) {
      await sqlite.execAsync('ROLLBACK');
      throw error;
    }
  }
}
