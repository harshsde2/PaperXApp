/**
 * Shared image picker utilities.
 * Returns backend-ready PickedImage { uri, type, name } for FormData/upload.
 */

import {
  launchImageLibrary,
  launchCamera,
  type ImageLibraryOptions,
  type CameraOptions,
} from 'react-native-image-picker';

/** Backend-ready image shape for FormData and upload APIs (iOS & Android). */
export interface PickedImage {
  uri: string;
  type: string;
  name: string;
}

const DEFAULT_LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  includeBase64: false,
};

const DEFAULT_CAMERA_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  includeBase64: false,
};

function assetToPickedImage(uri: string | undefined, type?: string, fileName?: string): PickedImage | null {
  if (!uri) return null;
  return {
    uri,
    type: type ?? 'image/jpeg',
    name: fileName ?? `image_${Date.now()}.jpg`,
  };
}

/**
 * Pick a single image from the device library.
 * Returns PickedImage for upload, or null on cancel/error.
 */
export async function pickImageFromLibrary(
  options?: Partial<ImageLibraryOptions>
): Promise<PickedImage | null> {
  const result = await launchImageLibrary({
    ...DEFAULT_LIBRARY_OPTIONS,
    ...options,
  });

  if (result.didCancel || !result.assets?.[0]) return null;
  if (result.errorCode) {
    if (__DEV__) {
      console.warn('[imagePicker] launchImageLibrary error:', result.errorCode, result.errorMessage);
    }
    return null;
  }

  const asset = result.assets[0];
  return assetToPickedImage(asset.uri, asset.type, asset.fileName);
}

/**
 * Pick a single image from the device camera.
 * Returns PickedImage for upload, or null on cancel/error.
 */
export async function pickImageFromCamera(
  options?: Partial<CameraOptions>
): Promise<PickedImage | null> {
  const result = await launchCamera({
    ...DEFAULT_CAMERA_OPTIONS,
    ...options,
  });

  if (result.didCancel || !result.assets?.[0]) return null;
  if (result.errorCode) {
    if (__DEV__) {
      console.warn('[imagePicker] launchCamera error:', result.errorCode, result.errorMessage);
    }
    return null;
  }

  const asset = result.assets[0];
  return assetToPickedImage(asset.uri, asset.type, asset.fileName);
}
