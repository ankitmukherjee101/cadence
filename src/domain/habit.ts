import type { LocalDate } from './dates';

export type HabitId = string;

export type HabitSchedule =
  | { kind: 'daily' }
  | { kind: 'weekly'; daysOfWeek: number[] }; // 0=Sun … 6=Sat

export type Habit = {
  id: HabitId;
  name: string;
  schedule: HabitSchedule;
  color?: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HabitLogStatus = 'completed' | 'skipped';

export type HabitLog = {
  id: string;
  habitId: HabitId;
  date: LocalDate;
  status: HabitLogStatus;
  completedAt: string | null;
  note?: string;
};
