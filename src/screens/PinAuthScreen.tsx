import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/Button';
import { colors } from '../constants/colors';
import { spacing, typography } from '../constants/sizes';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../hooks/useAuth';

export const PinAuthScreen = () => {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { setUnlocked } = useAppStore();
  const { verifyPin, authenticateBiometrics } = useAuth();

  const handleVerify = async () => {
    if (!pin) {
      setError(t('pin.enterPin'));
      return;
    }
    const success = await verifyPin(pin);
    if (success) {
      setError('');
      setUnlocked(true);
    } else {
      setError(t('pin.invalidPin'));
    }
  };

  const handleBiometrics = async () => {
    const result = await authenticateBiometrics();
    if (result.success) {
      setUnlocked(true);
    } else if (result.error !== 'authentication_failed') {
      Alert.alert(t('pin.biometricsError'), result.error ?? '');
    }
  };

  useEffect(() => {
    // Try biometrics on mount for faster unlock
    handleBiometrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={[styles.container, { backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight }]}
    >
      <View style={[
        styles.card, 
        { 
          backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
          borderColor: isDark ? colors.borderDark : colors.borderLight,
          shadowColor: isDark ? '#000' : '#000',
        }
      ]}>
        <Text style={[styles.title, { color: isDark ? colors.textDark : colors.textLight }]}>{t('pin.unlock')}</Text>
        <TextInput
          value={pin}
          onChangeText={setPin}
          style={[
            styles.input,
            {
              backgroundColor: isDark ? colors.surfaceVariantDark : colors.surfaceVariantLight,
              borderColor: isDark ? colors.borderDark : colors.borderLight,
              color: isDark ? colors.textDark : colors.textLight,
            }
          ]}
          placeholder={t('pin.placeholder')}
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={6}
          accessibilityLabel={t('pin.placeholder')}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button label={t('pin.unlockButton')} onPress={handleVerify} style={styles.action} />
        <Button label={t('pin.useBiometrics')} variant="ghost" onPress={handleBiometrics} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    fontSize: typography.title,
    letterSpacing: 4,
    textAlign: 'center',
  },
  error: {
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  action: {
    marginBottom: spacing.sm,
  },
});
