import { create } from 'zustand';
import { tourSteps } from './data/tourSteps';
import { loadArtifacts as fetchArtifacts } from './data/loadArtifacts';

function getSystemDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDarkMode(dark) {
  document.documentElement.classList.toggle('dark', dark);
}

export const useStore = create((set, get) => ({
  mode: 'landing',
  currentStep: 0,
  darkMode: getSystemDarkMode(),

  // Artifacts produced by the Colab notebook / train_and_export.py.
  // Null until fetched; fetch happens once on mount.
  artifacts: null,
  artifactsLoading: false,
  artifactsError: null,

  loadArtifacts: async () => {
    if (get().artifacts || get().artifactsLoading) return;
    set({ artifactsLoading: true, artifactsError: null });
    try {
      const data = await fetchArtifacts();
      set({ artifacts: data, artifactsLoading: false });
    } catch (err) {
      console.error(err);
      set({ artifactsError: String(err), artifactsLoading: false });
    }
  },

  setMode: (mode) => set({ mode }),
  startTour: () => set({ mode: 'tour', currentStep: 0 }),

  goToStep: (n) => {
    const clamped = Math.max(0, Math.min(n, tourSteps.length - 1));
    set({ currentStep: clamped });
  },

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < tourSteps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  toggleDarkMode: () => {
    const next = !get().darkMode;
    applyDarkMode(next);
    set({ darkMode: next });
  },

  initDarkMode: () => {
    applyDarkMode(get().darkMode);
  },
}));
