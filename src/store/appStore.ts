import { create } from 'zustand';

interface AppState {
  hasCompletedOnboarding: boolean;
  pinSetupComplete: boolean;
  isUnlocked: boolean;
  setOnboardingComplete: (value: boolean) => void;
  setPinSetupComplete: (value: boolean) => void;
  setUnlocked: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  hasCompletedOnboarding: false,
  pinSetupComplete: false,
  isUnlocked: false,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setOnboardingComplete: (value) => set({ hasCompletedOnboarding: value }),
  setPinSetupComplete: (value) => set({ pinSetupComplete: value }),
  setUnlocked: (value) => set({ isUnlocked: value }),
  reset: () => set(initialState),
}));
