import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii } from './tokens';

type Props = {
  checked: boolean;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  size?: number;
};

/** Technical checkbox — 16px square, champagne border + centered 4px dot when active. */
export function Checkbox({
  checked,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  size = 16,
}: Props) {
  const dot = Math.max(4, Math.round(size * 0.25));

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      disabled={disabled || !onPress}
      onPress={onPress}
      hitSlop={8}
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: radii.xs,
          borderColor: checked ? colors.accent : colors.border,
        },
      ]}>
      {checked ? (
        <View
          style={[
            styles.dot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: colors.accent,
            },
          ]}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {},
});
