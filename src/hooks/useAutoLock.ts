import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppStore } from '../store/appStore';
import { useSettingsStore } from '../store/settingsStore';

export const useAutoLock = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { settings } = useSettingsStore();
  const { setUnlocked } = useAppStore();

  const scheduleLock = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (settings.autoLockTimeout === 0) {
      setUnlocked(false);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setUnlocked(false);
    }, settings.autoLockTimeout);
  };

  useEffect(() => {
    const listener = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background') {
        scheduleLock();
      }
    });
    return () => {
      listener.remove();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [settings.autoLockTimeout]);
};
