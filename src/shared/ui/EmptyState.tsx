import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/src/shared/ui/tokens';

type Props = {
  title: string;
  body: string;
  icon?: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};

export function EmptyState({ title, body, icon: Icon }: Props) {
  return (
    <View style={styles.empty}>
      {Icon ? (
        <View style={styles.glyph}>
          <Icon size={28} color={colors.accentMuted} strokeWidth={1.5} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  glyph: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 24,
    maxWidth: 320,
  },
});
