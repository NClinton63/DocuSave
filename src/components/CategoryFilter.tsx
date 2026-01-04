import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { radii, spacing, typography } from '../constants/sizes';
import { CategoryModel } from '../models/types';

interface CategoryFilterProps {
  categories: CategoryModel[];
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
  language?: 'en' | 'fr';
  allLabel?: string;
}

export const CategoryFilter = ({
  categories,
  selectedId,
  onSelect,
  language = 'en',
  allLabel = 'All',
}: CategoryFilterProps) => (
  <View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity
        style={[styles.chip, !selectedId && styles.chipActive]}
        onPress={() => onSelect(null)}
        accessibilityRole="button"
      >
        <Text style={[styles.chipLabel, !selectedId && styles.chipLabelActive]}>{allLabel}</Text>
      </TouchableOpacity>
      {categories.map((category) => {
        const active = selectedId === category.id;
        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(active ? null : category.id)}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name={category.icon as any}
              size={16}
              color={active ? colors.surfaceLight : colors.textSecondary}
              style={styles.icon}
            />
            <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
              {language === 'fr' ? category.nameFr : category.nameEn}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceLight,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  chipLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipLabelActive: {
    color: colors.surfaceLight,
  },
  icon: {
    marginRight: spacing.xs,
  },
});
