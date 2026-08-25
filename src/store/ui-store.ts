import { create } from 'zustand';

type UiState = {
  activeTimerLabelDraft: string;
  setActiveTimerLabelDraft: (value: string) => void;
};

/** Ephemeral UI state only — business data lives in SQLite. */
export const useUiStore = create<UiState>((set) => ({
  activeTimerLabelDraft: '',
  setActiveTimerLabelDraft: (value) => set({ activeTimerLabelDraft: value }),
}));
