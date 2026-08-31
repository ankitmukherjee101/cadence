import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { Habit, LocalDate } from '@/src/domain';
import { todayLocalDate } from '@/src/domain';
import { useHabits, useLogCompletedSession } from '@/src/features/habits/hooks';
import { hapticSelection } from '@/src/shared/lib/haptics';
import { formatReminderLabel } from '@/src/shared/lib/notifications';
import { Button } from '@/src/shared/ui/Button';
import { HabitIcon } from '@/src/shared/ui/HabitIcon';
import { colors, radii, spacing, typography } from '@/src/shared/ui/tokens';

const DURATION_PRESETS = [15, 20, 25, 30, 45, 60, 90] as const;

const TIME_PRESETS = [
  7 * 60,
  9 * 60,
  12 * 60,
  15 * 60,
  18 * 60,
  21 * 60,
] as const;

function minutesNow(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function defaultEndedMinutes(date: LocalDate): number {
  return date === todayLocalDate() ? minutesNow() : 12 * 60;
}

type Props = {
  visible: boolean;
  date: LocalDate;
  onClose: () => void;
};

export function LogHabitSheet({ visible, date, onClose }: Props) {
  const { data: habits } = useHabits();
  const logSession = useLogCompletedSession();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [minutes, setMinutes] = useState(25);
  const [custom, setCustom] = useState('25');
  const [endedMinutes, setEndedMinutes] = useState(() => defaultEndedMinutes(date));

  useEffect(() => {
    if (!visible) return;
    setHabit(null);
    setMinutes(25);
    setCustom('25');
    setEndedMinutes(defaultEndedMinutes(date));
  }, [visible, date]);

  const applyMinutes = (n: number) => {
    const clamped = Math.min(480, Math.max(1, n));
    setMinutes(clamped);
    setCustom(String(clamped));
  };

  const nudgeEnded = (delta: number) => {
    setEndedMinutes((prev) => Math.min(23 * 60 + 59, Math.max(0, prev + delta)));
  };

  const save = async () => {
    if (!habit) return;
    void hapticSelection();
    let endMins = endedMinutes;
    if (date === todayLocalDate()) {
      endMins = Math.min(endMins, minutesNow());
    }
    await logSession.mutateAsync({
      habitId: habit.id,
      date,
      durationMs: minutes * 60_000,
      endedMinutes: endMins,
    });
    onClose();
  };

  const isToday = date === todayLocalDate();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Log habit</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.hint}>Records a finished session on {date}.</Text>

          <Text style={styles.label}>Habit</Text>
          <View style={styles.habitList}>
            {(habits ?? []).map((h) => {
              const active = habit?.id === h.id;
              return (
                <Pressable
                  key={h.id}
                  onPress={() => {
                    void hapticSelection();
                    setHabit(h);
                  }}
                  style={[styles.habitRow, active && styles.habitRowActive]}>
                  <HabitIcon
                    name={h.icon}
                    size={20}
                    color={active ? colors.accent : colors.textMuted}
                  />
                  <Text style={[styles.habitName, active && styles.habitNameActive]} numberOfLines={1}>
                    {h.name}
                  </Text>
                </Pressable>
              );
            })}
            {!habits?.length ? (
              <Text style={styles.empty}>Add a habit on the Habits tab first.</Text>
            ) : null}
          </View>

          <Text style={styles.label}>Duration</Text>
          <View style={styles.presetRow}>
            {DURATION_PRESETS.map((p) => {
              const active = minutes === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => applyMinutes(p)}
                  style={[styles.preset, active && styles.presetActive]}>
                  <Text style={[styles.presetText, active && styles.presetTextActive]}>{p}m</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.customRow}>
            <TextInput
              value={custom}
              onChangeText={(t) => {
                setCustom(t);
                const n = Number.parseInt(t, 10);
                if (Number.isFinite(n) && n > 0) setMinutes(Math.min(480, n));
              }}
              keyboardType="number-pad"
              style={styles.customInput}
            />
            <Text style={styles.unit}>minutes</Text>
          </View>

          <Text style={styles.label}>Ended at</Text>
          <Text style={styles.timeLabel}>{formatReminderLabel(endedMinutes)}</Text>
          <View style={styles.presetRow}>
            {TIME_PRESETS.map((mins) => {
              const active = endedMinutes === mins;
              return (
                <Pressable
                  key={mins}
                  onPress={() => {
                    void hapticSelection();
                    setEndedMinutes(mins);
                  }}
                  style={[styles.preset, active && styles.presetActive]}>
                  <Text style={[styles.presetText, active && styles.presetTextActive]}>
                    {formatReminderLabel(mins)}
                  </Text>
                </Pressable>
              );
            })}
            {isToday ? (
              <Pressable
                onPress={() => {
                  void hapticSelection();
                  setEndedMinutes(minutesNow());
                }}
                style={[styles.preset, endedMinutes === minutesNow() && styles.presetActive]}>
                <Text
                  style={[
                    styles.presetText,
                    endedMinutes === minutesNow() && styles.presetTextActive,
                  ]}>
                  Now
                </Text>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.stepperRow}>
            <Pressable
              accessibilityLabel="Subtract 15 minutes"
              onPress={() => nudgeEnded(-15)}
              style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>−15</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Subtract one minute"
              onPress={() => nudgeEnded(-1)}
              style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>−1</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Add one minute"
              onPress={() => nudgeEnded(1)}
              style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>+1</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Add 15 minutes"
              onPress={() => nudgeEnded(15)}
              style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>+15</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={
              habit
                ? `Log ${minutes}m · ${formatReminderLabel(endedMinutes)}`
                : 'Choose a habit'
            }
            onPress={() => void save()}
            disabled={!habit || logSession.isPending || minutes < 1}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.container,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  close: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  content: {
    paddingHorizontal: spacing.container,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  hint: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.labelSm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.md,
  },
  habitList: {
    gap: spacing.xs,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  habitRowActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  habitName: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },
  habitNameActive: {
    color: colors.accentGlow,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    paddingVertical: spacing.md,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  preset: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  presetText: {
    ...typography.data,
    color: colors.textMuted,
  },
  presetTextActive: {
    color: colors.accent,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  customInput: {
    minWidth: 72,
    textAlign: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  unit: {
    ...typography.body,
    color: colors.textMuted,
  },
  timeLabel: {
    ...typography.heading,
    fontSize: 28,
    lineHeight: 34,
    color: colors.accentGlow,
    fontVariant: ['tabular-nums'],
  },
  stepperRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  stepBtn: {
    flex: 1,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    ...typography.data,
    color: colors.accent,
  },
  footer: {
    padding: spacing.container,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
