import { useState } from 'react';
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

import { formatDurationShort } from '@/src/domain';
import { useCreateJournalEntry } from '@/src/features/habits/hooks';
import { Button } from '@/src/shared/ui/Button';
import { HabitIcon } from '@/src/shared/ui/HabitIcon';
import { paper } from '@/src/shared/ui/theme';
import { colors, radii, spacing, typography } from '@/src/shared/ui/tokens';
import { useUiStore } from '@/src/store/ui-store';

export function JournalPromptSheet() {
  const prompt = useUiStore((s) => s.journalPrompt);
  const setJournalPrompt = useUiStore((s) => s.setJournalPrompt);
  const createEntry = useCreateJournalEntry();
  const [body, setBody] = useState('');
  const [writing, setWriting] = useState(false);

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

  return (
    <Modal transparent animationType="slide" visible onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Add a journal note?</Text>
          <View style={styles.metaRow}>
            <HabitIcon name={prompt.habitIcon} size={16} color={colors.accent} strokeWidth={1.5} />
            <Text style={styles.meta}>
              {prompt.habitName} · {formatDurationShort(prompt.durationMs)}
            </Text>
          </View>

          {writing ? (
            <>
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
              <View style={styles.row}>
                <Button label="Skip" variant="ghost" onPress={close} style={styles.flex} />
                <Button
                  label="Save"
                  onPress={() => void save()}
                  disabled={createEntry.isPending}
                  style={styles.flex}
                />
              </View>
            </>
          ) : (
            <View style={styles.row}>
              <Button label="Skip" variant="ghost" onPress={close} style={styles.flex} />
              <Button label="Write" onPress={() => setWriting(true)} style={styles.flex} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.container,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
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
  input: {
    minHeight: 120,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    ...typography.journalBody,
    color: paper.ink,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
