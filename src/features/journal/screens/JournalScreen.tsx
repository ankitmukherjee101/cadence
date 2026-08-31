import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { type Href, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PenLine from 'lucide-react-native/icons/pen-line';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import Timer from 'lucide-react-native/icons/timer';
import Trash2 from 'lucide-react-native/icons/trash-2';

import type { DayEvent, LocalDate } from '@/src/domain';
import {
  addDays,
  formatDurationShort,
  sessionDurationMs,
  todayLocalDate,
} from '@/src/domain';
import { LogHabitSheet } from '@/src/features/journal/components/LogHabitSheet';
import { useCreateJournalEntry, useDaySummary, useDeleteSession } from '@/src/features/habits/hooks';
import { Button } from '@/src/shared/ui/Button';
import { HabitIcon } from '@/src/shared/ui/HabitIcon';
import { FadeDown } from '@/src/shared/ui/motion';
import { paper } from '@/src/shared/ui/theme';
import { colors, fonts, radii, spacing, typography } from '@/src/shared/ui/tokens';

function formatDayHeading(date: LocalDate): string {
  const today = todayLocalDate();
  if (date === today) return 'Today';
  if (date === addDays(today, -1)) return 'Yesterday';
  return format(parseISO(date), 'EEEE, MMM d');
}

function SessionCard({
  event,
  onOpenJournal,
  onDelete,
  deleting,
}: {
  event: Extract<DayEvent, { type: 'time_session' }>;
  onOpenJournal?: (id: string) => void;
  onDelete?: (sessionId: string) => void;
  deleting?: boolean;
}) {
  const data = event.data;
  const canDelete = Boolean(data.endedAt && onDelete);
  const duration = data.endedAt ? formatDurationShort(sessionDurationMs(data)) : 'Running';
  const journal = data.journal;

  return (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionMetaRow}>
          <Text style={styles.cardTime}>{format(new Date(event.at), 'h:mm a')}</Text>
          {canDelete ? (
            <Pressable
              onPress={() => onDelete?.(data.id)}
              disabled={deleting}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Delete session">
              <Trash2 size={16} color={colors.danger} strokeWidth={1.75} />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.sessionTitleRow}>
          <HabitIcon name={data.habitIcon} size={18} color={colors.accent} />
          <Text style={styles.sessionTitle} numberOfLines={1}>
            {data.habitName ?? data.label}
          </Text>
          <Text style={styles.sessionDuration}>{duration}</Text>
        </View>
      </View>
      {journal ? (
        <Pressable
          onPress={() => onOpenJournal?.(journal.id)}
          accessibilityRole="button"
          accessibilityLabel="Open journal note">
          <Text style={styles.nestedJournal} numberOfLines={6}>
            {journal.body}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function FreeJournalRow({
  event,
  onPress,
}: {
  event: Extract<DayEvent, { type: 'journal_entry' }>;
  onPress: () => void;
}) {
  const data = event.data;
  return (
    <Pressable onPress={onPress} style={styles.freeEntry}>
      <Text style={styles.eventTime}>{format(new Date(event.at), 'h:mm a')}</Text>
      <View style={styles.eventBody}>
        <Text style={styles.journalLabel}>Journal</Text>
        <Text style={styles.journalBody}>{data.body}</Text>
      </View>
    </Pressable>
  );
}

function HabitLogRow({ event }: { event: Extract<DayEvent, { type: 'habit_log' }> }) {
  const data = event.data;
  return (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.cardTime}>{format(new Date(event.at), 'h:mm a')}</Text>
        <View style={styles.sessionTitleRow}>
          <HabitIcon name={data.habitIcon} size={18} color={colors.accent} />
          <Text style={styles.sessionTitle} numberOfLines={1}>
            {data.habitName}
          </Text>
          <Text style={styles.sessionDuration}>Completed</Text>
        </View>
      </View>
    </View>
  );
}

function TimelineItem({
  event,
  onOpenJournal,
  onDeleteSession,
  deletingSessionId,
}: {
  event: DayEvent;
  onOpenJournal: (id: string) => void;
  onDeleteSession: (sessionId: string) => void;
  deletingSessionId?: string | null;
}) {
  if (event.type === 'time_session') {
    return (
      <SessionCard
        event={event}
        onOpenJournal={onOpenJournal}
        onDelete={onDeleteSession}
        deleting={deletingSessionId === event.data.id}
      />
    );
  }
  if (event.type === 'journal_entry') {
    return <FreeJournalRow event={event} onPress={() => onOpenJournal(event.data.id)} />;
  }
  return <HabitLogRow event={event} />;
}

function MonthCalendar({
  selected,
  onSelect,
  onClose,
}: {
  selected: LocalDate;
  onSelect: (date: LocalDate) => void;
  onClose: () => void;
}) {
  const selectedDate = parseISO(selected);
  const [cursor, setCursor] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (LocalDate | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    cells.push(`${year}-${mm}-${dd}`);
  }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <Pressable style={styles.calBackdrop} onPress={onClose} />
      <View style={styles.calSheet}>
        <View style={styles.calHeader}>
          <Pressable
            onPress={() => setCursor(new Date(year, month - 1, 1))}
            hitSlop={12}>
            <ChevronLeft size={22} color={colors.accent} />
          </Pressable>
          <Text style={styles.calTitle}>{format(cursor, 'MMMM yyyy')}</Text>
          <Pressable
            onPress={() => setCursor(new Date(year, month + 1, 1))}
            hitSlop={12}>
            <ChevronRight size={22} color={colors.accent} />
          </Pressable>
        </View>
        <View style={styles.dowRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <Text key={`${d}-${i}`} style={styles.dow}>
              {d}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>
          {cells.map((date, i) => (
            <Pressable
              key={date ?? `e-${i}`}
              disabled={!date}
              onPress={() => {
                if (!date) return;
                onSelect(date);
                onClose();
              }}
              style={[
                styles.dayCell,
                date === selected && styles.dayCellSelected,
                date === todayLocalDate() && styles.dayCellToday,
              ]}>
              <Text
                style={[
                  styles.dayText,
                  date === selected && styles.dayTextSelected,
                ]}>
                {date ? Number(date.slice(-2)) : ''}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

function NewEntryModal({
  date,
  visible,
  onClose,
}: {
  date: LocalDate;
  visible: boolean;
  onClose: () => void;
}) {
  const [body, setBody] = useState('');
  const [dirty, setDirty] = useState(false);
  const create = useCreateJournalEntry();

  useEffect(() => {
    if (visible) {
      setBody('');
      setDirty(false);
    }
  }, [visible]);

  const save = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    await create.mutateAsync({ date, body: trimmed });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.entryModal}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryTitle}>Write</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.link}>Close</Text>
          </Pressable>
        </View>
        <TextInput
          autoFocus
          multiline
          cursorColor={colors.accent}
          selectionColor={colors.accent}
          placeholder="Write freely…"
          placeholderTextColor={paper.inkMuted}
          style={styles.entryInput}
          value={body}
          onChangeText={(t) => {
            setBody(t);
            setDirty(t.trim().length > 0);
          }}
        />
        {dirty ? (
          <View style={styles.entryFooter}>
            <Button
              label="Save"
              onPress={() => void save()}
              disabled={!body.trim() || create.isPending}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function JournalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [date, setDate] = useState<LocalDate>(() => todayLocalDate());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const { data: summary, isLoading } = useDaySummary(date);
  const deleteSession = useDeleteSession();

  const openJournal = (id: string) => {
    router.push(`/journal/${id}` as Href);
  };

  const confirmDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete session?',
      'This removes the timed practice from this day. Linked notes stay in your journal.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => void deleteSession.mutateAsync(sessionId),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <FadeDown>
        <View style={styles.header}>
          <Text style={styles.brand}>Journal</Text>
          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Log habit for this day"
              onPress={() => setLogOpen(true)}
              style={styles.actionBtn}>
              <Timer size={16} color={colors.accent} strokeWidth={1.75} />
              <Text style={styles.actionLabel}>Log</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Write journal entry"
              onPress={() => setNewOpen(true)}
              style={styles.actionBtn}>
              <PenLine size={16} color={colors.accent} strokeWidth={1.75} />
              <Text style={styles.actionLabel}>Write</Text>
            </Pressable>
          </View>
        </View>
      </FadeDown>

      <View style={styles.dateNav}>
        <Pressable onPress={() => setDate((d) => addDays(d, -1))} hitSlop={12}>
          <ChevronLeft size={24} color={colors.accent} />
        </Pressable>
        <Pressable
          onPress={() => setCalendarOpen(true)}
          style={styles.dateBtn}
          accessibilityRole="button"
          accessibilityLabel="Open calendar">
          <Text style={styles.dateHeading}>{formatDayHeading(date)}</Text>
          <Text style={styles.dateSub}>{format(parseISO(date), 'MMMM d, yyyy')}</Text>
        </Pressable>
        <View style={styles.dateNavRight}>
          <Pressable
            onPress={() => setCalendarOpen(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Jump to date">
            <CalendarDays size={22} color={colors.accent} strokeWidth={1.75} />
          </Pressable>
          <Pressable
            onPress={() => setDate((d) => addDays(d, 1))}
            hitSlop={12}
            disabled={date >= todayLocalDate()}>
            <ChevronRight
              size={24}
              color={date >= todayLocalDate() ? colors.border : colors.accent}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.paper}>
        {isLoading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
        ) : !summary?.events.length ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>A blank page</Text>
            <Text style={styles.emptyBody}>
              Log a habit, finish a session, or tap Write to leave a note for this day.
            </Text>
          </View>
        ) : (
          <FlatList
            data={summary.events}
            keyExtractor={(item, index) => {
              if (item.type === 'time_session') return `s-${item.data.id}`;
              if (item.type === 'journal_entry') return `j-${item.data.id}`;
              return `h-${item.data.id}-${index}`;
            }}
            contentContainerStyle={styles.timeline}
            ItemSeparatorComponent={() => <View style={styles.gap} />}
            renderItem={({ item }) => (
              <TimelineItem
                event={item}
                onOpenJournal={openJournal}
                onDeleteSession={confirmDeleteSession}
                deletingSessionId={deleteSession.isPending ? deleteSession.variables : null}
              />
            )}
          />
        )}
      </View>

      {calendarOpen ? (
        <MonthCalendar
          selected={date}
          onSelect={setDate}
          onClose={() => setCalendarOpen(false)}
        />
      ) : null}

      <NewEntryModal date={date} visible={newOpen} onClose={() => setNewOpen(false)} />
      <LogHabitSheet visible={logOpen} date={date} onClose={() => setLogOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: paper.background,
  },
  header: {
    paddingHorizontal: spacing.container,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  brand: {
    ...typography.brand,
    color: paper.ink,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  actionLabel: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.container,
    marginBottom: spacing.md,
  },
  dateBtn: {
    alignItems: 'center',
    flex: 1,
  },
  dateNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateHeading: {
    ...typography.heading,
    fontSize: 22,
    lineHeight: 28,
    color: paper.ink,
  },
  dateSub: {
    ...typography.data,
    color: paper.inkMuted,
    marginTop: 2,
  },
  paper: {
    flex: 1,
    backgroundColor: paper.background,
  },
  timeline: {
    paddingHorizontal: spacing.container,
    paddingBottom: spacing.xxl,
  },
  gap: {
    height: spacing.md,
  },
  sessionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sessionHeader: {
    gap: 6,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTime: {
    ...typography.data,
    color: paper.inkMuted,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sessionTitle: {
    ...typography.bodyMedium,
    color: paper.ink,
    flex: 1,
  },
  sessionDuration: {
    ...typography.data,
    color: colors.accentMuted,
  },
  nestedJournal: {
    ...typography.journalBody,
    fontSize: 16,
    lineHeight: 26,
    color: paper.ink,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: paper.line,
  },
  freeEntry: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  eventTime: {
    width: 64,
    ...typography.data,
    color: paper.inkMuted,
    paddingTop: 2,
  },
  eventBody: {
    flex: 1,
    gap: 4,
  },
  journalLabel: {
    ...typography.labelSm,
    color: paper.inkMuted,
    textTransform: 'uppercase',
  },
  journalBody: {
    ...typography.journalBody,
    color: paper.ink,
  },
  empty: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.journalTitle,
    color: paper.ink,
  },
  emptyBody: {
    ...typography.body,
    color: paper.inkMuted,
  },
  calBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  calSheet: {
    position: 'absolute',
    left: spacing.container,
    right: spacing.container,
    top: '22%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  calTitle: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  dowRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dow: {
    width: `${100 / 7}%` as unknown as number,
    textAlign: 'center',
    ...typography.labelSm,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%` as unknown as number,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellSelected: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.md,
  },
  dayText: {
    ...typography.body,
    color: colors.text,
  },
  dayTextSelected: {
    color: colors.onPrimary,
    fontFamily: fonts.sansSemiBold,
  },
  entryModal: {
    flex: 1,
    backgroundColor: paper.background,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.container,
  },
  entryTitle: {
    ...typography.journalTitle,
    color: paper.ink,
  },
  link: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  entryInput: {
    flex: 1,
    paddingHorizontal: spacing.container,
    ...typography.journalBody,
    color: paper.ink,
    textAlignVertical: 'top',
  },
  entryFooter: {
    padding: spacing.container,
  },
});
