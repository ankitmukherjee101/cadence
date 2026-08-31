import { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChartNoAxesColumn from 'lucide-react-native/icons/chart-no-axes-column';

import {
  addDays,
  eachLocalDate,
  formatDurationShort,
  startOfWeekMonday,
  todayLocalDate,
} from '@/src/domain';
import { useHabitAnalytics, useHabits } from '@/src/features/habits/hooks';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { HabitIcon } from '@/src/shared/ui/HabitIcon';
import { FadeDown } from '@/src/shared/ui/motion';
import { colors, fonts, radii, spacing, typography } from '@/src/shared/ui/tokens';
import { useUiStore } from '@/src/store/ui-store';

const CELL_EMPTY = colors.surfaceHover;
const CELL_ACTIVE = colors.accent;

function WeekStrip({
  dayMinutes,
}: {
  dayMinutes: { date: string; totalMs: number }[];
}) {
  const today = todayLocalDate();
  const weekStart = startOfWeekMonday(today);
  const days = eachLocalDate(weekStart, addDays(weekStart, 6));
  const byDate = useMemo(() => new Map(dayMinutes.map((d) => [d.date, d.totalMs])), [dayMinutes]);
  const maxMs = Math.max(1, ...days.map((d) => byDate.get(d) ?? 0));
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={styles.weekStrip}>
      {days.map((date, i) => {
        const ms = byDate.get(date) ?? 0;
        const height = ms > 0 ? 8 + (ms / maxMs) * 40 : 4;
        const isToday = date === today;
        return (
          <View key={date} style={styles.weekCol}>
            <View style={styles.weekBarTrack}>
              <View
                style={[
                  styles.weekBar,
                  {
                    height,
                    backgroundColor: isToday ? colors.accent : colors.accentMuted,
                    opacity: ms > 0 ? 1 : 0.25,
                  },
                ]}
              />
            </View>
            <Text style={[styles.weekLabel, isToday && styles.weekLabelToday]}>{labels[i]}</Text>
          </View>
        );
      })}
    </View>
  );
}

