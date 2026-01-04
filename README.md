# DocuSafe

DocuSafe is a secure, offline-friendly document management app built with Expo/React Native. It lets micro and small businesses quickly capture receipts, invoices, and vital records, then protect them with PIN and biometric authentication.

## Features

- **Multi-stage onboarding** with localized copy (English & French)
- **PIN + biometric authentication** powered by SecureStore and Local Authentication
- **Auto-lock settings** configurable from the Settings screen
- **Offline-first document storage** using Expo SQLite and FileSystem
- **Scan workflow** with camera capture, basic validators, thumbnails, and searchable metadata
- **Localization** via `i18next`/`react-i18next`
- **State management** handled by Zustand stores for app, settings, and documents

## Project Structure

```
├── App.tsx
├── src/
│   ├── components/       # Reusable UI elements (Button, Fab, SettingRow, etc.)
│   ├── constants/        # Colors, sizes, categories
│   ├── hooks/            # Auth, documents, settings, auto-lock hooks
│   ├── locales/          # `en` and `fr` translation files
│   ├── navigation/       # App navigator + types
│   ├── screens/          # Onboarding, PIN, Home, Scan, Detail, Settings
│   ├── services/         # SQLite + FileSystem helpers
│   ├── store/            # Zustand stores
│   └── utils/            # Validators and helpers
└── package.json          # Dependencies and scripts
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the Expo dev server**
   ```bash
   npm run start
   # or npm run ios / npm run android
   ```
3. **Run tests**
   ```bash
   npm test
   ```

> ⚠️ Note: Expo SDK 54 targets React Native 0.81. Matching dependency versions (especially Expo modules, `@types/react-native`, and lint packages) is important. If `npm install` fails with `ETARGET`, adjust the offending package to the latest published version.

## Scripts

| Script        | Description                      |
| ------------- | -------------------------------- |
| `npm run start`   | Launch Expo dev server           |
| `npm run ios`     | Start iOS simulator via Expo    |
| `npm run android` | Start Android emulator          |
| `npm run web`     | Run Expo web build              |
| `npm run lint`    | Lint the project with ESLint    |
| `npm run typecheck` | Run TypeScript type checking |

## Testing & Accessibility

- Jest/testing-library scaffolding lives under `src/__tests__`.
- Accessibility labels and hints should be added to interactive components (Buttons, Setting rows, FAB) as the UI evolves.

## Splash Screen

`splash.image` in `app.json` points to `./docusafe_splash.png`. Update that asset to refresh the native splash experience.

## Contributing

1. Create a feature branch
2. Implement changes with TypeScript strict mode
3. Keep translations in sync across `src/locales/en.json` and `fr.json`
4. Run `npm run lint && npm run typecheck`
5. Submit a pull request with screenshots/GIFs when applicable

Happy shipping! ✨
