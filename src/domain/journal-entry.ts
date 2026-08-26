import type { LocalDate } from './dates';
import type { HabitId } from './habit';

export type JournalEntry = {
  id: string;
  date: LocalDate;
  title?: string;
  body: string;
  mood?: number;
  habitId?: HabitId;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
};
