import type { Habit, HabitLog, LocalDate } from '@/src/domain';

export type HabitsRepository = {
  listActive(): Promise<Habit[]>;
  getById(id: string): Promise<Habit | null>;
  create(input: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt'>): Promise<Habit>;
  archive(id: string): Promise<void>;
  upsertLog(input: {
    habitId: string;
    date: LocalDate;
    status: HabitLog['status'];
    note?: string;
  }): Promise<HabitLog>;
  listLogsForDate(date: LocalDate): Promise<HabitLog[]>;
};
