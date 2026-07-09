/**
 * NotificationProvider
 *
 * Boots the push-notification lifecycle once, near the root of the app:
 *  - ensures the Android channel exists
 *  - requests notification permission
 *  - fetches the FCM token, persists it (MMKV), and registers it with the
 *    backend whenever the user is authenticated
 *  - registers foreground message + tap listeners
 *  - replays a cold-start (quit-state) notification tap
 *  - re-registers on token rotation
 *
 * Registration is gated on auth because the backend endpoint is protected; the
 * effect re-runs when either the auth state or the token becomes available, so
 * ordering between "token arrives" and "user logs in" doesn't matter.
 */

import { useEffect, useState } from 'react';

import { useAppSelector } from '@store/hooks';
import { storageService } from '@services/storage/storageService';
import { registerDeviceToken } from '@services/api/deviceTokenApi';
import {
  ensureAndroidChannel,
  requestNotificationPermission,
  getFcmToken,
  registerForegroundHandlers,
  handleInitialNotification,
  onFcmTokenRefresh,
} from '@services/notifications';

import type { NotificationProviderProps } from './@types';

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // One-time native/FCM setup.
  useEffect(() => {
    let unsubscribeForeground: (() => void) | undefined;
    let unsubscribeTokenRefresh: (() => void) | undefined;
    let isMounted = true;

    const bootstrap = async () => {
      await ensureAndroidChannel();

      const granted = await requestNotificationPermission();
      if (!granted) {
        // eslint-disable-next-line no-console
        console.log('[push] Notification permission not granted');
        return;
      }

      const token = await getFcmToken();
      if (!isMounted) {
        return;
      }

      if (token) {
        storageService.setFcmToken(token);
        setFcmToken(token);
      }

      unsubscribeForeground = registerForegroundHandlers();

      unsubscribeTokenRefresh = onFcmTokenRefresh((newToken) => {
        storageService.setFcmToken(newToken);
        setFcmToken(newToken); // triggers the registration effect below
      });

      await handleInitialNotification();
    };

    bootstrap();

    return () => {
      isMounted = false;
      unsubscribeForeground?.();
      unsubscribeTokenRefresh?.();
    };
  }, []);

  // Register the token with the backend once we have both a token and an
  // authenticated session. Idempotent server-side (upsert by token).
  useEffect(() => {
    if (!isAuthenticated || !fcmToken) {
      return;
    }
    registerDeviceToken(fcmToken).catch((error) => {
      // eslint-disable-next-line no-console
      console.warn('[push] Failed to register device token', error);
    });
  }, [isAuthenticated, fcmToken]);

  return children;
};

export default NotificationProvider;
