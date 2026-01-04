import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, FlatList, Image, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Button } from '../components/Button';
import { colors } from '../constants/colors';
import { radii, spacing, typography } from '../constants/sizes';
import { useAppStore } from '../store/appStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const slides = [
  {
    key: 'capture',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=600&q=60',
    titleKey: 'onboarding.title1',
    descriptionKey: 'onboarding.description1',
  },
  {
    key: 'offline',
    image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=600&q=60',
    titleKey: 'onboarding.title2',
    descriptionKey: 'onboarding.description2',
  },
  {
    key: 'secure',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=600&q=60',
    titleKey: 'onboarding.title3',
    descriptionKey: 'onboarding.description3',
  },
];

export const OnboardingScreen = () => {
  const { t } = useTranslation();
  const { setOnboardingComplete } = useAppStore();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSkip = () => {
    setOnboardingComplete(true);
  };

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      handleSkip();
    }
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight }
    ]}>
      <Animated.FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(event) => setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width))}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image 
              source={{ uri: item.image }} 
              style={[
                styles.image,
                { backgroundColor: isDark ? colors.surfaceVariantDark : colors.surfaceVariantLight }
              ]} 
              resizeMode="contain"
            />
            <Text style={[
              styles.title, 
              { color: isDark ? colors.textDark : colors.textLight }
            ]}>
              {t(item.titleKey)}
            </Text>
            <Text style={[
              styles.description, 
              { color: isDark ? colors.textSecondary : colors.textLight }
            ]}>
              {t(item.descriptionKey)}
            </Text>
          </View>
        )}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex 
                ? [styles.activeDot, { backgroundColor: colors.primary }]
                : { backgroundColor: isDark ? colors.surfaceVariantDark : colors.surfaceVariantLight },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          label={t('onboarding.skip')}
          variant="ghost"
          onPress={handleSkip}
          style={styles.skipButton}
        />
        <Button
          label={activeIndex === slides.length - 1 ? t('common.getStarted') : t('common.next')}
          onPress={activeIndex === slides.length - 1 ? handleSkip : handleNext}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  slide: {
    width: 300,
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: radii.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceVariantLight,
  },
  title: {
    fontSize: typography.headline,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  skipButton: {
    flex: 1,
    marginRight: spacing.md
  },
  nextButton: {
    flex: 2,
  },
});
