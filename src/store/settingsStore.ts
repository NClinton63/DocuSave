import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const SETTINGS_KEY = 'docusafe_settings';

export type AppSettingsState = {
  biometricsEnabled: boolean;
  autoLockTimeout: number; // milliseconds
};

const defaultSettings: AppSettingsState = {
  biometricsEnabled: true,
  autoLockTimeout: 60_000,
};

interface SettingsStore {
  settings: AppSettingsState;
  loading: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  updateSettings: (next: Partial<AppSettingsState>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: defaultSettings,
  loading: true,
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const raw = await SecureStore.getItemAsync(SETTINGS_KEY);
      if (raw) {
        set({ settings: { ...defaultSettings, ...JSON.parse(raw) } });
      }
    } catch (error) {
      console.warn('Failed to load settings', error);
    } finally {
      set({ loading: false, hydrated: true });
    }
  },
  updateSettings: async (next) => {
    try {
      const merged = { ...get().settings, ...next };
      await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(merged));
      set({ settings: merged });
    } catch (error) {
      console.warn('Failed to persist settings', error);
    }
  },
  resetSettings: async () => {
    try {
      await SecureStore.deleteItemAsync(SETTINGS_KEY);
    } catch (error) {
      console.warn('Failed to reset settings', error);
    } finally {
      set({ settings: defaultSettings });
    }
  },
}));
