import { create } from 'zustand';

import type { LocalDate } from '@/src/domain';

export type JournalPrompt = {
  sessionId: string;
  habitId: string;
  habitName: string;
  habitIcon: string;
  date: LocalDate;
  durationMs: number;
};

type UiState = {
  journalPrompt: JournalPrompt | null;
  setJournalPrompt: (value: JournalPrompt | null) => void;
  createHabitOpen: boolean;
  setCreateHabitOpen: (open: boolean) => void;
  editingHabitId: string | null;
  setEditingHabitId: (id: string | null) => void;
  selectedAnalyticsHabitId: string | null;
  setSelectedAnalyticsHabitId: (id: string | null) => void;
};

/** Ephemeral UI state only — business data lives in SQLite. */
export const useUiStore = create<UiState>((set) => ({
  journalPrompt: null,
  setJournalPrompt: (value) => set({ journalPrompt: value }),
  createHabitOpen: false,
  setCreateHabitOpen: (open) => set({ createHabitOpen: open }),
  editingHabitId: null,
  setEditingHabitId: (id) => set({ editingHabitId: id }),
  selectedAnalyticsHabitId: null,
  setSelectedAnalyticsHabitId: (id) => set({ selectedAnalyticsHabitId: id }),
}));
