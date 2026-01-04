import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { radii, spacing } from '../constants/sizes';

interface FabProps {
  icon?: string;
  onPress: () => void;
}

export const Fab = ({ icon = 'plus', onPress }: FabProps) => (
  <Pressable style={styles.fab} onPress={onPress} accessibilityHint="Create new document">
    <MaterialCommunityIcons name={icon as any} color={colors.surfaceLight} size={28} />
  </Pressable>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
});
