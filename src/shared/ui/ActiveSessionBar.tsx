import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import {
  formatDuration,
  getPomodoroState,
  isSessionPaused,
  phaseRemainingMs,
  sessionDurationMs,
} from '@/src/domain';
import { useHabits, useRunningSession } from '@/src/features/habits/hooks';
import { HabitIcon, SessionFallbackIcon } from '@/src/shared/ui/HabitIcon';
import { colors, fonts, spacing, typography } from '@/src/shared/ui/tokens';

const ACTIVE_SESSION_HREF = '/session/active' as Href;

export function ActiveSessionBar() {
  const router = useRouter();
  const { data: session } = useRunningSession();
  const { data: habits } = useHabits();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session]);

  if (!session) return null;

  const habit = habits?.find((h) => h.id === session.habitId);
  const paused = isSessionPaused(session);
  const pomodoro = getPomodoroState(session);
  const elapsed = pomodoro
    ? phaseRemainingMs(pomodoro, new Date(now), session)
    : sessionDurationMs(session, new Date(now));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open active session"
      onPress={() => router.push(ACTIVE_SESSION_HREF)}
      style={[styles.bar, paused && styles.barPaused]}>
      <View style={styles.left}>
        <View style={[styles.dot, paused && styles.dotPaused]} />
        {habit ? (
          <HabitIcon name={habit.icon} size={16} color={colors.accentGlow} />
        ) : (
          <SessionFallbackIcon size={16} color={colors.accentGlow} />
        )}
        <Text style={styles.name} numberOfLines={1}>
          {habit?.name ?? session.label}
          {paused ? ' · Paused' : ''}
        </Text>
      </View>
      <Text style={styles.time}>{formatDuration(elapsed)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  barPaused: {
    opacity: 0.85,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  dotPaused: {
    backgroundColor: colors.textMuted,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
  },
  time: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.accentGlow,
  },
});
