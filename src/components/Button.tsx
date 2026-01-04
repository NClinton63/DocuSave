import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';
import { radii, spacing, typography } from '../constants/sizes';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const Button = ({
                         label,
                         onPress,
                         variant = 'primary',
                         disabled,
                         loading,
                         style,
                         icon,
                       }: ButtonProps) => {
  const background =
      variant === 'primary'
          ? colors.primary
          : variant === 'secondary'
              ? colors.secondary
              : 'transparent';

  const textColor = variant === 'ghost' ? colors.primary : colors.surfaceLight;
  const borderColor = variant === 'ghost' ? colors.primary : 'transparent';

  return (
      <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !!disabled }}
          style={({ pressed }) => [
            styles.base,
            { backgroundColor: disabled ? colors.textTertiary : background, borderColor },
            pressed && !disabled ? styles.pressed : null,
            style,
          ]}
          onPress={onPress}
          disabled={disabled || loading}
      >
        {loading ? (
            <ActivityIndicator color={textColor} />
        ) : (
            <View style={styles.content}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text style={[styles.label, { color: textColor }]}>{label}</Text>
            </View>
        )}
      </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.body,
    fontWeight: '600',
  },
});