import type { LocalDate } from './dates';
import type { HabitLog } from './habit';
import type { JournalEntry } from './journal-entry';
import type { TimeSession } from './time-session';

export type DayJournalSnippet = JournalEntry & {
  habitName?: string;
  habitIcon?: string;
};

export type DayEvent =
  | {
      type: 'habit_log';
      at: string;
      data: HabitLog & { habitName: string; habitIcon?: string };
    }
  | {
      type: 'time_session';
      at: string;
      data: TimeSession & {
        habitName?: string;
        habitIcon?: string;
        /** Session-linked reflection nested into this practice card */
        journal?: DayJournalSnippet;
      };
    }
  | {
      type: 'journal_entry';
      at: string;
      data: DayJournalSnippet;
    };

export type DaySummary = {
  date: LocalDate;
  events: DayEvent[];
  habitStats: { due: number; completed: number };
  timeStats: { totalMs: number };
  journalStats: { entryCount: number };
};

/**
 * Attach journal entries that reference a sessionId to that session.
 * Free writes (no sessionId) remain standalone timeline events.
 */
export function composeDayEvents(input: {
  sessions: DayEvent[];
  habitLogs: DayEvent[];
  journalEntries: Array<{
    at: string;
    data: DayJournalSnippet;
  }>;
}): DayEvent[] {
  const sessionIds = new Set(
    input.sessions
      .filter((e): e is Extract<DayEvent, { type: 'time_session' }> => e.type === 'time_session')
      .map((e) => e.data.id),
  );

  const nestedBySession = new Map<string, DayJournalSnippet>();
  const freeWrites: DayEvent[] = [];

  for (const entry of input.journalEntries) {
    const sessionId = entry.data.sessionId;
    if (sessionId && sessionIds.has(sessionId)) {
      // Prefer the first linked note if duplicates somehow exist
      if (!nestedBySession.has(sessionId)) {
        nestedBySession.set(sessionId, entry.data);
      }
      continue;
    }
    freeWrites.push({
      type: 'journal_entry',
      at: entry.at,
      data: entry.data,
    });
  }

  const sessions: DayEvent[] = input.sessions.map((event) => {
    if (event.type !== 'time_session') return event;
    const journal = nestedBySession.get(event.data.id);
    if (!journal) return event;
    return {
      ...event,
      data: { ...event.data, journal },
    };
  });

  const events = [...sessions, ...input.habitLogs, ...freeWrites];
  events.sort((a, b) => a.at.localeCompare(b.at));
  return events;
}
