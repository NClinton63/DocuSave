import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../components/Button';
import { colors } from '../constants/colors';
import { spacing, typography } from '../constants/sizes';
import { categories } from '../constants/categories';
import { CategoryModel, DocumentInput } from '../models/types';
import { saveDocumentImage, createThumbnail } from '../services/storage.service';
import { useDocumentStore } from '../store/documentStore';
import { isNumericAmount } from '../utils/validators';

const initialFormState = {
  amount: '',
  vendorName: '',
  notes: '',
  category: 'supplies' as CategoryModel['id'],
  date: new Date().toISOString(),
};

export const ScanScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [form, setForm] = useState(initialFormState);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const addDocument = useDocumentStore((state) => state.addDocument);

  useEffect(() => {
    (async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
        Alert.alert('Permission required', 'Camera and media permissions are needed to scan documents.');
      }
    })();
  }, []);

  const handlePickImage = async (source: 'camera' | 'gallery') => {
    try {
      const result = source === 'camera'
          ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
            base64: false,
          })
          : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            base64: false,
          });

      if (!result.canceled && result.assets?.length) {
        setImageUri(result.assets[0].uri);
        // Clear image error if it exists
        if (errors.image) {
          setErrors(prev => {
            const { image, ...rest } = prev;
            return rest;
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', `Failed to access ${source}.`);
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!imageUri) {
      nextErrors.image = 'Please capture or select a document first.';
    }
    if (!form.amount) {
      nextErrors.amount = 'Amount is required.';
    } else if (!isNumericAmount(form.amount)) {
      nextErrors.amount = 'Enter a valid number.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const storedUri = await saveDocumentImage(imageUri!);
      const thumbnailUri = await createThumbnail(storedUri);

      const payload: DocumentInput = {
        imageUri: storedUri,
        thumbnailUri,
        amount: Number(form.amount),
        currency: 'XAF',
        date: form.date,
        category: form.category,
        vendorName: form.vendorName,
        notes: form.notes,
      };

      await addDocument(payload);
      Alert.alert('Success', 'Your document has been saved.');
      setForm(initialFormState);
      setImageUri(null);
      setErrors({});
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Save failed', 'Unable to store the document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          {/* Image Preview */}
          <View style={[
            styles.preview,
            { backgroundColor: isDark ? colors.surfaceVariantDark : colors.surfaceVariantLight }
          ]}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
                <View style={styles.previewPlaceholder}>
                  <Ionicons
                      name="image-outline"
                      size={64}
                      color={colors.textSecondary}
                  />
                  <Text style={[
                    styles.previewPlaceholderText,
                    { color: colors.textSecondary }
                  ]}>
                    No image selected
                  </Text>
                </View>
            )}
          </View>
          {!!errors.image && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.error}>{errors.image}</Text>
              </View>
          )}

          {/* Image Source Buttons */}
          <View style={styles.buttonRow}>
            <Button
                label="Camera"
                onPress={() => handlePickImage('camera')}
                style={styles.halfButton}
                icon={<Ionicons name="camera" size={20} color={colors.surfaceLight} />}
            />
            <Button
                label="Gallery"
                onPress={() => handlePickImage('gallery')}
                variant="secondary"
                style={styles.halfButton}
                icon={<Ionicons name="images" size={20} color={colors.surfaceLight} />}
            />
          </View>

          {/* Amount Input */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Amount (XAF) *
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                  name="cash-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
              />
              <TextInput
                  keyboardType="numeric"
                  value={form.amount}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, amount: text }))}
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
                      borderColor: errors.amount
                          ? colors.error
                          : (isDark ? colors.borderDark : colors.borderLight),
                      color: isDark ? colors.textDark : colors.textLight,
                      paddingLeft: spacing.xl + spacing.lg,
                    }
                  ]}
                  placeholder="Enter amount"
                  placeholderTextColor={colors.textSecondary}
              />
            </View>
            {!!errors.amount && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={colors.error} />
                  <Text style={styles.error}>{errors.amount}</Text>
                </View>
            )}
          </View>

          {/* Vendor Name Input */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Vendor name
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                  name="storefront-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
              />
              <TextInput
                  value={form.vendorName}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, vendorName: text }))}
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
                      borderColor: isDark ? colors.borderDark : colors.borderLight,
                      color: isDark ? colors.textDark : colors.textLight,
                      paddingLeft: spacing.xl + spacing.lg,
                    }
                  ]}
                  placeholder="Enter vendor name"
                  placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {/* Category Selection */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Category *
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: spacing.sm }}
            >
              {categories.map((category) => (
                  <Button
                      key={category.id}
                      label={category.nameEn}
                      variant={form.category === category.id ? 'primary' : 'ghost'}
                      onPress={() => setForm((prev) => ({ ...prev, category: category.id }))}
                      style={styles.categoryChip}
                  />
              ))}
            </ScrollView>
          </View>

          {/* Notes Input */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Notes
            </Text>
            <TextInput
                value={form.notes}
                onChangeText={(text) => setForm((prev) => ({ ...prev, notes: text }))}
                style={[
                  styles.input,
                  styles.notesInput,
                  {
                    backgroundColor: isDark ? colors.surfaceDark : colors.surfaceLight,
                    borderColor: isDark ? colors.borderDark : colors.borderLight,
                    color: isDark ? colors.textDark : colors.textLight,
                  }
                ]}
                placeholder="Add any additional notes..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <Button
              label="Save Document"
              onPress={handleSave}
              loading={loading}
              disabled={loading}
              icon={<Ionicons name="checkmark-circle" size={20} color={colors.surfaceLight} />}
              style={styles.saveButton}
          />
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  preview: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  previewPlaceholderText: {
    fontSize: typography.body,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfButton: {
    flex: 1,
  },
  formGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.body,
  },
  categoryChip: {
    minWidth: 100,
  },
  notesInput: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  error: {
    color: colors.error,
    fontSize: typography.caption,
  },
  saveButton: {
    marginTop: spacing.md,
  },
});