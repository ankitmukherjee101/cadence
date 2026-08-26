import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  View,
} from 'react-native';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronUp from 'lucide-react-native/icons/chevron-up';

import type { Habit, HabitIconId, HabitSchedule, StreakMode, StreakSettings } from '@/src/domain';
import { DEFAULT_STREAK_SETTINGS } from '@/src/domain';
import { useCreateHabit, useUpdateHabit } from '@/src/features/habits/hooks';
import { Button } from '@/src/shared/ui/Button';
import { HABIT_ICON_OPTIONS, HabitIcon, resolveHabitIconId } from '@/src/shared/ui/HabitIcon';
import { formatReminderLabel } from '@/src/shared/lib/notifications';
import { colors, radii, spacing, typography } from '@/src/shared/ui/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
  habit?: Habit | null;
};

const REMINDER_PRESETS = [
  7 * 60,
  8 * 60,
  9 * 60,
  12 * 60,
  17 * 60,
  18 * 60,
  20 * 60,
  21 * 60,
] as const;

const GRACE_PRESETS = [0, 1, 2, 3] as const;

export function HabitFormModal({ visible, onClose, habit }: Props) {
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<HabitIconId>('sparkles');
  const [category, setCategory] = useState('');
  const [iconQuery, setIconQuery] = useState('');
  const [reminderOn, setReminderOn] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(9 * 60);
  const [streakMode, setStreakMode] = useState<StreakMode>(DEFAULT_STREAK_SETTINGS.mode);
  const [graceDays, setGraceDays] = useState(DEFAULT_STREAK_SETTINGS.graceDays);
  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (habit) {
      setName(habit.name);
      setIcon(resolveHabitIconId(habit.icon));
      setCategory(habit.category ?? '');
      const mins = habit.schedule.reminderMinutes;
      if (mins != null) {
        setReminderOn(true);
        setReminderMinutes(mins);
      } else {
        setReminderOn(false);
        setReminderMinutes(9 * 60);
      }
      setStreakMode(habit.streak.mode);
      setGraceDays(habit.streak.graceDays);
    } else {
      setName('');
      setIcon('sparkles');
      setCategory('');
      setReminderOn(false);
      setReminderMinutes(9 * 60);
      setStreakMode(DEFAULT_STREAK_SETTINGS.mode);
      setGraceDays(DEFAULT_STREAK_SETTINGS.graceDays);
    }
    setIconQuery('');
    setAdvanced(false);
  }, [visible, habit]);

  const filteredIcons = useMemo(() => {
    const q = iconQuery.trim().toLowerCase();
    if (!q) return HABIT_ICON_OPTIONS;
    return HABIT_ICON_OPTIONS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.id.replace(/-/g, ' ').includes(q),
    );
  }, [iconQuery]);

  const buildSchedule = (): HabitSchedule => {
    const base = habit?.schedule ?? { kind: 'daily' as const };
    if (base.kind === 'weekly') {
      return {
        kind: 'weekly',
        daysOfWeek: base.daysOfWeek,
        reminderMinutes: reminderOn ? reminderMinutes : null,
      };
    }
    return {
      kind: 'daily',
      reminderMinutes: reminderOn ? reminderMinutes : null,
    };
  };

  const buildStreak = (): StreakSettings => ({
    mode: streakMode,
    graceDays,
  });

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const schedule = buildSchedule();
    const streak = buildStreak();

    if (habit) {
      await updateHabit.mutateAsync({
        id: habit.id,
        patch: {
          name: trimmed,
          icon,
          category: category.trim() || undefined,
          schedule,
          streak,
        },
      });
    } else {
      await createHabit.mutateAsync({
        name: trimmed,
        icon,
        category: category.trim() || undefined,
        schedule,
        streak,
      });
    }
    onClose();
  };

  const pending = createHabit.isPending || updateHabit.isPending;
  const selectedLabel = HABIT_ICON_OPTIONS.find((i) => i.id === icon)?.label ?? icon;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>{habit ? 'Edit habit' : 'New habit'}</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Deep work"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Category (optional)</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. Focus"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Icon</Text>
          <View style={styles.selectedRow}>
            <View style={[styles.iconChip, styles.iconChipActive]}>
              <HabitIcon name={icon} size={22} color={colors.accent} />
            </View>
            <Text style={styles.selectedLabel} numberOfLines={1}>
              {selectedLabel}
            </Text>
          </View>
          <TextInput
            value={iconQuery}
            onChangeText={setIconQuery}
            placeholder="Search icons…"
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            style={styles.input}
          />
          {filteredIcons.length === 0 ? (
            <Text style={styles.emptyIcons}>No icons match “{iconQuery.trim()}”</Text>
          ) : (
            <View style={styles.iconRow}>
              {(advanced ? filteredIcons : filteredIcons.slice(0, 24)).map((item) => {
                const active = icon === item.id;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityLabel={item.label}
                    onPress={() => setIcon(item.id)}
                    style={[styles.iconChip, active && styles.iconChipActive]}>
                    <HabitIcon
                      name={item.id}
                      size={22}
                      color={active ? colors.accent : colors.textMuted}
                    />
                  </Pressable>
                );
              })}
            </View>
          )}
          {!advanced && filteredIcons.length > 24 ? (
            <Text style={styles.moreIconsHint}>Open Advanced to browse all icons</Text>
          ) : null}

          <Pressable
            onPress={() => setAdvanced((v) => !v)}
            style={styles.advancedToggle}
            accessibilityRole="button">
            <Text style={styles.advancedText}>{advanced ? 'Hide advanced' : 'Advanced'}</Text>
            {advanced ? (
              <ChevronUp size={16} color={colors.accent} />
            ) : (
              <ChevronDown size={16} color={colors.accent} />
            )}
          </Pressable>

          {advanced ? (
            <>
              <View style={styles.reminderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reminderTitle}>Daily reminder</Text>
                  <Text style={styles.reminderHint}>Local notification on this device</Text>
                </View>
                <Switch
                  value={reminderOn}
                  onValueChange={setReminderOn}
                  trackColor={{ false: colors.border, true: colors.accentMuted }}
                  thumbColor={reminderOn ? colors.accent : colors.textMuted}
                />
              </View>

              {reminderOn ? (
                <>
                  <Text style={styles.timeLabel}>{formatReminderLabel(reminderMinutes)}</Text>
                  <View style={styles.presetRow}>
                    {REMINDER_PRESETS.map((mins) => {
                      const active = reminderMinutes === mins;
                      return (
                        <Pressable
                          key={mins}
                          onPress={() => setReminderMinutes(mins)}
                          style={[styles.presetChip, active && styles.presetChipActive]}>
                          <Text style={[styles.presetText, active && styles.presetTextActive]}>
                            {formatReminderLabel(mins)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              ) : null}

              <Text style={styles.label}>Streak counts</Text>
              <View style={styles.modeRow}>
                {(
                  [
                    { id: 'scheduled' as const, label: 'Scheduled days' },
                    { id: 'calendar' as const, label: 'Every day' },
                  ] as const
                ).map((opt) => {
                  const active = streakMode === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => setStreakMode(opt.id)}
                      style={[styles.modeChip, active && styles.modeChipActive]}>
                      <Text style={[styles.modeText, active && styles.modeTextActive]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.reminderHint}>
                {streakMode === 'scheduled'
                  ? 'Only days on this habit’s schedule keep the streak.'
                  : 'Any missed calendar day can break the streak.'}
              </Text>

              <Text style={styles.label}>Grace days</Text>
              <View style={styles.presetRow}>
                {GRACE_PRESETS.map((n) => {
                  const active = graceDays === n;
                  return (
                    <Pressable
                      key={n}
                      onPress={() => setGraceDays(n)}
                      style={[styles.presetChip, active && styles.presetChipActive]}>
                      <Text style={[styles.presetText, active && styles.presetTextActive]}>
                        {n === 0 ? 'None' : String(n)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.reminderHint}>Missed days allowed before the streak resets.</Text>
            </>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={habit ? 'Save changes' : 'Add habit'}
            onPress={() => void save()}
            disabled={!name.trim() || pending}
          />
        </View>
      </KeyboardAvoidingView>
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
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.text,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectedLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  emptyIcons: {
    ...typography.caption,
    color: colors.textMuted,
    paddingVertical: spacing.sm,
    textTransform: 'none',
    letterSpacing: 0,
  },
  moreIconsHint: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'none',
    letterSpacing: 0,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  iconChipActive: {
    backgroundColor: colors.accentSoft,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  advancedText: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  reminderTitle: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  reminderHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'none',
    letterSpacing: 0,
  },
  timeLabel: {
    ...typography.heading,
    color: colors.accentGlow,
    marginTop: spacing.xs,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeChip: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  modeChipActive: {
    backgroundColor: colors.accentSoft,
  },
  modeText: {
    ...typography.body,
    color: colors.textMuted,
  },
  modeTextActive: {
    color: colors.accent,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  presetChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
  },
  presetChipActive: {
    backgroundColor: colors.accentSoft,
  },
  presetText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  presetTextActive: {
    color: colors.accent,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
  },
});
