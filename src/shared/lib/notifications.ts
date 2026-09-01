import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

import type { Habit, HabitSchedule, PomodoroPhase } from '@/src/domain';
import { pomodoroPhaseLabel } from '@/src/domain';

const SESSION_CHANNEL = 'cadence-sessions';
const REMINDER_CHANNEL = 'cadence-reminders';

/**
 * Expo Go on Android throws if `expo-notifications` is imported at all (push APIs
 * were removed in SDK 53). Local notifications still work in a development build.
 */
const notificationsUnsupported =
  Platform.OS === 'web' || (Platform.OS === 'android' && isRunningInExpoGo());

type NotificationsModule = typeof import('expo-notifications');

let Notifications: NotificationsModule | null = null;
let handlerReady = false;
let channelsReady = false;

function getNotifications(): NotificationsModule | null {
  if (notificationsUnsupported) return null;
  if (!Notifications) {
    // Lazy require so Expo Go Android never evaluates the broken push registration path.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Notifications = require('expo-notifications') as NotificationsModule;
  }
  if (!handlerReady && Notifications) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerReady = true;
  }
  return Notifications;
}

async function ensureChannels(NotificationsApi: NotificationsModule): Promise<void> {
  if (channelsReady || Platform.OS !== 'android') {
    channelsReady = true;
    return;
  }
  await NotificationsApi.setNotificationChannelAsync(SESSION_CHANNEL, {
    name: 'Sessions',
    importance: NotificationsApi.AndroidImportance.HIGH,
  });
  await NotificationsApi.setNotificationChannelAsync(REMINDER_CHANNEL, {
    name: 'Habit reminders',
    importance: NotificationsApi.AndroidImportance.DEFAULT,
  });
  channelsReady = true;
}

export function areNotificationsAvailable(): boolean {
  return !notificationsUnsupported;
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  const NotificationsApi = getNotifications();
  if (!NotificationsApi) return false;
  await ensureChannels(NotificationsApi);
  const current = await NotificationsApi.getPermissionsAsync();
  if (current.granted) return true;
  if (current.canAskAgain === false) return false;
  const requested = await NotificationsApi.requestPermissionsAsync();
  return requested.granted;
}

function sessionNotifId(sessionId: string): string {
  return `session-phase-${sessionId}`;
}

function habitReminderId(habitId: string, weekday?: number): string {
  return weekday === undefined
    ? `habit-reminder-${habitId}`
    : `habit-reminder-${habitId}-d${weekday}`;
}

export async function cancelSessionPhaseNotification(sessionId: string): Promise<void> {
  const NotificationsApi = getNotifications();
  if (!NotificationsApi) return;
  try {
    await NotificationsApi.cancelScheduledNotificationAsync(sessionNotifId(sessionId));
  } catch {
    // already cancelled or never scheduled
  }
}

export async function scheduleSessionPhaseEnd(input: {
  sessionId: string;
  habitName: string;
  phase: PomodoroPhase;
  fireAt: Date;
}): Promise<void> {
  const NotificationsApi = getNotifications();
  if (!NotificationsApi) return;

  const ok = await ensureNotificationPermissions();
  if (!ok) return;

  await cancelSessionPhaseNotification(input.sessionId);

  const seconds = Math.ceil((input.fireAt.getTime() - Date.now()) / 1000);
  if (seconds <= 0) return;

  const endingLabel = pomodoroPhaseLabel(input.phase);
  const body =
    input.phase === 'focus'
      ? `${endingLabel} done for ${input.habitName}. Break time.`
      : input.phase === 'short_break'
        ? `Break over — back to ${input.habitName}.`
        : `${input.habitName} session complete.`;

  await NotificationsApi.scheduleNotificationAsync({
    identifier: sessionNotifId(input.sessionId),
    content: {
      title: 'Cadence',
      body,
      sound: true,
      data: { type: 'session_phase', sessionId: input.sessionId },
    },
    trigger: {
      type: NotificationsApi.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: Platform.OS === 'android' ? SESSION_CHANNEL : undefined,
    },
  });
}

