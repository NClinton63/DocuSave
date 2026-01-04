import { useMemo, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme, Dimensions } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { useDocumentStore } from '../store/documentStore';
import { spacing, typography } from '../constants/sizes';
import { colors } from '../constants/colors';
import { Button } from '../components/Button';
import { categories } from '../constants/categories';

export const DocumentDetailScreen = () => {
  const { t, i18n } = useTranslation();
  const route = useRoute<RouteProp<RootStackParamList, 'DocumentDetail'>>();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);

  const document = useDocumentStore((state) =>
      state.documents.find((doc) => doc.id === route.params.documentId)
  );
  const deleteDocument = useDocumentStore((state) => state.deleteDocument);

  const formattedDate = useMemo(() => {
    if (!document) return '';
    return new Date(document.date).toLocaleDateString(
        i18n.language === 'fr' ? 'fr-FR' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );
  }, [document, i18n.language]);

  const categoryInfo = useMemo(() => {
    if (!document) return null;
    return categories.find(cat => cat.id === document.category);
  }, [document]);

  const handleDelete = () => {
    Alert.alert(
        t('documentDetail.deleteTitle') || 'Delete Document',
        t('documentDetail.deleteMessage') || 'Are you sure you want to delete this document? This action cannot be undone.',
        [
          {
            text: t('common.cancel') || 'Cancel',
            style: 'cancel',
          },
          {
            text: t('common.delete') || 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteDocument(document!.id);
                navigation.goBack();
              } catch (error) {
                Alert.alert(
                    t('common.error') || 'Error',
                    t('documentDetail.deleteError') || 'Failed to delete document'
                );
              }
            },
          },
        ]
    );
  };

  if (!document) {
    return (
        <SafeAreaView
            style={[
              styles.centered,
              { backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight }
            ]}
        >
          <Ionicons
              name="document-text-outline"
              size={64}
              color={colors.textSecondary}
          />
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
            {t('documentDetail.notFound') || 'Document not found'}
          </Text>
          <Button
              label={t('common.goBack') || 'Go Back'}
              onPress={() => navigation.goBack()}
              variant="ghost"
              style={{ marginTop: spacing.lg }}
          />
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight }
          ]}
      >
        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
          {/* Document Image */}
          <Pressable
              style={styles.imageContainer}
              onPress={() => setIsImageFullScreen(true)}
          >
            <Image
                source={{ uri: document.imageUri }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <Ionicons name="expand-outline" size={24} color={colors.surfaceLight} />
            </View>
          </Pressable>


          {/* Full Screen Image Modal */}
          <Modal
              visible={isImageFullScreen}
              transparent={true}
              onRequestClose={() => setIsImageFullScreen(false)}
          >
            <View style={styles.fullScreenContainer}>
              <Pressable 
                style={styles.fullScreenBackground} 
                onPress={() => setIsImageFullScreen(false)}
              >
                <Image
                    source={{ uri: document.imageUri }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                />
                <Pressable 
                  style={styles.closeButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    setIsImageFullScreen(false);
                  }}
                >
                  <Ionicons name="close" size={28} color={colors.surfaceLight} />
                </Pressable>
              </Pressable>
            </View>
          </Modal>

          {/* Amount Card */}
          <View style={[
            styles.amountCard,
            {
              backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
              borderColor: isDark ? colors.borderDark : colors.borderLight,
            }
          ]}>
            <View style={styles.amountHeader}>
              <Ionicons name="cash" size={32} color={colors.primary} />
              <View style={styles.amountContent}>
                <Text style={[styles.amount, { color: isDark ? colors.textDark : colors.textLight }]}>
                  {document.amount.toLocaleString()} {document.currency}
                </Text>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  {' '}{formattedDate}
                </Text>
              </View>
            </View>
          </View>

          {/* Details Section */}
          <View style={[
            styles.detailsCard,
            {
              backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
              borderColor: isDark ? colors.borderDark : colors.borderLight,
            }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? colors.textDark : colors.textLight }
            ]}>
              {t('documentDetail.details') || 'Details'}
            </Text>

            <DetailRow
                icon="pricetag"
                label={t('documentDetail.category') || 'Category'}
                value={i18n.language === 'fr' ? categoryInfo?.nameFr : categoryInfo?.nameEn}
                isDark={isDark}
            />

            <DetailRow
                icon="storefront"
                label={t('documentDetail.vendor') || 'Vendor'}
                value={document.vendorName || '—'}
                isDark={isDark}
            />

            {document.notes && (
                <View style={styles.notesSection}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="document-text" size={20} color={colors.textSecondary} />
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      {t('documentDetail.notes') || 'Notes'}
                    </Text>
                  </View>
                  <Text style={[
                    styles.notesValue,
                    {
                      color: isDark ? colors.textDark : colors.textLight,
                      backgroundColor: isDark ? colors.surfaceVariantDark : colors.surfaceVariantLight,
                    }
                  ]}>
                    {document.notes}
                  </Text>
                </View>
            )}

            {/* Metadata */}
            <View style={styles.metadata}>
              <Text style={[styles.metadataText, { color: colors.textTertiary }]}>
                {t('documentDetail.created') || 'Created'}: {new Date(document.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
                label={t('common.edit') || 'Edit'}
                variant="secondary"
                onPress={() => {
                  // TODO: Navigate to edit screen
                  Alert.alert('Coming soon', 'Edit functionality will be added soon');
                }}
                icon={<Ionicons name="create-outline" size={20} color={colors.surfaceLight} />}
                style={styles.actionButton}
            />
            <Button
                label={t('common.delete') || 'Delete'}
                variant="ghost"
                onPress={handleDelete}
                icon={<Ionicons name="trash-outline" size={20} color={colors.primary} />}
                style={styles.actionButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

// Detail Row Component
const DetailRow = ({
                     icon,
                     label,
                     value,
                     isDark
                   }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  isDark: boolean;
}) => (
    <View style={styles.detailRow}>
      <View style={styles.detailHeader}>
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      </View>
      <Text style={[
        styles.detailValue,
        { color: isDark ? colors.textDark : colors.textLight }
      ]}>
        {value || '—'}
      </Text>
    </View>
);

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    backgroundColor: colors.surfaceVariantLight,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: spacing.sm,
  },
  amountCard: {
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  amountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  amountContent: {
    flex: 1,
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  meta: {
    fontSize: typography.caption,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsCard: {
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  detailRow: {
    gap: spacing.xs,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: typography.body,
    marginLeft: spacing.lg + spacing.xs,
  },
  notesSection: {
    gap: spacing.xs,
  },
  notesValue: {
    fontSize: typography.body,
    lineHeight: 22,
    marginLeft: spacing.lg + spacing.xs,
    padding: spacing.md,
    borderRadius: 8,
  },
  metadata: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metadataText: {
    fontSize: typography.small,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    fontSize: typography.title,
    marginTop: spacing.md,
  },
});