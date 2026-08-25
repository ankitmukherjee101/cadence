import type { DaySummary, LocalDate } from '@/src/domain';

export type DayRepository = {
  getSummary(date: LocalDate): Promise<DaySummary>;
};
