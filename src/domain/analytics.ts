import { addDays, parseLocalDate, type LocalDate } from './dates';
import type { HabitId, HabitSchedule, StreakSettings } from './habit';

export type HabitDayMinutes = {
  date: LocalDate;
  totalMs: number;
};

export type HabitAnalytics = {
  habitId: HabitId;
  dayMinutes: HabitDayMinutes[];
  totalMsToday: number;
  totalMsAll: number;
  totalMsWeek: number;
  totalMsMonth: number;
  sessionCount: number;
  averageSessionMs: number;
  currentStreak: number;
};

/** Whether a habit counts as due on a calendar day given streak mode and schedule. */
export function isHabitRequiredOnDate(
  date: LocalDate,
  options?: {
    streak?: StreakSettings;
    schedule?: HabitSchedule;
  },
): boolean {
  const mode = options?.streak?.mode ?? 'scheduled';
  const schedule = options?.schedule;
  if (mode === 'calendar') return true;
  if (!schedule || schedule.kind === 'daily') return true;
  const dow = parseLocalDate(date).getDay(); // 0=Sun
  return schedule.daysOfWeek.includes(dow);
}

function isRequiredDay(
  date: LocalDate,
  mode: StreakSettings['mode'],
  schedule?: HabitSchedule,
): boolean {
  return isHabitRequiredOnDate(date, { streak: { mode, graceDays: 0 }, schedule });
}

/**
 * Count consecutive completed days ending at `endDate`.
 * If today is still open (required but not completed), counting starts from yesterday.
 */
export function computeCurrentStreak(
  completedDates: Iterable<LocalDate>,
  endDate: LocalDate,
  options?: {
    streak?: StreakSettings;
    schedule?: HabitSchedule;
  },
): number {
  const set = new Set(completedDates);
  const mode = options?.streak?.mode ?? 'scheduled';
  let graceLeft = options?.streak?.graceDays ?? 0;
  const schedule = options?.schedule;

  let cursor = endDate;
  if (isRequiredDay(cursor, mode, schedule) && !set.has(cursor)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  for (let i = 0; i < 4000; i++) {
    if (!isRequiredDay(cursor, mode, schedule)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    if (set.has(cursor)) {
      streak += 1;
      cursor = addDays(cursor, -1);
      continue;
    }
    if (graceLeft > 0) {
      graceLeft -= 1;
      cursor = addDays(cursor, -1);
      continue;
    }
    break;
  }

  return streak;
}
