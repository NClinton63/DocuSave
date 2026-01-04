import { useColorScheme } from 'react-native';
import { colors, theme } from '../constants/colors';

export const useAppTheme = () => {
  const scheme = useColorScheme();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  return {
    colors: {
      ...colors,
      background: theme[mode].background,
      surface: theme[mode].surface,
      surfaceVariant: theme[mode].surfaceVariant,
      text: theme[mode].text,
      border: theme[mode].border,
    },
    mode,
  } as const;
};
