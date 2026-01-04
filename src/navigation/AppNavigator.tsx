import { useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../constants/colors';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PINSetupScreen } from '../screens/PINSetupScreen';
import { PinAuthScreen } from '../screens/PinAuthScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { DocumentDetailScreen } from '../screens/DocumentDetailScreen';
import { RootStackParamList, TabParamList } from './types';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../hooks/useAuth';
import { useAutoLock } from '../hooks/useAutoLock';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.textSecondary : colors.textTertiary,
        tabBarStyle: { 
          paddingBottom: 6, 
          paddingTop: 6, 
          height: 64,
          backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
          borderTopColor: isDark ? colors.borderDark : colors.borderLight,
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<keyof TabParamList, string> = {
            Home: 'file-document-outline',
            Scan: 'camera',
            Settings: 'cog-outline',
          };
          return <MaterialCommunityIcons name={iconMap[route.name as keyof TabParamList]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { hasCompletedOnboarding, pinSetupComplete, isUnlocked, setPinSetupComplete, setUnlocked } = useAppStore();
  const { loading, isPinSetupComplete } = useAuth();
  useAutoLock();

  useEffect(() => {
    if (!loading) {
      setPinSetupComplete(isPinSetupComplete);
      if (!isPinSetupComplete) {
        setUnlocked(false);
      }
    }
  }, [loading, isPinSetupComplete, setPinSetupComplete, setUnlocked]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.backgroundLight }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !pinSetupComplete ? (
          <Stack.Screen name="PinSetup" component={PINSetupScreen} />
        ) : !isUnlocked ? (
          <Stack.Screen name="PinAuth" component={PinAuthScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="DocumentDetail" component={DocumentDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
