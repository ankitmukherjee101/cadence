import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SectionList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CirclePlus from 'lucide-react-native/icons/circle-plus';
import ListTodo from 'lucide-react-native/icons/list-todo';
import Share from 'lucide-react-native/icons/share';

import type { Habit } from '@/src/domain';
import { isHabitRequiredOnDate, todayLocalDate } from '@/src/domain';
import { HabitFormModal } from '@/src/features/habits/components/HabitFormModal';
import { HabitRow } from '@/src/features/habits/components/HabitRow';
import {
  StartSessionSheet,
  type StartSessionChoice,
} from '@/src/features/habits/components/StartSessionSheet';
import {
  useArchiveHabit,
  useArchivedHabits,
  useHabitLogsForDate,
  useHabits,
  useRunningSession,
  useSkipHabitForToday,
  useStartHabitSession,
  useUnarchiveHabit,
  useUnskipHabitForToday,
} from '@/src/features/habits/hooks';
import { hapticSelection } from '@/src/shared/lib/haptics';
import { exportAndShareCadenceBackup } from '@/src/shared/lib/backup';
import { buildStartChoiceFromPref } from '@/src/shared/lib/quick-start';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { FadeDown } from '@/src/shared/ui/motion';
import { colors, spacing, typography } from '@/src/shared/ui/tokens';
import { useUiStore } from '@/src/store/ui-store';

const ACTIVE_SESSION_HREF = '/session/active' as Href;
const TAB_BAR_BASE = 49;
const UNCATEGORIZED_LABEL = 'Uncategorized';

type HabitSection = {
  title: string;
  data: Habit[];
};

function groupHabitsByCategory(habits: Habit[]): HabitSection[] {
  const groups = new Map<string, Habit[]>();
  for (const habit of habits) {
    const key = habit.category?.trim() || '';
    const list = groups.get(key) ?? [];
    list.push(habit);
    groups.set(key, list);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (!a) return 1;
      if (!b) return -1;
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    })
    .map(([category, data]) => ({
      title: category || UNCATEGORIZED_LABEL,
      data,
    }));
}

