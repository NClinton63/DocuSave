import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { spacing, typography } from '../constants/sizes';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { DocumentCard } from '../components/DocumentCard';
import { Fab } from '../components/Fab';
import { useDocuments } from '../hooks/useDocuments';
import { RootStackParamList } from '../navigation/types';
import { Button } from '../components/Button';

export const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    documents,
    allDocuments,
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    categoryOptions,
    loading,
    refreshDocuments
  } = useDocuments();

  const handleRefresh = useCallback(async () => {
    await refreshDocuments();
  }, [refreshDocuments]);

  const handleScanDocument = () => {
    navigation.navigate('Scan');
  };

  return (
      <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight }
          ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[
              styles.greeting,
              { color: colors.textSecondary }
            ]}>
              {t('home.greeting') || 'Welcome back'}
            </Text>
            <Text style={[
              styles.title,
              { color: isDark ? colors.textDark : colors.textLight }
            ]}>
              {t('home.title') || 'My Documents'}
            </Text>
          </View>

          {/* Document Count Badge */}
          {allDocuments.length > 0 && (
              <View style={[
                styles.badge,
                { backgroundColor: colors.primarySubtle }
              ]}>
                <Ionicons name="document-text" size={16} color={colors.primary} />
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  {allDocuments.length}
                </Text>
              </View>
          )}
        </View>

        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <SearchBar
              placeholder={t('common.search') || 'Search documents...'}
              value={query}
              onChange={setQuery}
          />
          <CategoryFilter
              categories={categoryOptions}
              selectedId={selectedCategory}
              onSelect={setSelectedCategory}
              language={i18n.language as 'en' | 'fr'}
              allLabel={i18n.language === 'fr' ? 'Tous' : 'All'}
          />
        </View>

        {/* Document List */}
        <FlatList
            data={documents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <DocumentCard
                    document={item}
                    onPress={(id) => navigation.navigate('DocumentDetail', { documentId: id })}
                />
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                {/* Empty State Illustration */}
                <View style={[
                  styles.emptyIconCircle,
                  { backgroundColor: isDark ? colors.surfaceDark : colors.primarySubtle }
                ]}>
                  <Ionicons
                      name={query || selectedCategory ? "search-outline" : "folder-open-outline"}
                      size={80}
                      color={colors.primary}
                  />
                </View>

                <Text style={[
                  styles.emptyTitle,
                  { color: isDark ? colors.textDark : colors.textLight }
                ]}>
                  {query || selectedCategory
                      ? t('home.noResultsTitle') || 'No documents found'
                      : t('home.emptyTitle') || 'No documents yet'
                  }
                </Text>

                <Text style={[
                  styles.emptySubtitle,
                  { color: colors.textSecondary }
                ]}>
                  {query || selectedCategory
                      ? t('home.noResultsSubtitle') || 'Try adjusting your search or filters'
                      : t('home.emptySubtitle') || 'Start by scanning your first receipt or document'
                  }
                </Text>

                {/* Quick Action Button - Only show when no filters applied */}
                {!query && !selectedCategory && (
                    <Button
                        label={t('home.scanFirstDocument') || 'Scan First Document'}
                        onPress={handleScanDocument}
                        icon={<Ionicons name="camera" size={20} color={colors.surfaceLight} />}
                        style={styles.emptyActionButton}
                    />
                )}
              </View>
            }
            contentContainerStyle={documents.length === 0 ? styles.emptyListContent : styles.listContent}
            refreshControl={
              <RefreshControl
                  refreshing={loading}
                  onRefresh={handleRefresh}
                  tintColor={colors.primary}
                  colors={[colors.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
        />

        {/* Floating Action Button */}
        <Fab
            icon="camera"
            onPress={handleScanDocument}
        />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.headline,
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    gap: spacing.xs,
  },
  badgeText: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  searchSection: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  emptyIconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.title,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  emptyActionButton: {
    marginTop: spacing.md,
    minWidth: 200,
  },
});