import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDayRepository,
  createHabitsRepository,
  createJournalRepository,
  createTimeRepository,
  type CreateHabitInput,
  type UpdateHabitInput,
} from '@/src/db';
import type { LocalDate, TimerMode } from '@/src/domain';
import {
  encodePomodoroNotes,
  getPomodoroState,
  nextPomodoroAdvance,
  phaseRemainingMs,
  sessionDurationMs,
  todayLocalDate,
  toLocalDate,
} from '@/src/domain';
import { nowIso } from '@/src/db/utils';
import {
  cancelHabitReminder,
  cancelSessionPhaseNotification,
  scheduleSessionPhaseEnd,
  syncHabitReminder,
} from '@/src/shared/lib/notifications';
import { queryKeys } from '@/src/shared/lib/query-keys';
import { useUiStore } from '@/src/store/ui-store';

const habitsRepo = () => createHabitsRepository();
const timeRepo = () => createTimeRepository();
const journalRepo = () => createJournalRepository();
const dayRepo = () => createDayRepository();

export function useHabits() {
  return useQuery({
    queryKey: queryKeys.habits,
    queryFn: () => habitsRepo().listActive(),
  });
}

export function useArchivedHabits() {
  return useQuery({
    queryKey: [...queryKeys.habits, 'archived'] as const,
    queryFn: () => habitsRepo().listArchived(),
  });
}

export function useHabit(id: string | null) {
  return useQuery({
    queryKey: id ? queryKeys.habit(id) : ['habits', 'none'],
    queryFn: () => (id ? habitsRepo().getById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}

export function useHabitLogsForDate(date: LocalDate) {
  return useQuery({
    queryKey: queryKeys.habitLogsToday(date),
    queryFn: () => habitsRepo().listLogsForDate(date),
  });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateHabitInput) => habitsRepo().create(input),
    onSuccess: async (habit) => {
      await syncHabitReminder(habit);
      await qc.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}

export function useUpdateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateHabitInput }) =>
      habitsRepo().update(id, patch),
    onSuccess: async (habit) => {
      await syncHabitReminder(habit);
      await qc.invalidateQueries({ queryKey: queryKeys.habits });
      await qc.invalidateQueries({ queryKey: queryKeys.habit(habit.id) });
    },
  });
}

export function useArchiveHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await habitsRepo().archive(id);
      await cancelHabitReminder(id);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}

export function useUnarchiveHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => habitsRepo().unarchive(id),
    onSuccess: async (habit) => {
      await syncHabitReminder(habit);
      await qc.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}

export function useRunningSession() {
  return useQuery({
    queryKey: queryKeys.runningSession,
    queryFn: () => timeRepo().getRunning(),
    refetchInterval: 1000,
  });
}

async function scheduleForSession(session: {
  id: string;
  label: string;
  habitId?: string;
  mode: TimerMode;
  notes?: string;
  startedAt: string;
  targetDurationMs?: number;
}) {
  const state = getPomodoroState(session as Parameters<typeof getPomodoroState>[0]);
  if (!state) return;
  const fireAt = new Date(new Date(state.phaseStartedAt).getTime() + (session.targetDurationMs ?? 0));
  const habit = session.habitId ? await habitsRepo().getById(session.habitId) : null;
  await scheduleSessionPhaseEnd({
    sessionId: session.id,
    habitName: habit?.name ?? session.label,
    phase: state.phase,
    fireAt,
  });
}

export function useStartHabitSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      habitId: string;
      mode: TimerMode;
      targetDurationMs?: number;
      notes?: string;
    }) => {
      const habit = await habitsRepo().getById(input.habitId);
      if (!habit) throw new Error('Habit not found');
      const session = await timeRepo().start({
        label: habit.name,
        habitId: habit.id,
        mode: input.mode,
        targetDurationMs: input.targetDurationMs,
        notes: input.notes,
      });
      await scheduleForSession(session);
      return session;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.runningSession });
    },
  });
}