export function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const today = todayLocalDate();

  const { data: habits, isLoading } = useHabits();
  const { data: archived } = useArchivedHabits();
  const { data: logs } = useHabitLogsForDate(today);
  const { data: running } = useRunningSession();
  const startSession = useStartHabitSession();
  const archiveHabit = useArchiveHabit();
  const unarchiveHabit = useUnarchiveHabit();
  const skipHabit = useSkipHabitForToday();
  const unskipHabit = useUnskipHabitForToday();

  const createOpen = useUiStore((s) => s.createHabitOpen);
  const setCreateOpen = useUiStore((s) => s.setCreateHabitOpen);
  const editingId = useUiStore((s) => s.editingHabitId);
  const setEditingId = useUiStore((s) => s.setEditingHabitId);

  const [formOpen, setFormOpen] = useState(false);
  const [sessionHabit, setSessionHabit] = useState<Habit | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [exporting, setExporting] = useState(false);

  const completedIds = useMemo(
    () => new Set((logs ?? []).filter((l) => l.status === 'completed').map((l) => l.habitId)),
    [logs],
  );

  const skippedIds = useMemo(
    () => new Set((logs ?? []).filter((l) => l.status === 'skipped').map((l) => l.habitId)),
    [logs],
  );

  const dueHabits = useMemo(
    () =>
      (habits ?? []).filter((h) =>
        isHabitRequiredOnDate(today, { streak: h.streak, schedule: h.schedule }),
      ),
    [habits, today],
  );

  const doneCount = dueHabits.filter((h) => completedIds.has(h.id)).length;
  const totalCount = dueHabits.length;

  const sections = useMemo(() => groupHabitsByCategory(habits ?? []), [habits]);

  const editingHabit = habits?.find((h) => h.id === editingId) ?? null;

  const openCreate = () => {
    void hapticSelection();
    setEditingId(null);
    setFormOpen(true);
    setCreateOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setCreateOpen(false);
    setEditingId(null);
  };

  const confirmArchive = (habit: Habit) => {
    Alert.alert(
      'Archive habit?',
      `${habit.name} will be hidden from your list. History stays on device — you can restore it later.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await archiveHabit.mutateAsync(habit.id);
              } catch (err) {
                Alert.alert(
                  'Couldn’t archive',
                  err instanceof Error ? err.message : 'Unknown error',
                );
              }
            })();
          },
        },
      ],
    );
  };

  const showForm = formOpen || createOpen;
  const sessionBarOffset = running ? 44 : 0;
  const listBottom = TAB_BAR_BASE + insets.bottom + sessionBarOffset + spacing.xl;

  const onQuickStart = async (habit: Habit) => {
    if (running) {
      if (running.habitId === habit.id) {
        router.push(ACTIVE_SESSION_HREF);
        return;
      }
      Alert.alert('Session in progress', 'Stop the current session before starting another.');
      return;
    }
    try {
      void hapticSelection();
      const choice = await buildStartChoiceFromPref(habit.id);
      await startSession.mutateAsync({
        habitId: habit.id,
        mode: choice.mode,
        targetDurationMs: choice.targetDurationMs,
        notes: choice.notes,
      });
      router.push(ACTIVE_SESSION_HREF);
    } catch (err) {
      Alert.alert('Couldn’t start', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const onCustomizeStart = (habit: Habit) => {
    if (running) {
      if (running.habitId === habit.id) {
        router.push(ACTIVE_SESSION_HREF);
        return;
      }
      Alert.alert('Session in progress', 'Stop the current session before starting another.');
      return;
    }
    setSessionHabit(habit);
  };

  const confirmSkip = (habit: Habit) => {
    Alert.alert(
      'Skip today?',
      `${habit.name} will be marked skipped for today. You can still practice if you change your mind.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            void (async () => {
              try {
                await skipHabit.mutateAsync({ habitId: habit.id, date: today });
              } catch (err) {
                Alert.alert('Couldn’t skip', err instanceof Error ? err.message : 'Unknown error');
              }
            })();
          },
        },
      ],
    );
  };

  const onUnskip = (habit: Habit) => {
    void (async () => {
      try {
        await unskipHabit.mutateAsync({ habitId: habit.id, date: today });
      } catch (err) {
        Alert.alert('Couldn’t unskip', err instanceof Error ? err.message : 'Unknown error');
      }
    })();
  };

  const onExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportAndShareCadenceBackup();
    } catch (err) {
      Alert.alert('Export failed', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setExporting(false);
    }
  };

  const onConfirmStart = async (choice: StartSessionChoice) => {
    if (!sessionHabit) return;
    try {
      await startSession.mutateAsync({
        habitId: sessionHabit.id,
        mode: choice.mode,
        targetDurationMs: choice.targetDurationMs,
        notes: choice.notes,
      });
      setSessionHabit(null);
      router.push(ACTIVE_SESSION_HREF);
    } catch (err) {
      Alert.alert('Couldn’t start', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const archivedBlock =
    archived?.length ? (
      <View style={styles.archivedBlock}>
        <Pressable onPress={() => setShowArchived((v) => !v)} style={styles.archivedToggle}>
          <Text style={styles.archivedToggleText}>
            {showArchived ? 'Hide' : 'Show'} archived ({archived.length})
          </Text>
        </Pressable>
        {showArchived
          ? archived.map((item) => (
              <View key={item.id} style={styles.archivedRow}>
                <Text style={styles.archivedName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Pressable
                  onPress={() => {
                    void (async () => {
                      try {
                        await unarchiveHabit.mutateAsync(item.id);
                      } catch (err) {
                        Alert.alert(
                          'Couldn’t restore',
                          err instanceof Error ? err.message : 'Unknown error',
                        );
                      }
                    })();
                  }}
                  hitSlop={8}>
                  <Text style={styles.restore}>Restore</Text>
                </Pressable>
              </View>
            ))
          : null}
      </View>
    ) : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <FadeDown>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {totalCount > 0 ? (
              <Text style={styles.metric}>
                {doneCount} of {totalCount} due today
              </Text>
            ) : (
              <Text style={styles.metric}>Your practice, timed</Text>
            )}
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Export backup"
                onPress={() => void onExport()}
                disabled={exporting}
                hitSlop={8}
                style={styles.iconBtn}>
                <Share size={20} color={colors.accent} strokeWidth={1.5} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add habit"
                onPress={openCreate}
                hitSlop={8}
                style={styles.iconBtn}>
                <CirclePlus size={22} color={colors.accent} strokeWidth={1.5} />
              </Pressable>
            </View>
          </View>
        </View>
      </FadeDown>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.accent} />
      ) : !habits?.length ? (
        <>
          <EmptyState
            icon={ListTodo}
            title="No habits yet"
            body="Add a habit, then start a timed session. Ending a session marks it done for today."
          />
          {archivedBlock ? (
            <View style={{ paddingHorizontal: spacing.container }}>{archivedBlock}</View>
          ) : null}
        </>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: listBottom }]}
          ListFooterComponent={archivedBlock}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) =>
            sections.length > 1 || section.title !== UNCATEGORIZED_LABEL ? (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            ) : null
          }
          renderItem={({ item }) => {
            const scheduledToday = isHabitRequiredOnDate(today, {
              streak: item.streak,
              schedule: item.schedule,
            });
            return (
            <HabitRow
              habit={item}
              completedToday={completedIds.has(item.id)}
              skippedToday={skippedIds.has(item.id)}
              scheduledToday={scheduledToday}
              disabled={startSession.isPending}
              onStartPress={() => void onQuickStart(item)}
              onCustomizePress={() => onCustomizeStart(item)}
              onSkipToday={() => confirmSkip(item)}
              onUnskipToday={() => onUnskip(item)}
              onEdit={() => openEdit(item.id)}
              onArchive={() => confirmArchive(item)}
            />
            );
          }}
        />
      )}

      <HabitFormModal visible={showForm} onClose={closeForm} habit={editingHabit} />
      <StartSessionSheet
        visible={Boolean(sessionHabit)}
        habit={sessionHabit}
        pending={startSession.isPending}
        onClose={() => setSessionHabit(null)}
        onStart={(choice) => void onConfirmStart(choice)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.container,
    marginBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metric: {
    ...typography.data,
    color: colors.textMuted,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: spacing.container,
  },
  sectionHeader: {
    ...typography.labelSm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  archivedBlock: {
    marginTop: spacing.section,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  archivedToggle: {
    paddingVertical: spacing.sm,
  },
  archivedToggleText: {
    ...typography.labelSm,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  archivedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  archivedName: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },
  restore: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
});
