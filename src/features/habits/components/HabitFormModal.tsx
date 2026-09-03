import { useEffect, useMemo, useRef, useState } from 'react';
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
  Alert,
  type ScrollView as ScrollViewType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronUp from 'lucide-react-native/icons/chevron-up';

import type { Habit, HabitIconId, HabitSchedule, StreakMode, StreakSettings } from '@/src/domain';
import { DEFAULT_STREAK_SETTINGS } from '@/src/domain';
import { HabitIconPickerSheet } from '@/src/features/habits/components/HabitIconPickerSheet';
import { useCreateHabit, useHabits, useUpdateHabit } from '@/src/features/habits/hooks';
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

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;
const WEEKDAY_DEFAULT = [1, 2, 3, 4, 5] as const;

const WEEKDAY_OPTIONS = [
  { dow: 0, label: 'Sun' },
  { dow: 1, label: 'Mon' },
  { dow: 2, label: 'Tue' },
  { dow: 3, label: 'Wed' },
  { dow: 4, label: 'Thu' },
  { dow: 5, label: 'Fri' },
  { dow: 6, label: 'Sat' },
] as const;

/** Popular icons shown inline on the form — full set lives in the picker sheet. */
const CURATED_ICON_IDS: HabitIconId[] = [
  'sparkles',
  'focus',
  'book-open',
  'brain',
  'wind',
  'dumbbell',
  'footprints',
  'pen-line',
  'moon',
  'coffee',
  'heart-pulse',
  'terminal',
  'music',
  'sun',
  'leaf',
  'target',
];

function isAllDays(days: number[]): boolean {
  return days.length === 7 && ALL_DAYS.every((d) => days.includes(d));
}

function scheduleDaysFromHabit(habit?: Habit | null): number[] {
  if (!habit) return [...ALL_DAYS];
  if (habit.schedule.kind === 'weekly') {
    return [...habit.schedule.daysOfWeek].sort((a, b) => a - b);
  }
  return [...ALL_DAYS];
}

function formatScheduleSummary(days: number[]): string {
  if (isAllDays(days)) return 'Every day';
  const labels = WEEKDAY_OPTIONS.filter((w) => days.includes(w.dow)).map((w) => w.label);
  return labels.join(' · ');
}

function formatGraceSummary(graceDays: number): string {
  if (graceDays === 0) return 'No grace';
  return graceDays === 1 ? '1 grace day' : `${graceDays} grace days`;
}

function formatStreakSummary(days: number[], graceDays: number): string {
  return `${formatScheduleSummary(days)} · ${formatGraceSummary(graceDays)}`;
}

function hasCustomStreakSettings(days: number[], graceDays: number): boolean {
  return graceDays > 0 || !isAllDays(days);
}