export function useStopHabitSession() {
  const qc = useQueryClient();
  const setJournalPrompt = useUiStore((s) => s.setJournalPrompt);

  return useMutation({
    mutationFn: async (sessionId: string) => {
      await cancelSessionPhaseNotification(sessionId);
      const stopped = await timeRepo().stop(sessionId);
      if (!stopped.habitId) return { session: stopped, habit: null };

      const habit = await habitsRepo().getById(stopped.habitId);
      const date = toLocalDate(new Date(stopped.startedAt));
      await habitsRepo().upsertLog({
        habitId: stopped.habitId,
        date,
        status: 'completed',
      });

      return { session: stopped, habit, date };
    },
    onSuccess: async (result) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.runningSession }),
        qc.invalidateQueries({ queryKey: queryKeys.habits }),
        qc.invalidateQueries({ queryKey: queryKeys.habitLogsToday(todayLocalDate()) }),
        result.date
          ? qc.invalidateQueries({ queryKey: queryKeys.day(result.date) })
          : Promise.resolve(),
        result.session.habitId
          ? qc.invalidateQueries({ queryKey: queryKeys.habitAnalytics(result.session.habitId) })
          : Promise.resolve(),
      ]);

      if (result.habit && result.date) {
        setJournalPrompt({
          sessionId: result.session.id,
          habitId: result.habit.id,
          habitName: result.habit.name,
          habitIcon: result.habit.icon,
          date: result.date,
          durationMs: sessionDurationMs(result.session),
        });
      }
    },
  });
}

export function usePauseSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      await cancelSessionPhaseNotification(sessionId);
      return timeRepo().pause(sessionId);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.runningSession });
    },
  });
}

export function useResumeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const session = await timeRepo().resume(sessionId);
      await scheduleForSession(session);
      return session;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.runningSession });
    },
  });
}

/**
 * Advance an expired pomodoro phase (break ↔ focus) or complete the session.
 * Shared by foreground tick + AppState resume.
 */
export async function advanceExpiredPomodoro(sessionId: string): Promise<'advanced' | 'completed' | 'noop'> {
  const session = await timeRepo().getById(sessionId);
  if (!session || session.endedAt) return 'noop';
  if (session.pausedAt) return 'noop';

  const state = getPomodoroState(session);
  if (!state) return 'noop';
  if (phaseRemainingMs(state, new Date(), session) > 0) return 'noop';

  const phaseStartedAt = nowIso();
  const advance = nextPomodoroAdvance(state, phaseStartedAt);

  if (advance.kind === 'complete') {
    await cancelSessionPhaseNotification(sessionId);
    const stopped = await timeRepo().stop(sessionId);
    if (stopped.habitId) {
      await habitsRepo().upsertLog({
        habitId: stopped.habitId,
        date: toLocalDate(new Date(stopped.startedAt)),
        status: 'completed',
      });
    }
    return 'completed';
  }

  const updated = await timeRepo().updateRunning(sessionId, {
    notes: encodePomodoroNotes(advance.state),
    targetDurationMs: advance.targetDurationMs,
  });
  await scheduleForSession(updated);
  return 'advanced';
}

export function useAdvanceExpiredPomodoro() {
  const qc = useQueryClient();
  const setJournalPrompt = useUiStore((s) => s.setJournalPrompt);

  return useMutation({
    mutationFn: (sessionId: string) => advanceExpiredPomodoro(sessionId),
    onSuccess: async (result, sessionId) => {
      await qc.invalidateQueries({ queryKey: queryKeys.runningSession });
      if (result !== 'completed') return;

      const session = await timeRepo().getById(sessionId);
      if (!session?.habitId) return;
      const habit = await habitsRepo().getById(session.habitId);
      const date = toLocalDate(new Date(session.startedAt));
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.habits }),
        qc.invalidateQueries({ queryKey: queryKeys.habitLogsToday(todayLocalDate()) }),
        qc.invalidateQueries({ queryKey: queryKeys.day(date) }),
        qc.invalidateQueries({ queryKey: queryKeys.habitAnalytics(session.habitId) }),
      ]);
      if (habit) {
        setJournalPrompt({
          sessionId: session.id,
          habitId: habit.id,
          habitName: habit.name,
          habitIcon: habit.icon,
          date,
          durationMs: sessionDurationMs(session),
        });
      }
    },
  });
}

