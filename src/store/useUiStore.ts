/**
 * UI store — ephemeral view state, kept deliberately separate from the library
 * (domain) store. Holds navigation, the open drawer, filters, the YIR selectors,
 * and the transient toast.
 */
import { create } from 'zustand';
import type { ShelfTab } from '../domain/book/book.types';
import type { YirScenario, YirYear } from '../domain/yir/yir.types';

export type AppView = 'library' | 'discover' | 'yir';

const TOAST_DURATION_MS = 2400;

interface UiState {
  view: AppView;
  selectedId: string | null;
  shelf: ShelfTab;
  query: string;
  scenario: YirScenario;
  year: YirYear;
  onboardVisible: boolean;
  /** True right after a book is marked finished, to show the celebration banner. */
  justFinished: boolean;
  toast: string | null;

  navigate: (view: AppView) => void;
  selectBook: (id: string) => void;
  closeBook: () => void;
  setShelf: (shelf: ShelfTab) => void;
  setQuery: (query: string) => void;
  setScenario: (scenario: YirScenario) => void;
  setYear: (year: YirYear) => void;
  dismissOnboard: () => void;
  markFinished: () => void;
  showToast: (message: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUiStore = create<UiState>((set) => ({
  view: 'library',
  selectedId: null,
  shelf: 'all',
  query: '',
  scenario: 'you',
  year: 2025,
  onboardVisible: true,
  justFinished: false,
  toast: null,

  navigate: (view) => set({ view, selectedId: null, justFinished: false }),
  selectBook: (id) => set({ selectedId: id, justFinished: false }),
  closeBook: () => set({ selectedId: null, justFinished: false }),
  setShelf: (shelf) => set({ shelf }),
  setQuery: (query) => set({ query }),
  setScenario: (scenario) => set({ scenario }),
  setYear: (year) => set({ year }),
  dismissOnboard: () => set({ onboardVisible: false }),
  markFinished: () => set({ justFinished: true }),

  showToast: (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: message });
    toastTimer = setTimeout(() => set({ toast: null }), TOAST_DURATION_MS);
  },
}));
