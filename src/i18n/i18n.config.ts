import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '../locales/en.json';
import fr from '../locales/fr.json';

const locale = Localization.getLocales?.()?.[0]?.languageTag ?? 'en';
const defaultLanguage = locale.toLowerCase().startsWith('fr') ? 'fr' : 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3', // Change from v4 to v3
  resources: { en: { translation: en }, fr: { translation: fr } },
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;