import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { colors } from '../constants/colors';
import { spacing, typography } from '../constants/sizes';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

export const PINSetupScreen = () => {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const { setPinSetupComplete, setUnlocked } = useAppStore();
  const { savePin } = useAuth();

  const handleSave = async () => {
    if (pin.length < 4 || pin.length > 6) {
      setError(t('pin.pinLengthError'));
      return;
    }
    if (pin !== confirmPin) {
      setError(t('pin.pinMismatchError'));
      return;
    }
    await savePin(pin);
    setPin('');
    setConfirmPin('');
    setError('');
    setPinSetupComplete(true);
    setUnlocked(true);
    Alert.alert(t('common.appName'), t('pin.success'));
  };

  return (
      <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight }
          ]}
      >
        {/* Illustration Section */}
        <View style={styles.illustrationContainer}>
          <View style={[
            styles.iconCircle,
            { backgroundColor: isDark ? colors.primaryDark : colors.primarySubtle }
          ]}>
            <Ionicons
                name="lock-closed"
                size={64}
                color={colors.primary}
            />
          </View>
          <Text style={[styles.subtitle, { color: isDark ? colors.textSecondary : colors.textLight }]}>
            {t('pin.setupSubtitle') || 'Secure your financial documents with a PIN'}
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={[
            styles.title,
            { color: isDark ? colors.textDark : colors.textLight }
          ]}>
            {t('pin.setupTitle')}
          </Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Ionicons
                  name="keypad"
                  size={20}
                  color={isDark ? colors.textSecondary : colors.textLight}
                  style={styles.inputIcon}
              />
              <TextInput
                  value={pin}
                  onChangeText={setPin}
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
                      borderColor: isDark ? colors.borderDark : colors.borderLight,
                      color: isDark ? colors.textDark : colors.textLight,
                    }
                  ]}
                  placeholder={t('pin.enterPin')}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={6}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={isDark ? colors.textSecondary : colors.textLight}
                  style={styles.inputIcon}
              />
              <TextInput
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
                      borderColor: isDark ? colors.borderDark : colors.borderLight,
                      color: isDark ? colors.textDark : colors.textLight,
                    }
                  ]}
                  placeholder={t('pin.confirmPin')}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={6}
              />
            </View>
          </View>

          {!!error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.error}>{error}</Text>
              </View>
          )}

          {/* Info Box */}
          <View style={[
            styles.infoBox,
            { backgroundColor: isDark ? colors.surfaceDark : colors.surfaceVariantLight }
          ]}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={[
              styles.infoText,
              { color: isDark ? colors.textSecondary : colors.textSecondary }
            ]}>
              {t('pin.hint') || 'Choose a 4-6 digit PIN that you can remember'}
            </Text>
          </View>

          <Button label={t('pin.savePin')} onPress={handleSave} />
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: typography.body,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    paddingLeft: spacing.xl + spacing.lg,
    fontSize: typography.body,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  error: {
    color: colors.error,
    marginLeft: spacing.xs,
    fontSize: typography.caption,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: typography.caption,
    lineHeight: 18,
  },
});