export async function cancelHabitReminder(habitId: string, daysOfWeek?: number[]): Promise<void> {
  const NotificationsApi = getNotifications();
  if (!NotificationsApi) return;

  const ids =
    daysOfWeek && daysOfWeek.length > 0
      ? daysOfWeek.map((d) => habitReminderId(habitId, d))
      : [habitReminderId(habitId), ...Array.from({ length: 7 }, (_, d) => habitReminderId(habitId, d))];

  await Promise.all(
    ids.map(async (id) => {
      try {
        await NotificationsApi.cancelScheduledNotificationAsync(id);
      } catch {
        // ignore
      }
    }),
  );
}

function reminderParts(minutes: number): { hour: number; minute: number } {
  const clamped = Math.max(0, Math.min(1439, Math.floor(minutes)));
  return { hour: Math.floor(clamped / 60), minute: clamped % 60 };
}

export async function syncHabitReminder(habit: Habit): Promise<void> {
  const NotificationsApi = getNotifications();
  if (!NotificationsApi) return;

  await cancelHabitReminder(
    habit.id,
    habit.schedule.kind === 'weekly' ? habit.schedule.daysOfWeek : undefined,
  );

  const reminderMinutes = habit.schedule.reminderMinutes;
  if (reminderMinutes == null || habit.archivedAt) return;

  const ok = await ensureNotificationPermissions();
  if (!ok) return;

  const { hour, minute } = reminderParts(reminderMinutes);
  const channelId = Platform.OS === 'android' ? REMINDER_CHANNEL : undefined;

  if (habit.schedule.kind === 'weekly') {
    for (const weekday of habit.schedule.daysOfWeek) {
      await NotificationsApi.scheduleNotificationAsync({
        identifier: habitReminderId(habit.id, weekday),
        content: {
          title: habit.name,
          body: 'Time for your habit.',
          sound: true,
          data: { type: 'habit_reminder', habitId: habit.id },
        },
        trigger: {
          type: NotificationsApi.SchedulableTriggerInputTypes.WEEKLY,
          weekday: weekday + 1, // expo: 1=Sunday … 7=Saturday
          hour,
          minute,
          channelId,
        },
      });
    }
    return;
  }

  await NotificationsApi.scheduleNotificationAsync({
    identifier: habitReminderId(habit.id),
    content: {
      title: habit.name,
      body: 'Time for your habit.',
      sound: true,
      data: { type: 'habit_reminder', habitId: habit.id },
    },
    trigger: {
      type: NotificationsApi.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId,
    },
  });
}

export async function syncAllHabitReminders(habits: Habit[]): Promise<void> {
  for (const habit of habits) {
    await syncHabitReminder(habit);
  }
}

export type NotificationPayload =
  | { type: 'session_phase'; sessionId: string }
  | { type: 'habit_reminder'; habitId: string };

export function parseNotificationData(data: unknown): NotificationPayload | null {
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;
  if (record.type === 'session_phase' && typeof record.sessionId === 'string') {
    return { type: 'session_phase', sessionId: record.sessionId };
  }
  if (record.type === 'habit_reminder' && typeof record.habitId === 'string') {
    return { type: 'habit_reminder', habitId: record.habitId };
  }
  return null;
}

/**
 * Route notification taps (and cold-start opens) into app navigation.
 * Returns a cleanup function.
 */
export function setupNotificationResponseHandler(
  handler: (payload: NotificationPayload) => void,
): () => void {
  const NotificationsApi = getNotifications();
  if (!NotificationsApi) return () => {};

  void NotificationsApi.getLastNotificationResponseAsync().then((response) => {
    if (!response) return;
    const payload = parseNotificationData(response.notification.request.content.data);
    if (payload) handler(payload);
  });

  const sub = NotificationsApi.addNotificationResponseReceivedListener((response) => {
    const payload = parseNotificationData(response.notification.request.content.data);
    if (payload) handler(payload);
  });

  return () => sub.remove();
}

export function formatReminderLabel(minutes: number): string {
  const { hour, minute } = reminderParts(minutes);
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h12}:${String(minute).padStart(2, '0')} ${ampm}`;
}

export function scheduleReminderMinutes(schedule: HabitSchedule): number | null {
  return schedule.reminderMinutes ?? null;
}
