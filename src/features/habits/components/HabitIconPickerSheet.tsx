import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { HabitIconId } from '@/src/domain';
import { HABIT_ICON_OPTIONS, HabitIcon } from '@/src/shared/ui/HabitIcon';
import { colors, radii, spacing, typography } from '@/src/shared/ui/tokens';

type Props = {
  visible: boolean;
  selected: HabitIconId;
  onSelect: (id: HabitIconId) => void;
  onClose: () => void;
};

export function HabitIconPickerSheet({ visible, selected, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) setQuery('');
  }, [visible]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HABIT_ICON_OPTIONS;
    return HABIT_ICON_OPTIONS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.id.replace(/-/g, ' ').includes(q),
    );
  }, [query]);

  const pick = (id: HabitIconId) => {
    onSelect(id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose icon</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search icons…"
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            style={styles.search}
          />
        </View>

        <ScrollView
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + spacing.lg }]}
          keyboardShouldPersistTaps="handled">
          {filtered.length === 0 ? (
            <Text style={styles.empty}>No icons match “{query.trim()}”</Text>
          ) : (
            filtered.map((item) => {
              const active = selected === item.id;
              return (
                <Pressable
                  key={item.id}
                  accessibilityLabel={item.label}
                  onPress={() => pick(item.id)}
                  style={[styles.cell, active && styles.cellActive]}>
                  <HabitIcon
                    name={item.id}
                    size={22}
                    color={active ? colors.accent : colors.textMuted}
                  />
                  <Text style={[styles.cellLabel, active && styles.cellLabelActive]} numberOfLines={2}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const COLS = 4;

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
  searchWrap: {
    paddingHorizontal: spacing.container,
    paddingBottom: spacing.md,
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.container,
    gap: spacing.sm,
  },
  cell: {
    width: `${(100 - (COLS - 1) * 2) / COLS}%` as unknown as number,
    minWidth: 72,
    flexGrow: 1,
    flexBasis: '22%',
    maxWidth: '24%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  cellActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  cellLabel: {
    ...typography.data,
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center',
    color: colors.textMuted,
  },
  cellLabelActive: {
    color: colors.accent,
  },
  empty: {
    ...typography.data,
    color: colors.textMuted,
    paddingVertical: spacing.lg,
    width: '100%',
    textAlign: 'center',
  },
});
