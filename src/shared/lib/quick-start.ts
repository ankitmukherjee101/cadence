import {
  encodePomodoroNotes,
  type TimerMode,
} from '@/src/domain';

import { getHabitSessionPref } from '@/src/shared/lib/session-prefs';

export type QuickStartChoice = {
  mode: TimerMode;
  targetDurationMs?: number;
  notes?: string;
};

/** Build a session start payload from the last saved timer preference for a habit. */
export async function buildStartChoiceFromPref(habitId: string): Promise<QuickStartChoice> {
  const pref = await getHabitSessionPref(habitId);
  if (pref.mode === 'stopwatch') {
    return { mode: 'stopwatch' };
  }
  const phaseStartedAt = new Date().toISOString();
  return {
    mode: 'pomodoro',
    targetDurationMs: pref.pomodoro.focusMinutes * 60_000,
    notes: encodePomodoroNotes({
      config: pref.pomodoro,
      phase: 'focus',
      round: 1,
      phaseStartedAt,
    }),
  };
}
