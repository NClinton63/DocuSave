import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { spacing, typography, radii } from '../constants/sizes';
import { DocumentModel } from '../models/types';

interface DocumentCardProps {
  document: DocumentModel;
  onPress: (id: string) => void;
  onLongPress?: (id: string) => void;
}

export const DocumentCard = ({ document, onPress, onLongPress }: DocumentCardProps) => (
  <Pressable
    style={styles.card}
    onPress={() => onPress(document.id)}
    onLongPress={() => onLongPress?.(document.id)}
    accessibilityRole="button"
  >
    <Image source={{ uri: document.thumbnailUri || document.imageUri }} style={styles.thumbnail} />
    <View style={styles.info}>
      <Text style={styles.amount}>{document.amount.toFixed(0)} XAF</Text>
      <Text style={styles.meta} numberOfLines={1}>
        {document.vendorName || '—'} · {new Date(document.date).toLocaleDateString()}
      </Text>
      <Text style={styles.category}>{document.category.toUpperCase()}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: radii.sm,
    marginRight: spacing.md,
    backgroundColor: colors.surfaceVariantLight,
  },
  info: { flex: 1 },
  amount: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textLight,
  },
  meta: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  category: {
    marginTop: 4,
    fontSize: typography.small,
    color: colors.primaryDark,
    fontWeight: '500',
  },
});
