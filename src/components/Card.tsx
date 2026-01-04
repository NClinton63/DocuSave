import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';
import { radii, spacing } from '../constants/sizes';

interface CardProps extends PropsWithChildren {
  elevated?: boolean;
}

export const Card = ({ children, elevated }: CardProps) => (
  <View style={[styles.base, elevated && styles.shadow]}>{children}</View>
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
});
