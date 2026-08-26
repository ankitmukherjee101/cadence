import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Ellipsis from 'lucide-react-native/icons/ellipsis';

import type { Habit } from '@/src/domain';
import { hapticSelection } from '@/src/shared/lib/haptics';
import { HabitIcon, TimerActionIcon } from '@/src/shared/ui/HabitIcon';
import { colors, radii, spacing, typography } from '@/src/shared/ui/tokens';

type Props = {
  habit: Habit;
  completedToday: boolean;
  disabled?: boolean;
  onStartPress: () => void;
  onEdit: () => void;
  onArchive: () => void;
};

export function HabitRow({
  habit,
  completedToday,
  disabled,
  onStartPress,
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
    <View style={[styles.row, completedToday && styles.rowDone]}>
      <View style={styles.iconWrap}>
        <HabitIcon
          name={habit.icon}
          size={22}
          color={completedToday ? colors.accentMuted : colors.accent}
          strokeWidth={1.75}
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
        <Ellipsis size={18} color={colors.textMuted} strokeWidth={2} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Track time for ${habit.name}`}
        disabled={disabled}
        onPress={() => {
          void hapticSelection();
          onStartPress();
        }}
        hitSlop={8}
        style={({ pressed }) => [
          styles.timerBtn,
          pressed && styles.timerBtnPressed,
          disabled && styles.disabled,
        ]}>
        <TimerActionIcon size={20} color={colors.accentGlow} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  rowDone: {
    opacity: 0.72,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.45,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
    gap: 2,
    paddingVertical: 4,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  nameDone: {
    color: colors.textMuted,
  },
  sub: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 0.2,
    textTransform: 'none',
    fontFamily: typography.caption.fontFamily,
  },
  moreBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  timerBtnPressed: {
    backgroundColor: colors.surfaceElevated,
  },
});
