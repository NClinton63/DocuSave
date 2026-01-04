import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Crypto from 'expo-crypto';

// Use the FileSystem properties directly
const DOCUMENTS_DIR = FileSystem.documentDirectory as string;
const CACHE_DIR = FileSystem.cacheDirectory as string;
const IMAGES_DIR = `${DOCUMENTS_DIR}documents/`;

/**
 * Generates a unique ID using expo-crypto
 */
const generateUUID = (): string => {
  return Crypto.randomUUID();
};

/**
 * Ensures the documents directory exists
 */
const ensureDirExists = async (): Promise<void> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
      console.log('✅ Documents directory created:', IMAGES_DIR);
    }
  } catch (error) {
    console.error('❌ Error ensuring directory exists:', error);
    throw error;
  }
};

/**
 * Saves a document image to permanent storage
 * @param sourceUri - URI of the source image
 * @returns The URI of the saved image
 */
export const saveDocumentImage = async (sourceUri: string): Promise<string> => {
  try {
    await ensureDirExists();

    const extension = sourceUri.split('.').pop() ?? 'jpg';
    const filename = `${generateUUID()}.${extension}`;
    const destinationUri = `${IMAGES_DIR}${filename}`;

    await FileSystem.copyAsync({ from: sourceUri, to: destinationUri });

    console.log('✅ Image saved:', destinationUri);
    return destinationUri;
  } catch (error) {
    console.error('❌ Error saving document image:', error);
    throw error;
  }
};

/**
 * Deletes a document image from storage
 * @param uri - URI of the image to delete
 */
export const deleteDocumentImage = async (uri?: string | null): Promise<void> => {
  if (!uri) {
    console.log('⚠️ No URI provided for deletion');
    return;
  }

  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      console.log('✅ Image deleted:', uri);
    } else {
      console.log('⚠️ File does not exist:', uri);
    }
  } catch (error) {
    console.error('❌ Error deleting document image:', error);
    // Don't throw - deletion failures shouldn't crash the app
  }
};

/**
 * Creates a thumbnail from an image
 * @param uri - URI of the source image
 * @returns The URI of the thumbnail
 */
export const createThumbnail = async (uri: string): Promise<string> => {
  try {
    // Resize and compress the image
    const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 400 } }],
        { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG }
    );

    // If the result is in cache directory, move it to permanent storage
    if (result.uri.startsWith(CACHE_DIR)) {
      await ensureDirExists();
      const thumbFilename = `thumb-${generateUUID()}.jpg`;
      const thumbPath = `${IMAGES_DIR}${thumbFilename}`;

      await FileSystem.copyAsync({ from: result.uri, to: thumbPath });

      // Clean up the cache file
      try {
        await FileSystem.deleteAsync(result.uri, { idempotent: true });
      } catch (e) {
        console.warn('Failed to delete cache file:', e);
      }

      console.log('✅ Thumbnail created:', thumbPath);
      return thumbPath;
    }

    console.log('✅ Thumbnail created:', result.uri);
    return result.uri;
  } catch (error) {
    console.error('❌ Error creating thumbnail:', error);
    throw error;
  }
};

/**
 * Gets the size of an image file in bytes
 * @param uri - URI of the image
 * @returns File size in bytes, or null if not found
 */
export const getImageSize = async (uri: string): Promise<number | null> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists && 'size' in fileInfo) {
      return fileInfo.size;
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting image size:', error);
    return null;
  }
};

/**
 * Clears all document images (useful for data reset)
 */
export const clearAllDocumentImages = async (): Promise<void> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(IMAGES_DIR, { idempotent: true });
      console.log('✅ All document images cleared');

      // Recreate the directory
      await ensureDirExists();
    }
  } catch (error) {
    console.error('❌ Error clearing document images:', error);
    throw error;
  }
};

/**
 * Gets total storage used by document images
 * @returns Total size in bytes
 */
export const getTotalStorageUsed = async (): Promise<number> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!dirInfo.exists) {
      return 0;
    }

    const files = await FileSystem.readDirectoryAsync(IMAGES_DIR);
    let totalSize = 0;

    for (const file of files) {
      const filePath = `${IMAGES_DIR}${file}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists && 'size' in fileInfo) {
        totalSize += fileInfo.size;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('❌ Error calculating storage used:', error);
    return 0;
  }
};

/**
 * Formats bytes to human-readable string
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};