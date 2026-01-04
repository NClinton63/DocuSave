# DocuSafe - Complete Development Specification

## Project Overview
Build **DocuSafe**, a mobile-first document management application for small business owners in Cameroon using **React Native with Expo**. The app enables users to digitize, organize, and securely store financial documents (receipts, invoices, contracts) offline-first.

---

## Technical Stack Requirements

### Core Technologies
- **Framework**: React Native with Expo SDK (latest stable version)
- **Language**: TypeScript (strict mode enabled)
- **Navigation**: React Navigation v6+ (Stack + Bottom Tabs)
- **State Management**: Zustand or React Context + useReducer
- **Local Database**: Expo SQLite for structured data
- **File Storage**: Expo FileSystem for image storage
- **Camera**: Expo Camera or expo-image-picker
- **Security**: expo-secure-store for PIN storage
- **Internationalization**: i18next for French/English support

### Architecture Pattern
- **Clean Architecture** with clear separation of concerns:
    - `/src/screens` - UI screens
    - `/src/components` - Reusable components
    - `/src/services` - Business logic & data services
    - `/src/hooks` - Custom React hooks
    - `/src/models` - TypeScript interfaces/types
    - `/src/utils` - Helper functions
    - `/src/constants` - App constants, colors, sizes
    - `/src/locales` - Translation files (en.json, fr.json)

---

## Core Features to Implement (MVP)

### 1. Document Scanning & Management
- Camera integration with auto-capture capability
- Image preprocessing (crop, rotate, brightness adjustment)
- Manual data entry form with:
    - Amount field (numeric input with XAF currency)
    - Date picker (default to today)
    - Category dropdown (Supplies, Transport, Rent, Food, Utilities, Other)
    - Vendor name (text input with autocomplete from history)
    - Optional notes field
- Document list view (reverse chronological)
- Document detail view with image preview
- Edit/Delete functionality

### 2. Search & Filter
- Search bar with real-time filtering
- Filter by: date range, category, vendor, amount range
- Sort options: date (newest/oldest), amount (high/low)

### 3. Security
- PIN code setup on first launch (4-6 digits)
- PIN verification on app open
- Biometric authentication support (Face ID/Fingerprint) as alternative
- Auto-lock after app backgrounding (configurable timeout)

### 4. Onboarding & Settings
- 3-screen onboarding tutorial with skip option
- Settings screen:
    - Language toggle (English/French)
    - Change PIN
    - Clear all data (with confirmation)
    - App version display
    - About section

### 5. Offline-First Architecture
- All features must work without internet
- Local SQLite database for metadata
- Local file system for images
- Graceful handling of storage limits

---

## Modern Design Principles

### UI/UX Guidelines

**Design System**
- Follow **Material Design 3** principles for Android
- Implement **iOS Human Interface Guidelines** for iOS
- Use consistent spacing system (4px, 8px, 16px, 24px, 32px)
- Implement dark mode support (system preference detection)

**Color Palette**
```typescript
// Primary: Calm & Trustworthy (Soft Teal)
primary: '#14B8A6' // Teal - professional yet approachable
primaryDark: '#0D9488'
primaryLight: '#5EEAD4'
primarySubtle: '#CCFBF1' // For backgrounds

// Secondary: Warmth & Growth (Soft Amber)
secondary: '#F59E0B' // Warm amber - friendly and energetic
secondaryDark: '#D97706'
secondaryLight: '#FCD34D'

// Accent: Focus & Action (Soft Indigo)
accent: '#6366F1' // Indigo - for important CTAs
accentDark: '#4F46E5'

// Neutrals - Warmer tones for comfort
background: '#FAFAF9' (light) / '#1C1917' (dark)
surface: '#FFFFFF' (light) / '#292524' (dark)
surfaceVariant: '#F5F5F4' (light) / '#44403C' (dark)
text: '#1C1917' (light) / '#FAFAF9' (dark)
textSecondary: '#78716C'
textTertiary: '#A8A29E'
border: '#E7E5E4' (light) / '#57534E' (dark)

// Status Colors - Softer, less aggressive
success: '#10B981' // Green
warning: '#F59E0B' // Amber
error: '#EF4444' // Red
info: '#3B82F6' // Blue

// Semantic Colors for Financial App
income: '#10B981' // Green for money in
expense: '#EF4444' // Red for money out
neutral: '#6366F1' // Purple for transfers
```

**Typography**
- Font Family: System default (San Francisco iOS, Roboto Android)
- Scale:
    - Headline: 24px, Bold
    - Title: 20px, SemiBold
    - Body: 16px, Regular
    - Caption: 14px, Regular
    - Small: 12px, Regular

**Component Design**
- **Buttons**: Rounded corners (8px), minimum tap target 44x44px
- **Cards**: Subtle shadows, 12px border radius
- **Input Fields**: Clear labels, floating placeholders, error states
- **Icons**: Use @expo/vector-icons (MaterialCommunityIcons)
- **Empty States**: Illustrative with helpful CTAs

**Animations & Interactions**
- Use React Native Reanimated for smooth animations
- Implement haptic feedback on important actions (Expo Haptics)
- Loading states with skeleton screens
- Pull-to-refresh on document list
- Swipe gestures for delete/edit actions

