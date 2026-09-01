import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Ellipsis from 'lucide-react-native/icons/ellipsis';

import type { Habit } from '@/src/domain';
import { hapticSelection } from '@/src/shared/lib/haptics';
import { Checkbox } from '@/src/shared/ui/Checkbox';
import { HabitIcon, TimerActionIcon } from '@/src/shared/ui/HabitIcon';
import { colors, radii, spacing, typography } from '@/src/shared/ui/tokens';

type Props = {
  habit: Habit;
  completedToday: boolean;
  scheduledToday?: boolean;
  disabled?: boolean;
  onStartPress: () => void;
  onCustomizePress: () => void;
  onEdit: () => void;
  onArchive: () => void;
};

export function HabitRow({
  habit,
  completedToday,
  scheduledToday = true,
  disabled,
  onStartPress,
  onCustomizePress,
  onEdit,
  onArchive,
}: Props) {
  const openMenu = () => {
    void hapticSelection();
    Alert.alert(habit.name, undefined, [
      { text: 'Edit', onPress: onEdit },
      { text: 'Archive', style: 'destructive', onPress: onArchive },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.row, completedToday && styles.rowDone, !scheduledToday && styles.rowRest]}>
      <Checkbox
        checked={completedToday}
        accessibilityLabel={completedToday ? `${habit.name} done today` : habit.name}
        accessibilityHint="Complete by starting a timed session"
      />
      <View style={styles.iconWrap}>
        <HabitIcon
          name={habit.icon}
          size={20}
          color={completedToday ? colors.accentMuted : colors.accent}
          strokeWidth={1.5}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={habit.name}
        onPress={onStartPress}
        onLongPress={openMenu}
        disabled={disabled}
        style={({ pressed }) => [styles.meta, pressed && styles.pressed]}>
        <Text style={[styles.name, completedToday && styles.nameDone]} numberOfLines={1}>
          {habit.name}
        </Text>
        {completedToday ? (
          <Text style={styles.sub}>Done today</Text>
        ) : !scheduledToday ? (
          <Text style={styles.sub}>Rest day</Text>
        ) : habit.category ? (
          <Text style={styles.sub} numberOfLines={1}>
            {habit.category}
          </Text>
        ) : null}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Options for ${habit.name}`}
        onPress={openMenu}
        hitSlop={8}
        style={styles.moreBtn}>
        <Ellipsis size={18} color={colors.textMuted} strokeWidth={1.5} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Timer options for ${habit.name}`}
        accessibilityHint="Choose stopwatch or pomodoro settings"
        disabled={disabled}
        onPress={() => {
          void hapticSelection();
          onCustomizePress();
        }}
        hitSlop={8}
        style={({ pressed }) => [
          styles.timerBtn,
          pressed && styles.timerBtnPressed,
          disabled && styles.disabled,
        ]}>
        <TimerActionIcon size={18} color={colors.accent} strokeWidth={1.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowDone: {
    opacity: 0.72,
  },
  rowRest: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.45,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
    gap: 2,
    paddingVertical: 2,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  nameDone: {
    color: colors.textMuted,
  },
  sub: {
    ...typography.data,
    color: colors.textMuted,
  },
  moreBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerBtnPressed: {
    backgroundColor: colors.surfaceHover,
  },
});