function ContributionGraph({
  dayMinutes,
}: {
  dayMinutes: { date: string; totalMs: number }[];
}) {
  const today = todayLocalDate();
  const from = addDays(startOfWeekMonday(today), -51 * 7);
  const dates = eachLocalDate(from, today);
  const byDate = useMemo(() => {
    const map = new Map(dayMinutes.map((d) => [d.date, d.totalMs]));
    return map;
  }, [dayMinutes]);

  const cells: { date: string | null; ms: number }[] = [];
  for (const date of dates) {
    cells.push({ date, ms: byDate.get(date) ?? 0 });
  }
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let i = 0; i < trailing; i++) cells.push({ date: null, ms: 0 });

  const weeks: { date: string | null; ms: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <View>
      <View style={styles.graphRow}>
        <View style={styles.dowLabels}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <Text key={`${d}-${i}`} style={styles.dowLabel}>
              {d}
            </Text>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.graph}>
            {weeks.map((week, wi) => (
              <View key={wi} style={styles.weekColHeat}>
                {week.map((cell, di) => (
                  <View
                    key={cell.date ?? `p-${wi}-${di}`}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: cell.date
                          ? cell.ms > 0
                            ? CELL_ACTIVE
                            : CELL_EMPTY
                          : 'transparent',
                      },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>No practice</Text>
        <View style={[styles.legendCell, { backgroundColor: CELL_EMPTY }]} />
        <View style={[styles.legendCell, { backgroundColor: CELL_ACTIVE }]} />
        <Text style={styles.legendText}>Practiced</Text>
      </View>
    </View>
  );
}

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const selectedId = useUiStore((s) => s.selectedAnalyticsHabitId);
  const setSelectedId = useUiStore((s) => s.setSelectedAnalyticsHabitId);

  useEffect(() => {
    if (!habits?.length) return;
    if (!selectedId || !habits.some((h) => h.id === selectedId)) {
      setSelectedId(habits[0].id);
    }
  }, [habits, selectedId, setSelectedId]);

  const habitId = selectedId ?? habits?.[0]?.id ?? null;
  const selected = habits?.find((h) => h.id === habitId) ?? null;
  const { data: analytics, isLoading: analyticsLoading } = useHabitAnalytics(habitId);

  const heroValue = analytics
    ? analytics.currentStreak > 0
      ? `${analytics.currentStreak}d`
      : analytics.totalMsToday > 0
        ? formatDurationShort(analytics.totalMsToday)
        : formatDurationShort(analytics.totalMsWeek)
    : '—';
  const heroLabel = analytics
    ? analytics.currentStreak > 0
      ? 'Current streak'
      : analytics.totalMsToday > 0
        ? 'Today'
        : 'This week'
    : '';

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <FadeDown>
        <Text style={styles.brand}>Analytics</Text>
        <Text style={styles.subtitle}>Patterns over time</Text>
      </FadeDown>

      {habitsLoading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
      ) : !habits?.length ? (
        <EmptyState
          icon={ChartNoAxesColumn}
          title="Nothing to analyze yet"
          body="Add a habit and finish a timed session. Patterns and streaks show up here."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}>
            {habits.map((habit) => {
              const active = habit.id === habitId;
              return (
                <Pressable
                  key={habit.id}
                  onPress={() => setSelectedId(habit.id)}
                  style={[styles.chip, active && styles.chipActive]}>
                  <HabitIcon
                    name={habit.icon}
                    size={16}
                    color={active ? colors.accent : colors.textMuted}
                  />
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {habit.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {selected ? (
            <View style={styles.sectionTitleRow}>
              <HabitIcon name={selected.icon} size={20} color={colors.accent} />
              <Text style={styles.sectionTitle}>{selected.name}</Text>
            </View>
          ) : null}

          {analyticsLoading || !analytics ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.lg }} />
          ) : (
            <>
              <View style={styles.hero}>
                <Text style={styles.heroValue}>{heroValue}</Text>
                <Text style={styles.heroLabel}>{heroLabel}</Text>
              </View>

              <Text style={styles.sectionLabel}>Today</Text>
              <View style={styles.todayCard}>
                <Text style={styles.todayValue}>
                  {analytics.totalMsToday > 0
                    ? formatDurationShort(analytics.totalMsToday)
                    : '—'}
                </Text>
                <Text style={styles.todayHint}>
                  {analytics.totalMsToday > 0 ? 'Practiced today' : 'No practice yet today'}
                </Text>
              </View>

              <Text style={styles.sectionLabel}>This week</Text>
              <WeekStrip dayMinutes={analytics.dayMinutes} />

              <Text style={styles.sectionLabel}>Last 52 weeks</Text>
              <ContributionGraph dayMinutes={analytics.dayMinutes} />

              <View style={styles.stats}>
                <Stat label="Today" value={formatDurationShort(analytics.totalMsToday)} />
                <Stat label="This week" value={formatDurationShort(analytics.totalMsWeek)} />
                <Stat label="30 days" value={formatDurationShort(analytics.totalMsMonth)} />
                <Stat label="All time" value={formatDurationShort(analytics.totalMsAll)} />
                <Stat label="Sessions" value={String(analytics.sessionCount)} />
                <Stat
                  label="Avg session"
                  value={
                    analytics.sessionCount
                      ? formatDurationShort(analytics.averageSessionMs)
                      : '—'
                  }
                />
                <Stat label="Streak" value={`${analytics.currentStreak}d`} />
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  brand: {
    ...typography.brand,
    color: colors.text,
    paddingHorizontal: spacing.container,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    paddingHorizontal: spacing.container,
    marginBottom: spacing.lg,
    marginTop: 4,
  },
  content: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  chips: {
    paddingHorizontal: spacing.container,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    ...typography.body,
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.accent,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.container,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  hero: {
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.md,
    gap: 4,
  },
  heroValue: {
    fontFamily: fonts.mono,
    fontSize: 48,
    color: colors.accentGlow,
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  heroLabel: {
    ...typography.labelSm,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  todayCard: {
    marginHorizontal: spacing.container,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  todayValue: {
    fontFamily: fonts.mono,
    fontSize: 28,
    color: colors.accentGlow,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  todayHint: {
    ...typography.data,
    color: colors.textMuted,
  },
  sectionLabel: {
    ...typography.labelSm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.container,
    marginTop: spacing.section - spacing.md,
  },
  weekStrip: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.container,
    height: 72,
    gap: 6,
  },
  weekCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  weekBarTrack: {
    height: 52,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  weekBar: {
    width: '70%',
    maxWidth: 28,
    borderRadius: 0,
    minHeight: 2,
  },
  weekLabel: {
    ...typography.labelSm,
    color: colors.textMuted,
    fontSize: 11,
  },
  weekLabelToday: {
    color: colors.accent,
  },
  graphRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: spacing.container,
    gap: spacing.xs,
  },
  dowLabels: {
    gap: 3,
    paddingTop: spacing.sm,
    width: 14,
  },
  dowLabel: {
    height: 12,
    fontSize: 9,
    lineHeight: 12,
    color: colors.textMuted,
    fontFamily: fonts.geistMedium,
  },
  graph: {
    flexDirection: 'row',
    gap: 3,
    paddingRight: spacing.container,
    paddingVertical: spacing.sm,
  },
  weekColHeat: {
    gap: 3,
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: radii.xs,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.container,
    marginTop: spacing.xs,
  },
  legendText: {
    ...typography.labelSm,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: radii.xs,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.container,
    gap: spacing.md,
    marginTop: spacing.section,
  },
  stat: {
    width: '30%',
    minWidth: 96,
    gap: 2,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    ...typography.data,
    color: colors.text,
    fontSize: 17,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.textMuted,
    letterSpacing: 0,
  },
});
