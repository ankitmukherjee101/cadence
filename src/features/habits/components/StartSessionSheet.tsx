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
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronUp from 'lucide-react-native/icons/chevron-up';

import {
  DEFAULT_POMODORO_CONFIG,
  encodePomodoroNotes,
  type Habit,
  type PomodoroConfig,
  type TimerMode,
} from '@/src/domain';
import { hapticSelection } from '@/src/shared/lib/haptics';
import { getHabitSessionPref, setHabitSessionPref } from '@/src/shared/lib/session-prefs';
import { Button } from '@/src/shared/ui/Button';
import { HabitIcon } from '@/src/shared/ui/HabitIcon';
import { colors, radii, spacing, typography } from '@/src/shared/ui/tokens';

const FOCUS_PRESETS = [15, 20, 25, 30, 45, 50, 60, 90] as const;
const BREAK_PRESETS = [3, 5, 10, 15] as const;
const LONG_BREAK_PRESETS = [10, 15, 20, 30] as const;
const ROUND_PRESETS = [2, 3, 4, 5, 6, 8] as const;

export type StartSessionChoice = {
  mode: TimerMode;
  targetDurationMs?: number;
  notes?: string;
};

type Props = {
  visible: boolean;
  habit: Habit | null;
  pending?: boolean;
  onClose: () => void;
  onStart: (choice: StartSessionChoice) => void;
};

function clampInt(value: string, min: number, max: number, fallback: number): number {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  presets,
  unit = 'min',
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  presets: readonly number[];
  unit?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepperRow}>
        <Pressable
          accessibilityLabel={`Decrease ${label}`}
          onPress={() => onChange(Math.max(min, value - 1))}
          style={styles.stepBtn}>
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>
        <TextInput
          value={String(value)}
          onChangeText={(t) => onChange(clampInt(t, min, max, value))}
          keyboardType="number-pad"
          style={styles.stepInput}
        />
        <Text style={styles.unit}>{unit}</Text>
        <Pressable
          accessibilityLabel={`Increase ${label}`}
          onPress={() => onChange(Math.min(max, value + 1))}
          style={styles.stepBtn}>
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
      </View>
      <View style={styles.presetRow}>
        {presets.map((p) => {
          const active = value === p;
          return (
            <Pressable
              key={p}
              onPress={() => onChange(p)}
              style={[styles.presetChip, active && styles.presetChipActive]}>
              <Text style={[styles.presetText, active && styles.presetTextActive]}>{p}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function StartSessionSheet({ visible, habit, pending, onClose, onStart }: Props) {
  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [pomodoro, setPomodoro] = useState<PomodoroConfig>(DEFAULT_POMODORO_CONFIG);
  const [customize, setCustomize] = useState(false);

  useEffect(() => {
    if (!visible || !habit) return;
    let cancelled = false;
    void (async () => {
      const pref = await getHabitSessionPref(habit.id);
      if (cancelled) return;
      setMode(pref.mode);
      setPomodoro(pref.pomodoro);
      setCustomize(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, habit?.id]);

  const patch = (partial: Partial<PomodoroConfig>) =>
    setPomodoro((prev) => ({ ...prev, ...partial }));

  const start = () => {
    if (!habit) return;
    void hapticSelection();
    void setHabitSessionPref(habit.id, { mode, pomodoro });
    if (mode === 'stopwatch') {
      onStart({ mode: 'stopwatch' });
      return;
    }
    const phaseStartedAt = new Date().toISOString();
    onStart({
      mode: 'pomodoro',
      targetDurationMs: pomodoro.focusMinutes * 60_000,
      notes: encodePomodoroNotes({
        config: pomodoro,
        phase: 'focus',
        round: 1,
        phaseStartedAt,
      }),
    });
  };

  const summary = `${pomodoro.focusMinutes} · ${pomodoro.shortBreakMinutes} · ${pomodoro.longBreakMinutes} · ${pomodoro.rounds}`;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {habit ? <HabitIcon name={habit.icon} size={22} color={colors.accent} /> : null}
            <Text style={styles.title} numberOfLines={1}>
              {habit?.name ?? 'Start session'}
            </Text>
          </View>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>How do you want to track?</Text>
          <View style={styles.modeRow}>
            {([
              { id: 'stopwatch' as const, title: 'Stopwatch', hint: 'Open-ended' },
              { id: 'pomodoro' as const, title: 'Pomodoro', hint: `${pomodoro.focusMinutes}m focus` },
            ]).map((m) => {
              const active = mode === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => {
                    void hapticSelection();
                    setMode(m.id);
                  }}
                  style={[styles.modeCard, active && styles.modeCardActive]}>
                  <Text style={[styles.modeTitle, active && styles.modeTitleActive]}>{m.title}</Text>
                  <Text style={styles.modeHint}>{m.hint}</Text>
                </Pressable>
              );
            })}
          </View>

          {mode === 'pomodoro' ? (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summary}>{summary}</Text>
                <Text style={styles.summaryUnit}>focus · short · long · rounds</Text>
              </View>
              <Pressable
                onPress={() => setCustomize((v) => !v)}
                style={styles.customizeToggle}
                accessibilityRole="button">
                <Text style={styles.customizeText}>
                  {customize ? 'Hide customize' : 'Customize'}
                </Text>
                {customize ? (
                  <ChevronUp size={16} color={colors.accent} />
                ) : (
                  <ChevronDown size={16} color={colors.accent} />
                )}
              </Pressable>
              {customize ? (
                <>
                  <Stepper
                    label="Focus"
                    value={pomodoro.focusMinutes}
                    onChange={(focusMinutes) => patch({ focusMinutes })}
                    min={1}
                    max={180}
                    presets={FOCUS_PRESETS}
                  />
                  <Stepper
                    label="Short break"
                    value={pomodoro.shortBreakMinutes}
                    onChange={(shortBreakMinutes) => patch({ shortBreakMinutes })}
                    min={1}
                    max={60}
                    presets={BREAK_PRESETS}
                  />
                  <Stepper
                    label="Long break"
                    value={pomodoro.longBreakMinutes}
                    onChange={(longBreakMinutes) => patch({ longBreakMinutes })}
                    min={1}
                    max={90}
                    presets={LONG_BREAK_PRESETS}
                  />
                  <Stepper
                    label="Rounds until long break"
                    value={pomodoro.rounds}
                    onChange={(rounds) => patch({ rounds })}
                    min={1}
                    max={12}
                    presets={ROUND_PRESETS}
                    unit="×"
                  />
                </>
              ) : null}
            </>
          ) : (
            <Text style={styles.sectionHint}>Counts up until you stop. Good for open-ended work.</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={mode === 'pomodoro' ? `Start ${pomodoro.focusMinutes}m focus` : 'Start stopwatch'}
            onPress={start}
            disabled={!habit || pending}
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
    gap: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  title: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
    flex: 1,
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
  sectionHint: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeCard: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  modeCardActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  modeTitle: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
  modeTitleActive: {
    color: colors.accentGlow,
  },
  modeHint: {
    ...typography.data,
    color: colors.textMuted,
  },
  summaryRow: {
    marginTop: spacing.lg,
    gap: 4,
  },
  summary: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  summaryUnit: {
    ...typography.data,
    color: colors.textMuted,
  },
  customizeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  customizeText: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  field: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 22,
    color: colors.accentGlow,
    fontWeight: '500',
    lineHeight: 26,
  },
  stepInput: {
    minWidth: 64,
    textAlign: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  unit: {
    ...typography.data,
    color: colors.textMuted,
    width: 28,
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
    padding: spacing.container,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
