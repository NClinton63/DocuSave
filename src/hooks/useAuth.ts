import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';

const PIN_KEY = 'docusafe_user_pin';

const hashPin = async (pin: string) => {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
};

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isPinSetupComplete, setPinSetupComplete] = useState(false);

  const refreshPinState = useCallback(async () => {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      setPinSetupComplete(!!storedPin);
    } catch (error) {
      console.warn('Failed to read PIN from SecureStore', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPinState();
  }, [refreshPinState]);

  const savePin = useCallback(async (pin: string) => {
    try {
      const hashed = await hashPin(pin);
      await SecureStore.setItemAsync(PIN_KEY, hashed);
      setPinSetupComplete(true);
    } catch (error) {
      console.warn('Failed to save PIN', error);
      throw error;
    }
  }, []);

  const verifyPin = useCallback(async (pin: string) => {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      if (!storedPin) return false;
      const hashed = await hashPin(pin);
      return storedPin === hashed;
    } catch (error) {
      console.warn('Failed to verify PIN', error);
      return false;
    }
  }, []);

  const clearPin = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(PIN_KEY);
      setPinSetupComplete(false);
    } catch (error) {
      console.warn('Failed to clear PIN', error);
      throw error;
    }
  }, []);

  const authenticateBiometrics = useCallback(async () => {
    const supported = await LocalAuthentication.hasHardwareAsync();
    if (!supported) return { success: false, error: 'hardware_not_available' } as const;

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return { success: false, error: 'biometrics_not_enrolled' } as const;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access DocuSafe',
      fallbackLabel: 'Use PIN',
    });

    return result.success ? { success: true } : { success: false, error: 'authentication_failed' };
  }, []);

  return {
    loading,
    isPinSetupComplete,
    savePin,
    verifyPin,
    clearPin,
    refreshPinState,
    authenticateBiometrics,
  };
};
