import type { HabitId } from './habit';

export type TimeSession = {
  id: string;
  label: string;
  tagId?: string;
  habitId?: HabitId;
  startedAt: string;
  endedAt: string | null;
  notes?: string;
};

export function sessionDurationMs(
  session: Pick<TimeSession, 'startedAt' | 'endedAt'>,
  now: Date = new Date(),
): number {
  const end = session.endedAt ? new Date(session.endedAt).getTime() : now.getTime();
  const start = new Date(session.startedAt).getTime();
  return Math.max(0, end - start);
}
