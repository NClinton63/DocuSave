import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { colors } from '../constants/colors';
import { spacing, typography } from '../constants/sizes';

interface SettingRowProps {
  title: string;
  description?: string;
  rightAccessory?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

export const SettingRow = ({ title, description, rightAccessory, onPress, disabled }: SettingRowProps) => {
  const Component = onPress ? Pressable : View;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Component
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ disabled: !!disabled }}
      onPress={disabled ? undefined : onPress}
      style={[styles.row, disabled && styles.disabled]}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: isDark ? colors.textDark : colors.textLight }]}>{title}</Text>
        {!!description && <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>}
      </View>
      {rightAccessory}
    </Component>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.body,
    fontWeight: '500',
  },
  description: {
    fontSize: typography.caption,
    marginTop: 2,
  },
});
