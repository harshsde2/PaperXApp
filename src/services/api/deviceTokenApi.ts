/**
 * Device Token API
 *
 * Imperative helpers (not React Query hooks) for registering / unregistering
 * the device's FCM token with the backend. Called from the notification
 * lifecycle and the logout flow, outside of component render.
 */

import { Platform } from 'react-native';
import { api } from './client';
import { DEVICE_TOKEN_ENDPOINTS } from '@shared/constants/api';
import { storageService } from '@services/storage/storageService';

/** POST the current FCM token so the backend can push to this device. */
export const registerDeviceToken = async (token: string): Promise<void> => {
  await api.post(DEVICE_TOKEN_ENDPOINTS.REGISTER, {
    token,
    platform: Platform.OS, // 'ios' | 'android'
  });
};

/** DELETE a specific token from the backend (device.data body for axios). */
export const unregisterDeviceToken = async (token: string): Promise<void> => {
  await api.delete(DEVICE_TOKEN_ENDPOINTS.UNREGISTER, { data: { token } });
};

/**
 * Best-effort unregister of the token stored in MMKV. Safe to call during
 * logout: swallows errors so a failed call never blocks sign-out. Must run
 * BEFORE auth is cleared, while the bearer token is still valid.
 */
export const unregisterCurrentDeviceToken = async (): Promise<void> => {
  const token = storageService.getFcmToken();
  if (!token) {
    return;
  }
  try {
    await unregisterDeviceToken(token);
  } catch (error) {
    // Non-fatal: the token will be reassigned on next login anyway.
    console.warn('[push] Failed to unregister device token', error);
  }
};
