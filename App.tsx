import 'react-native-gesture-handler';
import './src/i18n/i18n.config';

import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { colors } from './src/constants/colors';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeDatabase } from './src/services/database.service';

export default function App() {
  const scheme = useColorScheme();
  const statusBarStyle = scheme === 'dark' ? 'light' : 'dark';
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize database
        await initializeDatabase();

        // Add small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        setIsReady(true);
      } catch (e) {
        console.error('Failed to initialize app:', e);
        setError('Failed to initialize the app. Please restart.');
      }
    }

    prepare();
  }, []);

  // Show loading screen while initializing
  if (!isReady) {
    return (
        <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: scheme === 'dark' ? colors.backgroundDark : colors.backgroundLight
            }}
        >
          {error ? (
              <Text style={{ color: colors.error, textAlign: 'center', padding: 20 }}>
                {error}
              </Text>
          ) : (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                    style={{
                      marginTop: 16,
                      color: scheme === 'dark' ? colors.textDark : colors.textLight,
                      fontSize: 16
                    }}
                >
                  Loading DocuSafe...
                </Text>
              </>
          )}
        </View>
    );
  }

  return (
      <GestureHandlerRootView style={[
        styles.container,
        { backgroundColor: scheme === 'dark' ? colors.backgroundDark : colors.backgroundLight }
      ]}>
        <SafeAreaProvider>
          <StatusBar style={statusBarStyle} />
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});