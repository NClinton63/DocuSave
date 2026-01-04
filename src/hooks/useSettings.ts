import { useCallback, useEffect, useState } from 'react';
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

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettingsState>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const value = await SecureStore.getItemAsync(SETTINGS_KEY);
        if (value) {
          setSettings({ ...defaultSettings, ...JSON.parse(value) });
        }
      } catch (error) {
        console.warn('Failed to load settings', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: Partial<AppSettingsState>) => {
    try {
      setSettings((prev) => {
        const merged = { ...prev, ...next };
        SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(merged)).catch((err) =>
          console.warn('Failed to persist settings', err)
        );
        return merged;
      });
    } catch (error) {
      console.warn('Failed to save settings', error);
    }
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(SETTINGS_KEY);
    } catch (error) {
      console.warn('Failed to reset settings', error);
    } finally {
      setSettings(defaultSettings);
    }
  }, []);

  return {
    settings,
    loading,
    updateSettings: persist,
    resetSettings,
  };
};
