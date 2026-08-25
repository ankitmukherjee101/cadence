import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

import { schema } from './schema';

const DATABASE_NAME = 'cadence.db';

export type CadenceDb = ExpoSQLiteDatabase<typeof schema>;

let sqlite: SQLiteDatabase | null = null;
let db: CadenceDb | null = null;

export function getSqlite(): SQLiteDatabase {
  if (!sqlite) {
    sqlite = openDatabaseSync(DATABASE_NAME);
  }
  return sqlite;
}

export function getDb(): CadenceDb {
  if (!db) {
    db = drizzle(getSqlite(), { schema });
  }
  return db;
}
