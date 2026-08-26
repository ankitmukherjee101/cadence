import { type ReactNode, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import {
  advanceExpiredPomodoro,
  useRunningSession,
} from '@/src/features/habits/hooks/useHabitsData';
import { createHabitsRepository, createTimeRepository } from '@/src/db';
import {
  getPomodoroState,
  phaseRemainingMs,
  sessionDurationMs,
  todayLocalDate,
  toLocalDate,
} from '@/src/domain';
import { ensureNotificationPermissions } from '@/src/shared/lib/notifications';
import { queryKeys } from '@/src/shared/lib/query-keys';
import { useUiStore } from '@/src/store/ui-store';

type Props = { children: ReactNode };

/**
 * Handles AppState resume for expired pomodoros and warms notification permissions once.
 */
export function SessionLifecycleProvider({ children }: Props) {
  const { data: running } = useRunningSession();
  const qc = useQueryClient();
  const setJournalPrompt = useUiStore((s) => s.setJournalPrompt);
  const advancingRef = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    void ensureNotificationPermissions();
  }, []);

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      const prev = appState.current;
      appState.current = next;
      if (!(prev.match(/inactive|background/) && next === 'active')) return;
      if (!running || advancingRef.current) return;

      const state = getPomodoroState(running);
      if (!state) return;
      if (running.pausedAt) return;
      if (phaseRemainingMs(state, new Date(), running) > 0) return;

      advancingRef.current = true;
      void (async () => {
        try {
          let result = await advanceExpiredPomodoro(running.id);
          // Catch up through multiple skipped phases while backgrounded
          while (result === 'advanced') {
            const current = await createTimeRepository().getRunning();
            if (!current) break;
            const s = getPomodoroState(current);
            if (!s || current.pausedAt || phaseRemainingMs(s, new Date(), current) > 0) break;
            result = await advanceExpiredPomodoro(current.id);
          }

          await qc.invalidateQueries({ queryKey: queryKeys.runningSession });

          if (result === 'completed') {
            const session = await createTimeRepository().getById(running.id);
            if (!session?.habitId) return;
            const habit = await createHabitsRepository().getById(session.habitId);
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
          }
        } finally {
          advancingRef.current = false;
        }
      })();
    };

    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [running, qc, setJournalPrompt]);

  return <>{children}</>;
}
