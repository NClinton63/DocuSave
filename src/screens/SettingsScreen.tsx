import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';

import { colors } from '../constants/colors';
import { spacing, typography } from '../constants/sizes';
import { useDocumentStore } from '../store/documentStore';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/appStore';
import { SettingRow } from '../components/SettingRow';
import { useSettingsStore } from '../store/settingsStore';
import { Button } from '../components/Button';

export const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { verifyPin, savePin, clearPin } = useAuth();
  const { setPinSetupComplete, setUnlocked } = useAppStore();
  const { clearDocuments } = useDocumentStore();

  // Split the store selectors to avoid creating new objects
  const settings = useSettingsStore((state) => state.settings);
  const loading = useSettingsStore((state) => state.loading);
  const hydrate = useSettingsStore((state) => state.hydrate);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const [changePinVisible, setChangePinVisible] = useState(false);
  const [autoLockVisible, setAutoLockVisible] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    hydrate();
  }, []);

  const autoLockOptions = useMemo(
      () => [
        { label: t('settings.autoLockOptions.immediate'), value: 0 },
        { label: t('settings.autoLockOptions.oneMinute'), value: 60_000 },
        { label: t('settings.autoLockOptions.fiveMinutes'), value: 300_000 },
      ],
      [t]
  );

  const selectedAutoLockLabel =
      autoLockOptions.find((option) => option.value === settings.autoLockTimeout)?.label ?? autoLockOptions[1].label;

  const handleLanguageToggle = async (lang: 'en' | 'fr') => {
    if (i18n.language !== lang) {
      await i18n.changeLanguage(lang);
    }
  };

  const handleClearData = () => {
    Alert.alert(t('settings.clearData'), t('settings.clearDataConfirmation'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.clearDataConfirmButton'),
        style: 'destructive',
        onPress: () => {
          clearDocuments();
          clearPin();
          setPinSetupComplete(false);
          setUnlocked(false);
        },
      },
    ]);
  };

  const handlePinChange = async () => {
    if (newPin.length < 4 || newPin.length > 6) {
      setPinError(t('pin.pinLengthError'));
      return;
    }
    if (newPin !== confirmPin) {
      setPinError(t('pin.pinMismatchError'));
      return;
    }
    const valid = await verifyPin(currentPin);
    if (!valid) {
      setPinError(t('pin.currentPinInvalid'));
      return;
    }
    await savePin(newPin);
    setPinError('');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setChangePinVisible(false);
    Alert.alert(t('common.appName'), t('pin.pinUpdated'));
  };

  if (loading) {
    return (
        <SafeAreaView
            style={[
              styles.loadingContainer,
              { backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight }
            ]}
        >
          <ActivityIndicator color={colors.primary} />
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight }
          ]}
          edges={['top', 'left', 'right']} // Don't include 'bottom' to allow ScrollView to handle it
      >
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
          <Text style={[
            styles.title,
            { color: isDark ? colors.textDark : colors.textLight }
          ]}>
            {t('settings.title')}
          </Text>

          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
              borderColor: isDark ? colors.borderDark : colors.borderLight
            }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? colors.textDark : colors.textLight }
            ]}>
              {t('settings.language')}
            </Text>
            <SettingRow
                title={t('settings.english')}
                description={t('settings.languageDescription')}
                onPress={() => handleLanguageToggle('en')}
            />
            <SettingRow title={t('settings.french')} onPress={() => handleLanguageToggle('fr')} />
          </View>

          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
              borderColor: isDark ? colors.borderDark : colors.borderLight
            }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? colors.textDark : colors.textLight }
            ]}>
              {t('settings.pin')}
            </Text>
            <SettingRow
                title={t('settings.changePin')}
                description={t('settings.changePinDescription')}
                onPress={() => setChangePinVisible(true)}
            />
            <SettingRow
                title={t('settings.biometricToggle')}
                description={t('settings.biometricDescription')}
                onPress={() => updateSettings({ biometricsEnabled: !settings.biometricsEnabled })}
                rightAccessory={
                  <Switch
                      value={settings.biometricsEnabled}
                      onValueChange={(value) => updateSettings({ biometricsEnabled: value })}
                      trackColor={{ false: colors.textSecondary, true: colors.primary }}
                      thumbColor={colors.surfaceLight}
                  />
                }
            />
          </View>

          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
              borderColor: isDark ? colors.borderDark : colors.borderLight
            }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? colors.textDark : colors.textLight }
            ]}>
              {t('settings.autoLock')}
            </Text>
            <SettingRow
                title={selectedAutoLockLabel}
                description={t('settings.autoLockDescription')}
                onPress={() => setAutoLockVisible(true)}
            />
          </View>

          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
              borderColor: isDark ? colors.borderDark : colors.borderLight
            }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? colors.textDark : colors.textLight }
            ]}>
              {t('settings.clearData')}
            </Text>
            <SettingRow title={t('settings.clearDataDescription')} onPress={handleClearData} />
          </View>

          <View style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
              borderColor: isDark ? colors.borderDark : colors.borderLight
            }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? colors.textDark : colors.textLight }
            ]}>
              {t('settings.about')}
            </Text>
            <SettingRow title={`${t('settings.version')}: ${Constants.expoConfig?.version ?? '1.0.0'}`} />
            <SettingRow title="Privacy Policy" onPress={() => Linking.openURL('https://example.com/privacy')} />
          </View>
        </ScrollView>

        <Modal visible={changePinVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[
              styles.modalCard,
              { backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight }
            ]}>
              <Text style={[
                styles.modalTitle,
                { color: isDark ? colors.textDark : colors.textLight }
              ]}>
                {t('settings.changePin')}
              </Text>
              <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? colors.surfaceVariantDark : colors.surfaceVariantLight,
                      borderColor: isDark ? colors.borderDark : colors.borderLight,
                      color: isDark ? colors.textDark : colors.textLight
                    }
                  ]}
                  placeholder={t('pin.currentPin')}
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  keyboardType="number-pad"
                  value={currentPin}
                  onChangeText={setCurrentPin}
                  maxLength={6}
              />
              <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? colors.surfaceVariantDark : colors.surfaceVariantLight,
                      borderColor: isDark ? colors.borderDark : colors.borderLight,
                      color: isDark ? colors.textDark : colors.textLight
                    }
                  ]}
                  placeholder={t('pin.newPin')}
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  keyboardType="number-pad"
                  value={newPin}
                  onChangeText={setNewPin}
                  maxLength={6}
              />
              <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? colors.surfaceVariantDark : colors.surfaceVariantLight,
                      borderColor: isDark ? colors.borderDark : colors.borderLight,
                      color: isDark ? colors.textDark : colors.textLight
                    }
                  ]}
                  placeholder={t('pin.confirmNewPin')}
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  keyboardType="number-pad"
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  maxLength={6}
              />
              {!!pinError && <Text style={styles.error}>{pinError}</Text>}
              <View style={styles.modalActions}>
                <Button label={t('common.cancel')} variant="ghost" onPress={() => setChangePinVisible(false)} />
                <Button label={t('common.save')} onPress={handlePinChange} />
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={autoLockVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[
              styles.modalCard,
              { backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight }
            ]}>
              <Text style={[
                styles.modalTitle,
                { color: isDark ? colors.textDark : colors.textLight }
              ]}>
                {t('settings.autoLock')}
              </Text>
              {autoLockOptions.map((option) => (
                  <SettingRow
                      key={option.value}
                      title={option.label}
                      onPress={() => {
                        updateSettings({ autoLockTimeout: option.value });
                        setAutoLockVisible(false);
                      }}
                  />
              ))}
              <Button label={t('common.cancel')} variant="ghost" onPress={() => setAutoLockVisible(false)} />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl, // Extra padding at bottom
  },
  title: {
    fontSize: typography.headline,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  card: {
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: spacing.lg,
    justifyContent: 'center',
  },
  modalCard: {
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  modalTitle: {
    fontSize: typography.title,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
  },
  error: {
    color: colors.error,
    fontSize: typography.caption,
  },
});