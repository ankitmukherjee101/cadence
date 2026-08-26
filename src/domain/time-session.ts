import type { HabitId, TimerMode, PomodoroConfig } from './habit';

export type TimeSession = {
  id: string;
  label: string;
  tagId?: string;
  habitId?: HabitId;
  mode: TimerMode;
  targetDurationMs?: number;
  startedAt: string;
  endedAt: string | null;
  notes?: string;
  /** Set while the timer is paused */
  pausedAt?: string | null;
  /** Sum of completed pause intervals in ms */
  pausedTotalMs: number;
};

export type PomodoroPhase = 'focus' | 'short_break' | 'long_break';

export type PomodoroSessionState = {
  config: PomodoroConfig;
  phase: PomodoroPhase;
  /** 1-based focus round index. */
  round: number;
  phaseStartedAt: string;
};

const POMODORO_NOTES_PREFIX = 'cadence:pomodoro:';

export function encodePomodoroNotes(state: PomodoroSessionState): string {
  return POMODORO_NOTES_PREFIX + JSON.stringify(state);
}

/** @deprecated Prefer encodePomodoroNotes with full session state. */
export function encodePomodoroConfigNotes(config: PomodoroConfig, phaseStartedAt: string): string {
  return encodePomodoroNotes({
    config,
    phase: 'focus',
    round: 1,
    phaseStartedAt,
  });
}

function isPomodoroConfig(value: unknown): value is PomodoroConfig {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.focusMinutes === 'number' &&
    typeof v.shortBreakMinutes === 'number' &&
    typeof v.longBreakMinutes === 'number' &&
    typeof v.rounds === 'number' &&
    !('config' in v)
  );
}

function isPomodoroSessionState(value: unknown): value is PomodoroSessionState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.config === 'object' &&
    v.config !== null &&
    (v.phase === 'focus' || v.phase === 'short_break' || v.phase === 'long_break') &&
    typeof v.round === 'number' &&
    typeof v.phaseStartedAt === 'string'
  );
}

/**
 * Parse pomodoro notes. Legacy config-only payloads are upgraded using `fallbackPhaseStartedAt`.
 */
export function parsePomodoroNotes(
  notes?: string | null,
  fallbackPhaseStartedAt?: string,
): PomodoroSessionState | null {
  if (!notes?.startsWith(POMODORO_NOTES_PREFIX)) return null;
  try {
    const raw: unknown = JSON.parse(notes.slice(POMODORO_NOTES_PREFIX.length));
    if (isPomodoroSessionState(raw)) return raw;
    if (isPomodoroConfig(raw) && fallbackPhaseStartedAt) {
      return {
        config: raw,
        phase: 'focus',
        round: 1,
        phaseStartedAt: fallbackPhaseStartedAt,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function getPomodoroState(session: TimeSession): PomodoroSessionState | null {
  if (session.mode !== 'pomodoro') return null;
  return parsePomodoroNotes(session.notes, session.startedAt);
}

export function phaseDurationMs(state: PomodoroSessionState): number {
  switch (state.phase) {
    case 'focus':
      return state.config.focusMinutes * 60_000;
    case 'short_break':
      return state.config.shortBreakMinutes * 60_000;
    case 'long_break':
      return state.config.longBreakMinutes * 60_000;
  }
}

export function isSessionPaused(
  session: Pick<TimeSession, 'pausedAt'>,
): boolean {
  return Boolean(session.pausedAt);
}

/** Wall clock for timer math — freezes at pausedAt while paused. */
export function sessionClock(
  session: Pick<TimeSession, 'pausedAt'>,
  now: Date = new Date(),
): Date {
  return session.pausedAt ? new Date(session.pausedAt) : now;
}

export function phaseElapsedMs(
  state: PomodoroSessionState,
  now: Date = new Date(),
  session?: Pick<TimeSession, 'pausedAt'>,
): number {
  const clock = session ? sessionClock(session, now) : now;
  return Math.max(0, clock.getTime() - new Date(state.phaseStartedAt).getTime());
}

export function phaseRemainingMs(
  state: PomodoroSessionState,
  now: Date = new Date(),
  session?: Pick<TimeSession, 'pausedAt'>,
): number {
  return Math.max(0, phaseDurationMs(state) - phaseElapsedMs(state, now, session));
}

export type PomodoroAdvance =
  | { kind: 'next_phase'; state: PomodoroSessionState; targetDurationMs: number }
  | { kind: 'complete' };

export function nextPomodoroAdvance(state: PomodoroSessionState, phaseStartedAt: string): PomodoroAdvance {
  if (state.phase === 'focus') {
    if (state.round >= state.config.rounds) {
      const next: PomodoroSessionState = {
        config: state.config,
        phase: 'long_break',
        round: state.round,
        phaseStartedAt,
      };
      return { kind: 'next_phase', state: next, targetDurationMs: phaseDurationMs(next) };
    }
    const next: PomodoroSessionState = {
      config: state.config,
      phase: 'short_break',
      round: state.round,
      phaseStartedAt,
    };
    return { kind: 'next_phase', state: next, targetDurationMs: phaseDurationMs(next) };
  }

  if (state.phase === 'short_break') {
    const next: PomodoroSessionState = {
      config: state.config,
      phase: 'focus',
      round: state.round + 1,
      phaseStartedAt,
    };
    return { kind: 'next_phase', state: next, targetDurationMs: phaseDurationMs(next) };
  }

  return { kind: 'complete' };
}

export function pomodoroPhaseLabel(phase: PomodoroPhase): string {
  switch (phase) {
    case 'focus':
      return 'Focus';
    case 'short_break':
      return 'Short break';
    case 'long_break':
      return 'Long break';
  }
}

export function sessionDurationMs(
  session: Pick<TimeSession, 'startedAt' | 'endedAt' | 'pausedAt' | 'pausedTotalMs'>,
  now: Date = new Date(),
): number {
  const end = session.endedAt ? new Date(session.endedAt).getTime() : now.getTime();
  const start = new Date(session.startedAt).getTime();
  const openPause = session.pausedAt
    ? Math.max(0, now.getTime() - new Date(session.pausedAt).getTime())
    : 0;
  // When ended while paused, open pause was already folded into pausedTotalMs
  const livePause = session.endedAt ? 0 : openPause;
  return Math.max(0, end - start - (session.pausedTotalMs ?? 0) - livePause);
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatDurationShort(ms: number): string {
  const totalMinutes = Math.round(ms / 60_000);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}
