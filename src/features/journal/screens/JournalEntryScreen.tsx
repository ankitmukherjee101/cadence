import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Trash2 from 'lucide-react-native/icons/trash-2';

import { useDeleteJournalEntry, useJournalEntry, useUpdateJournalEntry } from '@/src/features/habits/hooks';
import { Button } from '@/src/shared/ui/Button';
import { paper } from '@/src/shared/ui/theme';
import { colors, spacing, typography } from '@/src/shared/ui/tokens';

export function JournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: entry, isLoading } = useJournalEntry(id ?? null);
  const update = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();
  const [body, setBody] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (entry) {
      setBody(entry.body);
      setDirty(false);
    }
  }, [entry]);

  const save = async () => {
    if (!id || !body.trim()) return;
    try {
      await update.mutateAsync({ id, patch: { body: body.trim() } });
      router.back();
    } catch (err) {
      Alert.alert('Couldn’t save', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const confirmDelete = () => {
    if (!id) return;
    Alert.alert('Delete entry?', 'This note will be removed permanently.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await deleteEntry.mutateAsync(id);
              router.back();
            } catch (err) {
              Alert.alert('Couldn’t delete', err instanceof Error ? err.message : 'Unknown error');
            }
          })();
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.notFound}>Entry not found</Text>
        <Button label="Go back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
        <Text style={styles.date}>{entry.date}</Text>
        <Pressable
          onPress={confirmDelete}
          disabled={deleteEntry.isPending}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Delete entry">
          <Trash2 size={20} color={colors.danger} strokeWidth={1.75} />
        </Pressable>
      </View>
      <TextInput
        multiline
        cursorColor={colors.accent}
        selectionColor={colors.accent}
        style={styles.input}
        value={body}
        onChangeText={(t) => {
          setBody(t);
          setDirty(t.trim() !== entry.body.trim());
        }}
        textAlignVertical="top"
      />
      {dirty ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Button label="Save" onPress={() => void save()} disabled={update.isPending} />
        </View>
      ) : (
        <View style={{ height: insets.bottom + spacing.md }} />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: paper.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.container,
    marginBottom: spacing.md,
  },
  link: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  date: {
    ...typography.data,
    color: paper.inkMuted,
  },
  notFound: {
    ...typography.heading,
    color: paper.ink,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.container,
    ...typography.journalBody,
    color: paper.ink,
  },
  footer: {
    paddingHorizontal: spacing.container,
  },
});
