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
import { useHabits, useLogCompletedSession } from '@/src/features/habits/hooks';
import { hapticSelection } from '@/src/shared/lib/haptics';
import { Button } from '@/src/shared/ui/Button';
import { HabitIcon } from '@/src/shared/ui/HabitIcon';
import { colors, radii, spacing, typography } from '@/src/shared/ui/tokens';

const DURATION_PRESETS = [15, 20, 25, 30, 45, 60, 90] as const;

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

  useEffect(() => {
    if (!visible) return;
    setHabit(null);
    setMinutes(25);
    setCustom('25');
  }, [visible, date]);

  const applyMinutes = (n: number) => {
    const clamped = Math.min(480, Math.max(1, n));
    setMinutes(clamped);
    setCustom(String(clamped));
  };

  const save = async () => {
    if (!habit) return;
    void hapticSelection();
    await logSession.mutateAsync({
      habitId: habit.id,
      date,
      durationMs: minutes * 60_000,
    });
    onClose();
  };

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
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={habit ? `Log ${minutes}m · ${habit.name}` : 'Choose a habit'}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  close: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  hint: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
  },
  habitRowActive: {
    backgroundColor: colors.accentSoft,
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
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
  },
  presetActive: {
    backgroundColor: colors.accentSoft,
  },
  presetText: {
    ...typography.caption,
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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...typography.heading,
    color: colors.text,
  },
  unit: {
    ...typography.body,
    color: colors.textMuted,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
  },
});