export function useDaySummary(date: LocalDate) {
  return useQuery({
    queryKey: queryKeys.day(date),
    queryFn: () => dayRepo().getSummary(date),
  });
}

export function useJournalForDate(date: LocalDate) {
  return useQuery({
    queryKey: queryKeys.journal(date),
    queryFn: () => journalRepo().listForDate(date),
  });
}

export function useJournalEntry(id: string | null) {
  return useQuery({
    queryKey: id ? queryKeys.journalEntry(id) : ['journal', 'entry', 'none'],
    queryFn: () => (id ? journalRepo().getById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}

export function useCreateJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      date: LocalDate;
      body: string;
      title?: string;
      habitId?: string;
      sessionId?: string;
    }) => journalRepo().create(input),
    onSuccess: async (entry) => {
      await qc.invalidateQueries({ queryKey: queryKeys.journal(entry.date) });
      await qc.invalidateQueries({ queryKey: queryKeys.day(entry.date) });
    },
  });
}

/** Log a finished timed session on a calendar date (journal backfill). */
export function useLogCompletedSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      habitId: string;
      date: LocalDate;
      durationMs: number;
      /** Minutes from local midnight when the session ended. */
      endedMinutes?: number;
    }) => {
      const habit = await habitsRepo().getById(input.habitId);
      if (!habit) throw new Error('Habit not found');
      const session = await timeRepo().logCompleted({
        label: habit.name,
        habitId: habit.id,
        durationMs: input.durationMs,
        date: input.date,
        endedMinutes: input.endedMinutes,
      });
      await habitsRepo().upsertLog({
        habitId: habit.id,
        date: input.date,
        status: 'completed',
      });
      return { session, habit, date: input.date };
    },
    onSuccess: async (result) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.habits }),
        qc.invalidateQueries({ queryKey: queryKeys.habitLogsToday(result.date) }),
        qc.invalidateQueries({ queryKey: queryKeys.day(result.date) }),
        qc.invalidateQueries({ queryKey: queryKeys.habitAnalytics(result.habit.id) }),
      ]);
    },
  });
}

export function useUpdateJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: { title?: string; body?: string; date?: LocalDate };
    }) => journalRepo().update(id, patch),
    onSuccess: async (entry) => {
      await qc.invalidateQueries({ queryKey: queryKeys.journal(entry.date) });
      await qc.invalidateQueries({ queryKey: queryKeys.day(entry.date) });
      await qc.invalidateQueries({ queryKey: queryKeys.journalEntry(entry.id) });
    },
  });
}

/** Remove a completed timed session from the journal day timeline. */
export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const deleted = await timeRepo().delete(sessionId);
      const date = toLocalDate(new Date(deleted.startedAt));
      const habitId = deleted.habitId;

      if (habitId) {
        const stillCompleted = await timeRepo().hasCompletedSessionOnDate(habitId, date);
        if (!stillCompleted) {
          await habitsRepo().deleteLog(habitId, date);
        }
      }

      return { session: deleted, date, habitId };
    },
    onSuccess: async (result) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.habits }),
        qc.invalidateQueries({ queryKey: queryKeys.habitLogsToday(result.date) }),
        qc.invalidateQueries({ queryKey: queryKeys.day(result.date) }),
        qc.invalidateQueries({ queryKey: queryKeys.journal(result.date) }),
        result.habitId
          ? qc.invalidateQueries({ queryKey: queryKeys.habitAnalytics(result.habitId) })
          : Promise.resolve(),
      ]);
    },
  });
}

export function useHabitAnalytics(habitId: string | null) {
  return useQuery({
    queryKey: habitId ? queryKeys.habitAnalytics(habitId) : ['analytics', 'none'],
    queryFn: () => (habitId ? timeRepo().getHabitAnalytics(habitId) : Promise.resolve(null)),
    enabled: Boolean(habitId),
  });
}
