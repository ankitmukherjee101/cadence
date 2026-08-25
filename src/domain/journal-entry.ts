import type { LocalDate } from './dates';

export type JournalEntry = {
  id: string;
  date: LocalDate;
  title?: string;
  body: string;
  mood?: number;
  createdAt: string;
  updatedAt: string;
};
