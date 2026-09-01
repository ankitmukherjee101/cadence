import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { LocalDate } from '@/src/domain';
import { formatDurationShort } from '@/src/domain';
import { useCreateJournalEntry } from '@/src/features/habits/hooks';
import { Button } from '@/src/shared/ui/Button';
import { HabitIcon } from '@/src/shared/ui/HabitIcon';
import { paper } from '@/src/shared/ui/theme';
import { colors, spacing, typography } from '@/src/shared/ui/tokens';

export type SessionNoteTarget = {
  sessionId: string;
  habitId: string;
  habitName: string;
  habitIcon: string;
  date: LocalDate;
  durationMs: number;
};

type Props = {
  target: SessionNoteTarget | null;
  onClose: () => void;
};

export function SessionNoteModal({ target, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const createEntry = useCreateJournalEntry();
  const [body, setBody] = useState('');

  useEffect(() => {
    if (target) setBody('');
  }, [target?.sessionId]);

  if (!target) return null;

  const save = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    try {
      await createEntry.mutateAsync({
        date: target.date,
        body: trimmed,
        habitId: target.habitId,
        sessionId: target.sessionId,
      });
      onClose();
    } catch (err) {
      Alert.alert('Couldn’t save', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.modal, { paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>Session note</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.link}>Close</Text>
          </Pressable>
        </View>
        <View style={styles.metaRow}>
          <HabitIcon name={target.habitIcon} size={16} color={colors.accent} strokeWidth={1.5} />
          <Text style={styles.meta}>
            {target.habitName} · {formatDurationShort(target.durationMs)}
          </Text>
        </View>
        <TextInput
          autoFocus
          multiline
          cursorColor={colors.accent}
          selectionColor={colors.accent}
          placeholder="What stood out in this session?"
          placeholderTextColor={paper.inkMuted}
          style={styles.input}
          value={body}
          onChangeText={setBody}
        />
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Button
            label="Save"
            onPress={() => void save()}
            disabled={!body.trim() || createEntry.isPending}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: paper.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.journalTitle,
    color: paper.ink,
  },
  link: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.container,
    marginBottom: spacing.sm,
  },
  meta: {
    ...typography.data,
    color: paper.inkMuted,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.container,
    paddingTop: spacing.sm,
    ...typography.journalBody,
    color: paper.ink,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: spacing.container,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: paper.line,
  },
});