export function HabitFormModal({ visible, onClose, habit }: Props) {
  const insets = useSafeAreaInsets();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const { data: habits } = useHabits();
  const scrollRef = useRef<ScrollViewType>(null);
  const streakSectionY = useRef(0);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<HabitIconId>('sparkles');
  const [category, setCategory] = useState('');
  const [categoryFocused, setCategoryFocused] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [reminderOn, setReminderOn] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(9 * 60);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([...ALL_DAYS]);
  const [graceDays, setGraceDays] = useState(DEFAULT_STREAK_SETTINGS.graceDays);
  const [streakOpen, setStreakOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const days = habit ? scheduleDaysFromHabit(habit) : [...ALL_DAYS];
    const grace = habit?.streak.graceDays ?? DEFAULT_STREAK_SETTINGS.graceDays;

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
      setDaysOfWeek(days);
      setGraceDays(grace);
    } else {
      setName('');
      setIcon('sparkles');
      setCategory('');
      setReminderOn(false);
      setReminderMinutes(9 * 60);
      setDaysOfWeek([...ALL_DAYS]);
      setGraceDays(DEFAULT_STREAK_SETTINGS.graceDays);
    }
    setCategoryFocused(false);
    setIconPickerOpen(false);
    setStreakOpen(hasCustomStreakSettings(days, grace));
  }, [visible, habit]);

  const existingCategories = useMemo(() => {
    const set = new Set<string>();
    for (const h of habits ?? []) {
      const c = h.category?.trim();
      if (c) set.add(c);
    }
    return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [habits]);

  const suggestedCategories = useMemo(() => {
    const q = category.trim().toLowerCase();
    if (!q) return existingCategories;
    return existingCategories.filter((c) => c.toLowerCase().includes(q));
  }, [category, existingCategories]);

  const curatedIcons = useMemo(() => {
    const byId = new Map(HABIT_ICON_OPTIONS.map((item) => [item.id, item]));
    const curated = CURATED_ICON_IDS.map((id) => byId.get(id)).filter(Boolean) as typeof HABIT_ICON_OPTIONS;
    if (!curated.some((item) => item.id === icon)) {
      const selected = byId.get(icon);
      if (selected) curated.unshift(selected);
    }
    return curated.slice(0, CURATED_ICON_IDS.length + 1);
  }, [icon]);

  const streakMode: StreakMode = isAllDays(daysOfWeek) ? 'calendar' : 'scheduled';
  const streakSummary = formatStreakSummary(daysOfWeek, graceDays);

  const toggleDay = (dow: number) => {
    setDaysOfWeek((prev) => {
      if (prev.includes(dow)) {
        if (prev.length <= 1) return prev;
        return prev.filter((d) => d !== dow).sort((a, b) => a - b);
      }
      return [...prev, dow].sort((a, b) => a - b);
    });
  };

  const selectEveryDay = () => setDaysOfWeek([...ALL_DAYS]);

  const selectScheduledDays = () => {
    setDaysOfWeek((prev) => (isAllDays(prev) ? [...WEEKDAY_DEFAULT] : prev));
  };

  const toggleStreakSection = () => {
    setStreakOpen((open) => {
      const next = !open;
      if (next) {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ y: streakSectionY.current, animated: true });
        });
      }
      return next;
    });
  };

  const buildSchedule = (): HabitSchedule => {
    const reminder = reminderOn ? reminderMinutes : null;
    if (isAllDays(daysOfWeek)) {
      return { kind: 'daily', reminderMinutes: reminder };
    }
    return {
      kind: 'weekly',
      daysOfWeek: [...daysOfWeek].sort((a, b) => a - b),
      reminderMinutes: reminder,
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

    try {
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
    } catch (err) {
      Alert.alert('Couldn’t save', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const pending = createHabit.isPending || updateHabit.isPending;
  const selectedLabel = HABIT_ICON_OPTIONS.find((i) => i.id === icon)?.label ?? icon;

  return (
    <>
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <KeyboardAvoidingView
          style={[styles.container, { paddingTop: insets.top }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <Text style={styles.title}>{habit ? 'Edit habit' : 'New habit'}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Deep work"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />

            <Text style={styles.label}>Icon</Text>
            <Pressable
              onPress={() => setIconPickerOpen(true)}
              style={styles.iconPreview}
              accessibilityRole="button"
              accessibilityLabel="Browse all icons">
              <View style={[styles.iconChip, styles.iconChipActive]}>
                <HabitIcon name={icon} size={24} color={colors.accent} />
              </View>
              <View style={styles.iconPreviewText}>
                <Text style={styles.selectedLabel} numberOfLines={1}>
                  {selectedLabel}
                </Text>
                <Text style={styles.browseLink}>Browse all icons</Text>
              </View>
            </Pressable>
            <View style={styles.iconRow}>
              {curatedIcons.map((item) => {
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

            <Text style={styles.label}>Category (optional)</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              onFocus={() => setCategoryFocused(true)}
              onBlur={() => setCategoryFocused(false)}
              placeholder="e.g. Focus"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            {existingCategories.length > 0 ? (
              <View style={styles.categoryRow}>
                {(categoryFocused || category.length > 0 ? suggestedCategories : existingCategories).map(
                  (item) => {
                    const active = category.trim().toLowerCase() === item.toLowerCase();
                    return (
                      <Pressable
                        key={item}
                        onPress={() => setCategory(item)}
                        style={[styles.categoryChip, active && styles.categoryChipActive]}>
                        <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                          {item}
                        </Text>
                      </Pressable>
                    );
                  },
                )}
              </View>
            ) : null}

            <View style={styles.sectionDivider} />

            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.weekdayRow}>
              {WEEKDAY_OPTIONS.map(({ dow, label }) => {
                const active = daysOfWeek.includes(dow);
                return (
                  <Pressable
                    key={dow}
                    onPress={() => toggleDay(dow)}
                    style={[styles.weekdayChip, active && styles.weekdayChipActive]}>
                    <Text style={[styles.weekdayText, active && styles.weekdayTextActive]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.reminderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderTitle}>
                  {isAllDays(daysOfWeek) ? 'Daily reminder' : 'Weekly reminder'}
                </Text>
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

            <View style={styles.sectionDivider} />

            <Pressable
              onPress={toggleStreakSection}
              style={styles.collapseHeader}
              accessibilityRole="button"
              accessibilityState={{ expanded: streakOpen }}
              onLayout={(e) => {
                streakSectionY.current = e.nativeEvent.layout.y;
              }}>
              <View style={styles.collapseHeaderText}>
                <Text style={styles.sectionTitle}>Streak options</Text>
                {!streakOpen ? (
                  <Text style={styles.collapseSummary} numberOfLines={1}>
                    {streakSummary}
                  </Text>
                ) : null}
              </View>
              {streakOpen ? (
                <ChevronUp size={18} color={colors.accent} />
              ) : (
                <ChevronDown size={18} color={colors.accent} />
              )}
            </Pressable>

            {streakOpen ? (
              <>
                <Text style={styles.label}>Streak counts</Text>
                <View style={styles.modeRow}>
                  {(
                    [
                      { id: 'scheduled' as const, label: 'Scheduled days', onPress: selectScheduledDays },
                      { id: 'calendar' as const, label: 'Every day', onPress: selectEveryDay },
                    ] as const
                  ).map((opt) => {
                    const active = streakMode === opt.id;
                    return (
                      <Pressable
                        key={opt.id}
                        onPress={opt.onPress}
                        style={[styles.modeChip, active && styles.modeChipActive]}>
                        <Text style={[styles.modeText, active && styles.modeTextActive]}>{opt.label}</Text>
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

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.container }]}>
            <Button
              label={habit ? 'Save changes' : 'Add habit'}
              onPress={() => void save()}
              disabled={!name.trim() || pending}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <HabitIconPickerSheet
        visible={iconPickerOpen}
        selected={icon}
        onSelect={setIcon}
        onClose={() => setIconPickerOpen(false)}
      />
    </>
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
    paddingTop: spacing.md,
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
  label: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: colors.text,
    marginTop: spacing.sm,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.text,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  categoryChipText: {
    ...typography.data,
    color: colors.textMuted,
  },
  categoryChipTextActive: {
    color: colors.accent,
  },
  iconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  iconPreviewText: {
    flex: 1,
    gap: 2,
  },
  browseLink: {
    ...typography.data,
    color: colors.accent,
  },
  weekdayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  weekdayChip: {
    minWidth: 44,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  weekdayChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  weekdayText: {
    ...typography.data,
    color: colors.textMuted,
  },
  weekdayTextActive: {
    color: colors.accent,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  selectedLabel: {
    ...typography.bodyMedium,
    color: colors.text,
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  collapseHeaderText: {
    flex: 1,
    gap: 2,
  },
  collapseSummary: {
    ...typography.data,
    color: colors.textMuted,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  reminderTitle: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  reminderHint: {
    ...typography.data,
    color: colors.textMuted,
    marginTop: 2,
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
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modeChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
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
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetChipActive: {
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
  footer: {
    paddingHorizontal: spacing.container,
    paddingTop: spacing.container,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
