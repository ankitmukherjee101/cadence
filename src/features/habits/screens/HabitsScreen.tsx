import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CirclePlus from 'lucide-react-native/icons/circle-plus';
import ListTodo from 'lucide-react-native/icons/list-todo';

import type { Habit } from '@/src/domain';
import { todayLocalDate } from '@/src/domain';
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
  useStartHabitSession,
  useUnarchiveHabit,
} from '@/src/features/habits/hooks';
import { hapticSelection } from '@/src/shared/lib/haptics';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { FadeDown } from '@/src/shared/ui/motion';
import { colors, spacing, typography } from '@/src/shared/ui/tokens';
import { useUiStore } from '@/src/store/ui-store';

const ACTIVE_SESSION_HREF = '/session/active' as Href;
const TAB_BAR_BASE = 49;

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

  const createOpen = useUiStore((s) => s.createHabitOpen);
  const setCreateOpen = useUiStore((s) => s.setCreateHabitOpen);
  const editingId = useUiStore((s) => s.editingHabitId);
  const setEditingId = useUiStore((s) => s.setEditingHabitId);

  const [formOpen, setFormOpen] = useState(false);
  const [sessionHabit, setSessionHabit] = useState<Habit | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const completedIds = useMemo(
    () => new Set((logs ?? []).filter((l) => l.status === 'completed').map((l) => l.habitId)),
    [logs],
  );

  const doneCount = habits?.filter((h) => completedIds.has(h.id)).length ?? 0;
  const totalCount = habits?.length ?? 0;

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
          onPress: () => void archiveHabit.mutateAsync(habit.id),
        },
      ],
    );
  };

  const showForm = formOpen || createOpen;
  const sessionBarOffset = running ? 44 : 0;
  const listBottom = TAB_BAR_BASE + insets.bottom + sessionBarOffset + spacing.xl;

  const onStartPress = (habit: Habit) => {
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
                <Pressable onPress={() => void unarchiveHabit.mutateAsync(item.id)} hitSlop={8}>
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
                {doneCount} of {totalCount} done today
              </Text>
            ) : (
              <Text style={styles.metric}>Your practice, timed</Text>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add habit"
              onPress={openCreate}
              hitSlop={8}
              style={styles.addBtn}>
              <CirclePlus size={22} color={colors.accent} strokeWidth={1.75} />
            </Pressable>
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
            <View style={{ paddingHorizontal: spacing.lg }}>{archivedBlock}</View>
          ) : null}
        </>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: listBottom }]}
          ListFooterComponent={archivedBlock}
          renderItem={({ item }) => (
            <HabitRow
              habit={item}
              completedToday={completedIds.has(item.id)}
              disabled={startSession.isPending}
              onStartPress={() => onStartPress(item)}
              onEdit={() => openEdit(item.id)}
              onArchive={() => confirmArchive(item)}
            />
          )}
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
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metric: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },
  addBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  archivedBlock: {
    marginTop: spacing.xl,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  archivedToggle: {
    paddingVertical: spacing.sm,
  },
  archivedToggleText: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  archivedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
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
