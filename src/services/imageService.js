import { Platform, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { ACTIVE_PROVIDER, CLOUDINARY_CONFIG, SUPABASE_CONFIG } from '../config/storageConfig';
import { Buffer } from 'buffer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 5;
const COMPRESSION_QUALITY = 80;
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;

/**
 * Compress image if it exceeds max size
 */
const compressImage = async (uri, fileSize) => {
  if (fileSize <= MAX_FILE_SIZE) {
    return uri;
  }

  try {
    const ratio = Math.sqrt(MAX_FILE_SIZE / fileSize);
    const quality = Math.min(COMPRESSION_QUALITY, Math.floor(100 * ratio));

    const result = await ImageResizer.createResizedImage(
      uri,
      MAX_WIDTH,
      MAX_HEIGHT,
      'JPEG',
      quality,
      0,
      undefined,
      false,
      { mode: 'contain', onlyScaleDown: true }
    );

    return result.uri;
  } catch (error) {
    console.error('Image compression failed:', error);
    return uri;
  }
};

/**
 * Pick images from gallery
 */
export const pickImages = async (maxCount = MAX_IMAGES, existingImages = []) => {
  const remainingSlots = maxCount - existingImages.length;

  if (remainingSlots <= 0) {
    Alert.alert('Limit Reached', `You can only upload up to ${maxCount} images`);
    return existingImages;
  }

  return new Promise((resolve) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: remainingSlots,
        quality: 1,
        includeBase64: false,
      },
      async (response) => {
        if (response.didCancel) {
          resolve(existingImages);
          return;
        }

        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
          resolve(existingImages);
          return;
        }

        const newImages = [];
        for (const asset of response.assets || []) {
          if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
            const compressedUri = await compressImage(asset.uri, asset.fileSize);
            newImages.push(compressedUri);
          } else {
            newImages.push(asset.uri);
          }
        }

        resolve([...existingImages, ...newImages]);
      }
    );
  });
};

/**
 * Take photo with camera
 */
export const takePhoto = async () => {
  return new Promise((resolve) => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
        saveToPhotos: false,
      },
      async (response) => {
        if (response.didCancel || response.errorCode) {
          resolve(null);
          return;
        }

        const asset = response.assets?.[0];
        if (!asset?.uri) {
          resolve(null);
          return;
        }

        if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
          const compressedUri = await compressImage(asset.uri, asset.fileSize);
          resolve(compressedUri);
        } else {
          resolve(asset.uri);
        }
      }
    );
  });
};

// ============================================
// STORAGE PROVIDER ABSTRACTION
// ============================================

/**
 * Upload image to Cloudinary using base64
 */
const uploadToCloudinary = async (localUri, folder = '') => {
  const { cloudName, uploadPreset, folder: baseFolder } = CLOUDINARY_CONFIG;

  const fullFolder = folder ? `${baseFolder}/${folder}` : baseFolder;

  // Read file as base64
  const RNFS = require('react-native-fs');
  let base64Data;

  try {
    // Handle different URI formats
    let filePath = localUri;
    if (localUri.startsWith('file://')) {
      filePath = localUri.replace('file://', '');
    }

    base64Data = await RNFS.readFile(filePath, 'base64');
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('Failed to read image file');
  }

  const formData = new FormData();
  formData.append('file', `data:image/jpeg;base64,${base64Data}`);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', fullFolder);

  console.log('Uploading to Cloudinary:', { cloudName, uploadPreset, fullFolder });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error('Cloudinary upload error:', data);
    throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
  }

  console.log('Cloudinary upload success:', data.secure_url);
  return data.secure_url;
};

/**
 * Upload image to Supabase Storage
 */
