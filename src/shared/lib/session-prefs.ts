import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEFAULT_POMODORO_CONFIG,
  type PomodoroConfig,
  type TimerMode,
} from '@/src/domain';

const KEY = 'cadence.sessionPrefs.v1';

export type HabitSessionPref = {
  mode: TimerMode;
  pomodoro: PomodoroConfig;
};

type PrefMap = Record<string, HabitSessionPref>;

async function readAll(): Promise<PrefMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PrefMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function getHabitSessionPref(habitId: string): Promise<HabitSessionPref> {
  const all = await readAll();
  const pref = all[habitId];
  if (!pref) {
    return { mode: 'stopwatch', pomodoro: { ...DEFAULT_POMODORO_CONFIG } };
  }
  return {
    mode: pref.mode === 'pomodoro' ? 'pomodoro' : 'stopwatch',
    pomodoro: { ...DEFAULT_POMODORO_CONFIG, ...pref.pomodoro },
  };
}

export async function setHabitSessionPref(
  habitId: string,
  pref: HabitSessionPref,
): Promise<void> {
  const all = await readAll();
  all[habitId] = pref;
  await AsyncStorage.setItem(KEY, JSON.stringify(all));
}
