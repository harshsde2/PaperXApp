/**
 * Push Notification Service
 *
 * Owns the FCM + notifee lifecycle for the app:
 *  - permission request (iOS + Android 13+)
 *  - device (FCM) token retrieval & refresh
 *  - foreground message display (via notifee, since FCM does not show a
 *    system notification while the app is in the foreground)
 *  - tap handling (foreground / background / quit) -> in-app navigation
 *
 * The background message handler lives in `index.js` (must be registered
 * outside the React tree). This module handles everything else and is driven
 * by the <NotificationProvider>.
 *
 * Tap routing intentionally reuses `resolveNotificationNavigation` so that
 * push notifications and the in-app notification feed navigate identically.
 */

import { Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  EventType,
  type Event as NotifeeEvent,
} from '@notifee/react-native';

import type { NotificationItem } from '@services/api/notificationApi';
import { resolveNotificationNavigation } from '@features/main/screens/NotificationsScreen/navigationResolver';
import { navigateFromRef, navigationContainerRef } from '@navigation/navigationRef';
import { SCREENS } from '@navigation/constants';

const ANDROID_CHANNEL_ID = 'default';
const ANDROID_CHANNEL_NAME = 'General';

/**
 * The `data` payload we expect the backend to attach to every FCM message.
 * All FCM data values are strings on the wire.
 */
export interface PushDataPayload {
  type?: string;
  navigation_type?: string;
  navigation_id?: string;
  /** JSON-encoded string of the notification meta (optional). */
  meta?: string;
  [key: string]: string | undefined;
}

/** When a tap arrives before navigation is ready, park it here and flush later. */
let pendingNavigationData: PushDataPayload | null = null;

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

/**
 * Ask the user for notification permission.
 * Returns true if we are authorized (or provisionally authorized) to post.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  // notifee handles the Android 13+ POST_NOTIFICATIONS runtime prompt.
  await notifee.requestPermission();

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

// ---------------------------------------------------------------------------
// Token
// ---------------------------------------------------------------------------

/**
 * Retrieve the current FCM device token.
 * On iOS we must register for remote messages before a token is available.
 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();

    // Phase 1 checkpoint: this token is what you paste into the Firebase
    // Console "Send test message" box to verify end-to-end delivery.
    // eslint-disable-next-line no-console
    console.log('[push] FCM token:', token);

    return token ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[push] Failed to get FCM token', error);
    return null;
  }
};

/** Subscribe to token rotation. Returns the unsubscribe fn. */
export const onFcmTokenRefresh = (
  handler: (token: string) => void
): (() => void) => messaging().onTokenRefresh(handler);

// ---------------------------------------------------------------------------
// Android channel
// ---------------------------------------------------------------------------

export const ensureAndroidChannel = async (): Promise<void> => {
  if (Platform.OS !== 'android') {
    return;
  }
  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: ANDROID_CHANNEL_NAME,
    importance: AndroidImportance.HIGH,
  });
};

// ---------------------------------------------------------------------------
// Display (foreground)
// ---------------------------------------------------------------------------

/**
 * Render an incoming FCM message as a local notification via notifee.
 * Used for foreground messages (and the JS background handler in index.js).
 */
