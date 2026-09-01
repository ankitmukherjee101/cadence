import { getDb, type CadenceDb } from './client';
import { habitLogs, habits, journalEntries, tags, timeSessions } from './schema';
import { nowIso } from './utils';

export type CadenceExport = {
  format: 'cadence-export';
  version: 1;
  exportedAt: string;
  data: {
    habits: (typeof habits.$inferSelect)[];
    habitLogs: (typeof habitLogs.$inferSelect)[];
    timeSessions: (typeof timeSessions.$inferSelect)[];
    journalEntries: (typeof journalEntries.$inferSelect)[];
    tags: (typeof tags.$inferSelect)[];
  };
};

export async function buildCadenceExport(db: CadenceDb = getDb()): Promise<CadenceExport> {
  const [habitRows, logRows, sessionRows, journalRows, tagRows] = await Promise.all([
    db.select().from(habits),
    db.select().from(habitLogs),
    db.select().from(timeSessions),
    db.select().from(journalEntries),
    db.select().from(tags),
  ]);

  return {
    format: 'cadence-export',
    version: 1,
    exportedAt: nowIso(),
    data: {
      habits: habitRows,
      habitLogs: logRows,
      timeSessions: sessionRows,
      journalEntries: journalRows,
      tags: tagRows,
    },
  };
}
