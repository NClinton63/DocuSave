import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Scan: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  PinSetup: undefined;
  PinAuth: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  DocumentDetail: { documentId: string };
};
