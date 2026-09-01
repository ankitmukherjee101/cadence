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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatDurationShort } from '@/src/domain';
import { useCreateJournalEntry } from '@/src/features/habits/hooks';
import { Button } from '@/src/shared/ui/Button';
import { HabitIcon } from '@/src/shared/ui/HabitIcon';
import { paper } from '@/src/shared/ui/theme';
import { colors, radii, spacing, typography } from '@/src/shared/ui/tokens';
import { useUiStore } from '@/src/store/ui-store';

export function JournalPromptSheet() {
  const insets = useSafeAreaInsets();
  const prompt = useUiStore((s) => s.journalPrompt);
  const setJournalPrompt = useUiStore((s) => s.setJournalPrompt);
  const createEntry = useCreateJournalEntry();
  const [body, setBody] = useState('');
  const [writing, setWriting] = useState(false);

  useEffect(() => {
    if (prompt) {
      setBody('');
      setWriting(false);
    }
  }, [prompt?.sessionId]);

  if (!prompt) return null;

  const close = () => {
    setJournalPrompt(null);
    setBody('');
    setWriting(false);
  };

  const save = async () => {
    const trimmed = body.trim();
    if (!trimmed) {
      close();
      return;
    }
    await createEntry.mutateAsync({
      date: prompt.date,
      body: trimmed,
      habitId: prompt.habitId,
      sessionId: prompt.sessionId,
    });
    close();
  };

  if (writing) {
    return (
      <Modal
        visible
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={close}>
        <KeyboardAvoidingView
          style={[styles.writeModal, { paddingTop: insets.top }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.writeHeader}>
            <Text style={styles.writeTitle}>Session note</Text>
            <Pressable onPress={close} hitSlop={12}>
              <Text style={styles.link}>Close</Text>
            </Pressable>
          </View>
          <View style={styles.metaRow}>
            <HabitIcon name={prompt.habitIcon} size={16} color={colors.accent} strokeWidth={1.5} />
            <Text style={styles.meta}>
              {prompt.habitName} · {formatDurationShort(prompt.durationMs)}
            </Text>
          </View>
          <TextInput
            autoFocus
            multiline
            cursorColor={colors.accent}
            selectionColor={colors.accent}
            placeholder="What stood out in this session?"
            placeholderTextColor={paper.inkMuted}
            style={styles.writeInput}
            value={body}
            onChangeText={setBody}
          />
          <View style={[styles.writeFooter, { paddingBottom: insets.bottom + spacing.md }]}>
            <Button label="Skip" variant="ghost" onPress={close} style={styles.flex} />
            <Button
              label="Save"
              onPress={() => void save()}
              disabled={createEntry.isPending}
              style={styles.flex}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  return (
    <Modal transparent animationType="slide" visible onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <View style={[styles.promptSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Text style={styles.title}>Add a journal note?</Text>
        <View style={styles.metaRow}>
          <HabitIcon name={prompt.habitIcon} size={16} color={colors.accent} strokeWidth={1.5} />
          <Text style={styles.meta}>
            {prompt.habitName} · {formatDurationShort(prompt.durationMs)}
          </Text>
        </View>
        <View style={styles.row}>
          <Button label="Skip" variant="ghost" onPress={close} style={styles.flex} />
          <Button label="Write" onPress={() => setWriting(true)} style={styles.flex} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  promptSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.container,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  meta: {
    ...typography.data,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  writeModal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  writeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.md,
  },
  writeTitle: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  link: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  writeInput: {
    flex: 1,
    paddingHorizontal: spacing.container,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
    ...typography.journalBody,
    color: paper.ink,
    textAlignVertical: 'top',
  },
  writeFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.container,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