export const displayNotification = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): Promise<void> => {
  const title =
    remoteMessage.notification?.title ?? remoteMessage.data?.title?.toString();
  const body =
    remoteMessage.notification?.body ?? remoteMessage.data?.body?.toString();

  if (!title && !body) {
    return;
  }

  await notifee.displayNotification({
    title,
    body,
    // Carry the FCM data through so the tap handler can route.
    data: (remoteMessage.data ?? {}) as Record<string, string>,
    android: {
      channelId: ANDROID_CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default' },
      smallIcon: 'ic_launcher',
    },
    ios: {
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
};

// ---------------------------------------------------------------------------
// Navigation on tap
// ---------------------------------------------------------------------------

/** Build the minimal NotificationItem shape the resolver needs from a data payload. */
const dataToNotificationItem = (data: PushDataPayload): NotificationItem | null => {
  if (!data?.navigation_type) {
    return null;
  }

  let meta: Record<string, unknown> = {};
  if (data.meta) {
    try {
      meta = JSON.parse(data.meta);
    } catch {
      meta = {};
    }
  }

  return {
    navigation_type: data.navigation_type,
    navigation_id: data.navigation_id ?? '',
    type: data.type,
    meta,
  } as unknown as NotificationItem;
};

/**
 * Route to the correct screen for a tapped notification.
 * If navigation isn't ready yet (cold start), the payload is parked and
 * flushed by `flushPendingNavigation()` once the container mounts.
 */
export const handleNotificationTap = (data?: PushDataPayload | null): void => {
  if (!data) {
    return;
  }

  if (!navigationContainerRef.isReady()) {
    pendingNavigationData = data;
    return;
  }

  const item = dataToNotificationItem(data);
  if (!item) {
    return;
  }

  const target = resolveNotificationNavigation(item);
  if (target) {
    navigateFromRef(target.screen, target.params);
  }
};

/** Called once navigation is ready (from the provider) to replay a cold-start tap. */
export const flushPendingNavigation = (): void => {
  if (pendingNavigationData) {
    const data = pendingNavigationData;
    pendingNavigationData = null;
    handleNotificationTap(data);
  }
};

// ---------------------------------------------------------------------------
// Listeners
// ---------------------------------------------------------------------------

/**
 * Register foreground + tap listeners. Returns a single unsubscribe fn that
 * tears all of them down.
 */
/**
 * True when the user is currently viewing the chat screen for this thread — in
 * which case a foreground "new message" banner would be redundant noise.
 */
const isViewingChatThread = (data?: PushDataPayload): boolean => {
  if (data?.navigation_type !== 'CHAT_THREAD' || !navigationContainerRef.isReady()) {
    return false;
  }
  const route = navigationContainerRef.getCurrentRoute();
  return (
    route?.name === SCREENS.SESSIONS.STRUCTURED_CHAT &&
    String((route.params as { threadId?: string } | undefined)?.threadId) ===
      String(data.navigation_id)
  );
};

export const registerForegroundHandlers = (): (() => void) => {
  // FCM message received while app is in foreground -> show it ourselves,
  // unless the user is already on that chat thread.
  const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    if (isViewingChatThread(remoteMessage.data as PushDataPayload | undefined)) {
      return;
    }
    await displayNotification(remoteMessage);
  });

  // Tap on an FCM system notification that opened the app from background.
  const unsubscribeOnOpen = messaging().onNotificationOpenedApp((remoteMessage) => {
    handleNotificationTap(remoteMessage?.data as PushDataPayload | undefined);
  });

  // Tap on a notifee-displayed notification while app is foreground/background.
  const unsubscribeNotifee = notifee.onForegroundEvent(
    ({ type, detail }: NotifeeEvent) => {
      if (type === EventType.PRESS) {
        handleNotificationTap(
          detail.notification?.data as PushDataPayload | undefined
        );
      }
    }
  );

  return () => {
    unsubscribeOnMessage();
    unsubscribeOnOpen();
    unsubscribeNotifee();
  };
};

/**
 * Handle the case where the app was launched from a quit state by tapping a
 * notification. Call once on startup.
 */
export const handleInitialNotification = async (): Promise<void> => {
  const initialMessage = await messaging().getInitialNotification();
  if (initialMessage) {
    handleNotificationTap(initialMessage.data as PushDataPayload | undefined);
  }

  // Same, but for a notifee-displayed notification.
  const initialNotifee = await notifee.getInitialNotification();
  if (initialNotifee) {
    handleNotificationTap(
      initialNotifee.notification.data as PushDataPayload | undefined
    );
  }
};
