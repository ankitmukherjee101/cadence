import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, spacing, typography } from './tokens';

export type ActionSheetItem = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  actions: ActionSheetItem[];
  cancelLabel?: string;
  onClose: () => void;
};

export function ActionSheet({
  visible,
  title,
  message,
  actions,
  cancelLabel = 'Cancel',
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
      />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <View style={styles.actions}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              onPress={() => {
                onClose();
                action.onPress();
              }}
              style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
              <Text style={[styles.actionText, action.destructive && styles.destructive]}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={({ pressed }) => [styles.action, styles.cancel, pressed && styles.actionPressed]}>
          <Text style={styles.cancelText}>{cancelLabel}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingHorizontal: spacing.container,
    paddingTop: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.xs,
  },
  action: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionText: {
    ...typography.bodyMedium,
    color: colors.text,
    textAlign: 'center',
  },
  destructive: {
    color: colors.danger,
  },
  cancel: {
    backgroundColor: colors.surface,
  },
  cancelText: {
    ...typography.bodyMedium,
    color: colors.accent,
    textAlign: 'center',
  },
});
