import type { JournalEntry, LocalDate } from '@/src/domain';

export type JournalRepository = {
  listForDate(date: LocalDate): Promise<JournalEntry[]>;
  getById(id: string): Promise<JournalEntry | null>;
  create(input: {
    date: LocalDate;
    body: string;
    title?: string;
    mood?: number;
  }): Promise<JournalEntry>;
  update(
    id: string,
    patch: Partial<Pick<JournalEntry, 'title' | 'body' | 'mood' | 'date'>>,
  ): Promise<JournalEntry>;
};
