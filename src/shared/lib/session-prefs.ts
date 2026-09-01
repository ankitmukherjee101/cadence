import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEFAULT_POMODORO_CONFIG,
  type PomodoroConfig,
  type TimerMode,
} from '@/src/domain';

const KEY_PREFIX = 'cadence.sessionPrefs.v1.';

export type HabitSessionPref = {
  mode: TimerMode;
  pomodoro: PomodoroConfig;
};

function keyFor(habitId: string): string {
  return `${KEY_PREFIX}${habitId}`;
}

export async function getHabitSessionPref(habitId: string): Promise<HabitSessionPref> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(habitId));
    if (!raw) {
      return { mode: 'stopwatch', pomodoro: { ...DEFAULT_POMODORO_CONFIG } };
    }
    const pref = JSON.parse(raw) as HabitSessionPref;
    return {
      mode: pref.mode === 'pomodoro' ? 'pomodoro' : 'stopwatch',
      pomodoro: { ...DEFAULT_POMODORO_CONFIG, ...pref.pomodoro },
    };
  } catch {
    return { mode: 'stopwatch', pomodoro: { ...DEFAULT_POMODORO_CONFIG } };
  }
}

export async function setHabitSessionPref(
  habitId: string,
  pref: HabitSessionPref,
): Promise<void> {
  await AsyncStorage.setItem(keyFor(habitId), JSON.stringify(pref));
}
