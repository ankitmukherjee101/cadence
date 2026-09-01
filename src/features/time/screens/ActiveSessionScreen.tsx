import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChevronDown from 'lucide-react-native/icons/chevron-down';

import {
  formatDuration,
  getPomodoroState,
  isSessionPaused,
  phaseDurationMs,
  phaseRemainingMs,
  pomodoroPhaseLabel,
  sessionDurationMs,
} from '@/src/domain';
import {
  useAdvanceExpiredPomodoro,
  useHabits,
  usePauseSession,
  useResumeSession,
  useRunningSession,
  useStopHabitSession,
} from '@/src/features/habits/hooks';
import { hapticLight, hapticMedium, hapticSelection, hapticSuccess } from '@/src/shared/lib/haptics';
import { Button } from '@/src/shared/ui/Button';
import { HabitIcon, SessionFallbackIcon } from '@/src/shared/ui/HabitIcon';
import { FadeUp } from '@/src/shared/ui/motion';
import { SessionRing } from '@/src/shared/ui/SessionRing';
import { colors, fonts, radii, spacing, typography } from '@/src/shared/ui/tokens';

export function ActiveSessionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: session } = useRunningSession();
  const { data: habits } = useHabits();
  const stopSession = useStopHabitSession();
  const pauseSession = usePauseSession();
  const resumeSession = useResumeSession();
  const advancePhase = useAdvanceExpiredPomodoro();
  const [now, setNow] = useState(() => Date.now());
  const finishingRef = useRef(false);
  const lastMinuteRef = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const finish = async () => {
    if (!session || stopSession.isPending || finishingRef.current) return;
    finishingRef.current = true;
    try {
      await stopSession.mutateAsync(session.id);
      void hapticSuccess();
      if (router.canGoBack()) router.back();
      else router.replace('/');
    } catch (err) {
      finishingRef.current = false;
      Alert.alert('Couldn’t stop', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const confirmStop = () => {
    void hapticMedium();
    Alert.alert('End session?', 'This marks the habit complete for today.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'End', style: 'destructive', onPress: () => void finish() },
    ]);
  };

  const togglePause = () => {
    if (!session || pauseSession.isPending || resumeSession.isPending) return;
    void hapticSelection();
    if (isSessionPaused(session)) {
      void resumeSession.mutateAsync(session.id);
    } else {
      void pauseSession.mutateAsync(session.id);
    }
  };

  useEffect(() => {
    if (!session || isSessionPaused(session)) return;
    const state = getPomodoroState(session);
    if (!state) return;
    if (phaseRemainingMs(state, new Date(now), session) > 0 || finishingRef.current) return;
    if (advancePhase.isPending) return;

    finishingRef.current = true;
    void (async () => {
      try {
        const result = await advancePhase.mutateAsync(session.id);
        if (result === 'completed') {
          void hapticSuccess();
          if (router.canGoBack()) router.back();
          else router.replace('/');
        } else {
          void hapticLight();
          finishingRef.current = false;
        }
      } catch (err) {
        finishingRef.current = false;
        Alert.alert('Timer error', err instanceof Error ? err.message : 'Unknown error');
      }
    })();
  }, [now, session, advancePhase, router]);

  // Soft haptic on minute boundaries (skip while paused)
  useEffect(() => {
    if (!session || isSessionPaused(session)) return;
    const elapsed = sessionDurationMs(session, new Date(now));
    const minute = Math.floor(elapsed / 60_000);
    if (lastMinuteRef.current === null) {
      lastMinuteRef.current = minute;
      return;
    }
    if (minute > lastMinuteRef.current) {
      lastMinuteRef.current = minute;
      void hapticLight();
    }
  }, [now, session]);

  if (!session) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.title}>No active session</Text>
        <Button label="Back to habits" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const paused = isSessionPaused(session);
  const habit = habits?.find((h) => h.id === session.habitId);
  const pomodoro = getPomodoroState(session);
  const elapsed = sessionDurationMs(session, new Date(now));
  const displayMs = pomodoro
    ? phaseRemainingMs(pomodoro, new Date(now), session)
    : elapsed;
  const isBreak = Boolean(pomodoro && pomodoro.phase !== 'focus');
  const atmosphere = paused
    ? colors.background
    : isBreak
      ? colors.backgroundBreak
      : colors.backgroundFocus;

  let progress = 0;
  if (pomodoro) {
    const phaseMs = phaseDurationMs(pomodoro);
    progress = phaseMs > 0 ? displayMs / phaseMs : 0;
  }

  const modeLabel = paused
    ? 'Paused'
    : pomodoro
      ? `${pomodoroPhaseLabel(pomodoro.phase)} · ${pomodoro.round}/${pomodoro.config.rounds}`
      : 'Stopwatch';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: atmosphere,
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Minimize session"
        onPress={() => {
          void hapticSelection();
          router.back();
        }}
        hitSlop={16}
        style={styles.minimize}>
        <ChevronDown size={28} color={colors.accentMuted} strokeWidth={1.75} />
      </Pressable>

      <FadeUp style={styles.center}>
        <Text style={styles.name}>{habit?.name ?? session.label}</Text>
        <Text style={styles.mode}>{modeLabel}</Text>

        <View style={styles.ringWrap}>
          <SessionRing
            size={300}
            strokeWidth={2}
            progress={progress}
            trackColor={colors.borderSubtle}
            progressColor={paused ? colors.textMuted : isBreak ? colors.accentMuted : colors.accent}>
            <View style={styles.iconWrap}>
              {habit ? (
                <HabitIcon
                  name={habit.icon}
                  size={28}
                  color={paused ? colors.textMuted : colors.accent}
                  strokeWidth={1.5}
                />
              ) : (
                <SessionFallbackIcon size={28} color={paused ? colors.textMuted : colors.accent} />
              )}
            </View>
            <Text style={[styles.timer, paused && styles.timerPaused]}>
              {formatDuration(displayMs)}
            </Text>
          </SessionRing>
        </View>

        {paused ? (
          <Text style={styles.breakHint}>Timer paused</Text>
        ) : isBreak ? (
          <Text style={styles.breakHint}>Relax — next focus starts automatically</Text>
        ) : pomodoro ? (
          <Text style={styles.config}>
            {pomodoro.config.focusMinutes}m · {pomodoro.config.shortBreakMinutes}m ·{' '}
            {pomodoro.config.longBreakMinutes}m
          </Text>
        ) : null}
      </FadeUp>

      <View style={styles.actions}>
        <Button
          label={paused ? 'Resume' : 'Pause'}
          variant="ghost"
          onPress={togglePause}
          disabled={pauseSession.isPending || resumeSession.isPending}
          style={styles.actionBtn}
        />
        <Button
          label="End session"
          variant="danger"
          onPress={confirmStop}
          disabled={stopSession.isPending}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  minimize: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  center: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  ringWrap: {
    marginVertical: spacing.lg,
  },
  iconWrap: {
    marginBottom: spacing.md,
  },
  name: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
  },
  mode: {
    ...typography.labelSm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  config: {
    ...typography.data,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  breakHint: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  timer: {
    fontFamily: fonts.mono,
    fontSize: 56,
    color: colors.accentGlow,
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  timerPaused: {
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    borderRadius: radii.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.lg,
  },
});