---

## Database Schema (SQLite)

```sql
-- Documents Table
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  image_uri TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'XAF',
  date TEXT NOT NULL, -- ISO 8601 format
  category TEXT NOT NULL,
  vendor_name TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Categories Table (predefined)
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  icon TEXT NOT NULL
);

-- App Settings Table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

---

## Code Quality Standards

### TypeScript Requirements
- Strict mode enabled
- No implicit any
- Define interfaces for all data models
- Use enums for constants (categories, statuses)

### Code Style
- ESLint + Prettier configured
- Functional components with hooks (no class components)
- Custom hooks for complex logic
- Proper error boundaries
- Comprehensive error handling with try-catch

### Performance Optimization
- Memoization with React.memo, useMemo, useCallback
- FlatList with proper keyExtractor and getItemLayout
- Image optimization (compress before saving)
- Lazy loading for images
- Virtual scrolling for large lists

### Testing (Optional but Recommended)
- Jest for unit tests
- React Native Testing Library for component tests
- E2E tests with Detox (if time permits)

---

## Security Implementation

### PIN Storage
```typescript
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

// Hash PIN before storing
const hashedPIN = await Crypto.digestStringAsync(
  Crypto.CryptoDigestAlgorithm.SHA256,
  pin
);
await SecureStore.setItemAsync('user_pin', hashedPIN);
```

### Biometric Authentication
```typescript
import * as LocalAuthentication from 'expo-local-authentication';

const biometricAuth = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Authenticate to access DocuSafe',
  fallbackLabel: 'Use PIN',
});
```

---

## Internationalization Setup

```typescript
// i18n.config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import fr from './locales/fr.json';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr } },
  lng: Localization.locale.startsWith('fr') ? 'fr' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
```

---

## File Structure

```
docusafe/
├── app.json
├── package.json
├── tsconfig.json
├── App.tsx
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DocumentCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── CategoryPicker.tsx
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   ├── PINSetupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ScanScreen.tsx
│   │   ├── DocumentDetailScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── services/
│   │   ├── database.service.ts
│   │   ├── storage.service.ts
│   │   └── document.service.ts
│   ├── hooks/
│   │   ├── useDocuments.ts
│   │   ├── useAuth.ts
│   │   └── useCamera.ts
│   ├── models/
│   │   └── types.ts
│   ├── utils/
│   │   ├── imageProcessor.ts
│   │   └── validators.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── sizes.ts
│   │   └── categories.ts
│   └── locales/
│       ├── en.json
│       └── fr.json
└── assets/
    ├── images/
    └── icons/
```

---

## Key Implementation Notes

### 1. Image Management
- Compress images to max 1MB before saving
- Store in Expo FileSystem.documentDirectory
- Generate unique filenames (UUID + timestamp)
- Implement thumbnail generation for list view

### 2. Error Handling
- User-friendly error messages in both languages
- Graceful degradation if camera unavailable
- Storage limit warnings (check before saving)
- Network error handling (for future cloud sync)

### 3. Performance
- Limit document list initial load to 50 items
- Implement pagination/infinite scroll
- Cache frequently accessed images
- Debounce search input

### 4. Accessibility
- Add accessibilityLabel to all interactive elements
- Support screen readers
- Sufficient color contrast ratios (WCAG AA)
- Keyboard navigation support

---

## Deployment Preparation

### Expo Build Configuration
```json
{
  "expo": {
    "name": "DocuSafe",
    "slug": "docusafe",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2563EB"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.docusafe.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2563EB"
      },
      "package": "com.docusafe.app",
      "permissions": ["CAMERA", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"]
    }
  }
}
```

### Pre-Launch Checklist
- [ ] All features tested on Android & iOS
- [ ] Both languages (EN/FR) tested
- [ ] Dark mode tested
- [ ] Performance profiling completed
- [ ] Security audit done (PIN, data storage)
- [ ] App size optimized (<50MB)
- [ ] Privacy policy prepared
- [ ] Screenshots for store listing prepared

---

## Development Phases

**Phase 1: Foundation (Week 1-2)**
- Project setup with Expo
- Database schema implementation
- Core navigation structure
- Basic UI components library

**Phase 2: Core Features (Week 3-5)**
- Document scanning functionality
- Data entry forms
- Document list & detail views
- Search & filter

**Phase 3: Security & Polish (Week 6-7)**
- PIN authentication
- Settings screen
- Onboarding flow
- Internationalization

**Phase 4: Testing & Optimization (Week 8)**
- Bug fixes
- Performance optimization
- User testing feedback integration
- Final polish

---

## Success Criteria

The app is considered deployment-ready when:
1. All MVP features work offline without crashes
2. Both English and French translations complete
3. PIN security properly implemented
4. Smooth 60fps performance on mid-range Android devices
5. App size under 50MB
6. No critical accessibility violations
7. Clean build with no warnings
8. Successful test on at least 3 different devices

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Material Design 3](https://m3.material.io/)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

**Build this app with attention to detail, user experience, and code quality. This is a production application that will be used by real small business owners in Cameroon. Every feature should be reliable, intuitive, and fast.**