import type { LocalDate } from './dates';

export type HabitId = string;

/**
 * `reminderMinutes` is minutes from local midnight (0–1439).
 * Omit / null = no daily reminder notification.
 */
export type HabitSchedule =
  | { kind: 'daily'; reminderMinutes?: number | null }
  | { kind: 'weekly'; daysOfWeek: number[]; reminderMinutes?: number | null }; // 0=Sun … 6=Sat

export type TimerMode = 'stopwatch' | 'pomodoro';

/** Per-session pomodoro settings (chosen when starting, not stored on the habit). */
export type PomodoroConfig = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  /** Focus rounds before a long break. */
  rounds: number;
};

export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  rounds: 4,
};

/** Lucide icon ids stored on habits (see HabitIcon). */
export const HABIT_ICON_IDS = [
  'sparkles',
  'book-open',
  'dumbbell',
  'wind',
  'pen-line',
  'droplets',
  'music',
  'salad',
  'moon',
  'target',
  'brain',
  'focus',
  'coffee',
  'bike',
  'footprints',
  'heart-pulse',
  'stretch-horizontal',
  'flame',
  'sun',
  'sunrise',
  'languages',
  'terminal',
  'palette',
  'camera',
  'headphones',
  'mic',
  'gamepad-2',
  'puzzle',
  'leaf',
  'trees',
  'mountain',
  'droplet',
  'pill',
  'apple',
  'utensils',
  'bath',
  'bed-double',
  'alarm-clock',
  'calendar-check',
  'clipboard-list',
  'mail',
  'phone',
  'users',
  'hand-heart',
  'dog',
  'cat',
  'wallet',
  'piggy-bank',
  'briefcase',
  'graduation-cap',
  'activity',
  'air-vent',
  'anchor',
  'baby',
  'backpack',
  'banana',
  'beer',
  'bell',
  'bird',
  'bone',
  'book-marked',
  'bookmark',
  'bot',
  'brush',
  'building-2',
  'bus',
  'cake',
  'car',
  'carrot',
  'check-check',
  'cherry',
  'cigarette-off',
  'citrus',
  'clapperboard',
  'clock',
  'cloud-sun',
  'code',
  'compass',
  'cooking-pot',
  'croissant',
  'cup-soda',
  'dice-5',
  'drama',
  'drum',
  'ear',
  'egg',
  'eye',
  'face-slightly-smiling',
  'feather',
  'ferris-wheel',
  'film',
  'fish',
  'flower-2',
  'gift',
  'glasses',
  'globe',
  'guitar',
  'hammer',
  'handshake',
  'heart',
  'heart-handshake',
  'house',
  'hourglass',
  'ice-cream-cone',
  'keyboard',
  'laptop',
  'library',
  'lightbulb',
  'list-checks',
  'map',
  'medal',
  'message-circle',
  'milk',
  'monitor',
  'newspaper',
  'notebook-pen',
  'paintbrush',
  'person-standing',
  'plane',
  'pizza',
  'radio',
  'repeat',
  'rocket',
  'scale',
  'scissors',
  'shell',
  'shirt',
  'shopping-bag',
  'shower-head',
  'snowflake',
  'soap-dispenser-droplet',
  'soup',
  'sprout',
  'star',
  'stethoscope',
  'sticky-note',
  'sword',
  'syringe',
  'tent',
  'thermometer',
  'timer',
  'train-front',
  'tree-pine',
  'trophy',
  'tv',
  'umbrella',
  'video',
  'volleyball',
  'waves-ladder',
  'wheat',
  'wine',
  'wrench',
  'zap',
  'earth',
] as const;

export type HabitIconId = (typeof HABIT_ICON_IDS)[number];

/** @deprecated Use HABIT_ICON_IDS — kept for any leftover imports */
export const HABIT_ICONS = HABIT_ICON_IDS;
export type HabitIcon = HabitIconId;

/** How streak days are counted for a habit. */
export type StreakMode = 'calendar' | 'scheduled';

export type StreakSettings = {
  /**
   * `calendar` — every calendar day must have activity.
   * `scheduled` — only days matching the habit schedule count (daily = every day).
   */
  mode: StreakMode;
  /** Scheduled/calendar days that may be missed without breaking the streak (0–3). */
  graceDays: number;
};

export const DEFAULT_STREAK_SETTINGS: StreakSettings = {
  mode: 'scheduled',
  graceDays: 0,
};

export function normalizeStreakSettings(value: unknown): StreakSettings {
  if (!value || typeof value !== 'object') return { ...DEFAULT_STREAK_SETTINGS };
  const raw = value as Record<string, unknown>;
  const mode: StreakMode = raw.mode === 'calendar' ? 'calendar' : 'scheduled';
  const grace =
    typeof raw.graceDays === 'number' && Number.isFinite(raw.graceDays)
      ? Math.max(0, Math.min(3, Math.floor(raw.graceDays)))
      : 0;
  return { mode, graceDays: grace };
}

export type Habit = {
  id: HabitId;
  name: string;
  icon: string;
  category?: string;
  schedule: HabitSchedule;
  streak: StreakSettings;
  /** @deprecated Session-level — retained for DB compatibility; prefer StartSessionSheet. */
  timerMode: TimerMode;
  /** @deprecated Session-level — retained for DB compatibility. */
  pomodoroMinutes: number;
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
