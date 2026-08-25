import type { LocalDate } from './dates';
import type { HabitLog } from './habit';
import type { JournalEntry } from './journal-entry';
import type { TimeSession } from './time-session';

export type DayEvent =
  | {
      type: 'habit_log';
      at: string;
      data: HabitLog & { habitName: string };
    }
  | {
      type: 'time_session';
      at: string;
      data: TimeSession;
    }
  | {
      type: 'journal_entry';
      at: string;
      data: JournalEntry;
    };

export type DaySummary = {
  date: LocalDate;
  events: DayEvent[];
  habitStats: { due: number; completed: number };
  timeStats: { totalMs: number };
  journalStats: { entryCount: number };
};