const uploadToSupabase = async (localUri, folder = '') => {
  const { url, anonKey, bucket } = SUPABASE_CONFIG;
  const RNFS = require('react-native-fs');

  // Clean URL
  const supabaseUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  // Generate filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  // Ensure we don't end up with // if folder is empty
  const cleanFolder = folder && folder.endsWith('/') ? folder.slice(0, -1) : folder;
  const filename = `${cleanFolder ? cleanFolder + '/' : ''}${timestamp}_${randomId}.jpg`;

  try {
    // Read file as base64
    let base64Data;
    let filePath = localUri;
    if (localUri.startsWith('file://')) {
      filePath = localUri.replace('file://', '');
    }

    base64Data = await RNFS.readFile(filePath, 'base64');

    // Upload via REST API
    const response = await fetch(
      `${supabaseUrl}/storage/v1/object/${bucket}/${filename}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'image/jpeg',
          'x-upsert': 'false',
        },
        body: Buffer.from(base64Data, 'base64'),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase upload error:', errorText);
      throw new Error(`Failed to upload to Supabase: ${errorText}`);
    }

    // Construct public URL
    // Public URL format: {supabaseUrl}/storage/v1/object/public/{bucket}/{filename}
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;

    console.log('Supabase upload success:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('Supabase upload failed:', error);
    throw error;
  }
};

/**
 * Upload image using the active provider
 */
export const uploadImage = async (localUri, storagePath) => {
  try {
    switch (ACTIVE_PROVIDER) {
      case 'supabase':
        // For Supabase, storagePath is treated as folder path prefix if needed
        // but our implementation handles full path generation internally
        // We'll pass the storagePath (e.g., 'items/userid') as the folder
        return await uploadToSupabase(localUri, storagePath);

      case 'cloudinary':
        return await uploadToCloudinary(localUri, storagePath);

      case 'firebase':
        // Legacy Firebase support - import dynamically if needed
        const storage = require('@react-native-firebase/storage').default;
        const reference = storage().ref(storagePath);
        await reference.putFile(localUri);
        return await reference.getDownloadURL();

      case 's3':
        // TODO: Implement S3 upload
        throw new Error('S3 provider not yet implemented');

      default:
        throw new Error(`Unknown storage provider: ${ACTIVE_PROVIDER}`);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images
 */
/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (localUris, basePath, onProgress) => {
  const downloadUrls = [];

  for (let i = 0; i < localUris.length; i++) {
    const uri = localUris[i];
    // Don't append filename here, let uploadToSupabase/Cloudinary handle it
    // just pass the folder path
    const storagePath = basePath; 

    try {
      const url = await uploadImage(uri, storagePath);
      downloadUrls.push(url);

      if (onProgress) {
        onProgress(i + 1, localUris.length);
      }
    } catch (error) {
      console.error(`Failed to upload image ${i + 1}:`, error);
      // Continue with other images
    }
  }

  return downloadUrls;
};

/**
 * Upload avatar image
 */
export const uploadAvatar = async (localUri, userId) => {
  const storagePath = `avatars/${userId}`;
  return uploadImage(localUri, storagePath);
};

/**
 * Delete image (provider-specific)
 */
export const deleteImage = async (imageUrl) => {
  try {
    switch (ACTIVE_PROVIDER) {
      case 'cloudinary':
        // Cloudinary deletion requires Admin API (backend)
        // For now, we'll just log it - implement backend endpoint if needed
        console.log('Cloudinary deletion should be handled by backend:', imageUrl);
        break;

      case 'firebase':
        const storage = require('@react-native-firebase/storage').default;
        const reference = storage().refFromURL(imageUrl);
        await reference.delete();
        break;

      case 's3':
        // TODO: Implement S3 deletion
        break;
    }
  } catch (error) {
    console.error('Delete failed:', error);
  }
};

/**
 * Show image picker options
 */
export const showImagePickerOptions = (onImageSelected) => {
  Alert.alert(
    'Select Photo',
    'Choose an option',
    [
      {
        text: 'Take Photo',
        onPress: async () => {
          const uri = await takePhoto();
          if (uri) onImageSelected(uri);
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const images = await pickImages(1, []);
          if (images.length > 0) onImageSelected(images[0]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};
