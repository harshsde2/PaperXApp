import { SCREENS } from '@navigation/constants';
import type { MainStackParamList } from '@navigation/MainNavigator';
import type { NotificationItem } from '@services/api/notificationApi';

export interface NotificationNavigationTarget {
  screen: keyof MainStackParamList;
  params?: MainStackParamList[keyof MainStackParamList];
}

export const resolveNotificationNavigation = (
  notification: NotificationItem
): NotificationNavigationTarget | null => {
  const viewTarget = String((notification.meta as Record<string, unknown> | undefined)?.view_target ?? '');

  switch (notification.navigation_type) {
    case 'CHAT_THREAD':
      return {
        screen: SCREENS.SESSIONS.STRUCTURED_CHAT,
        params: {
          threadId: String(notification.navigation_id),
        },
      };
    case 'SESSION':
      if (viewTarget === 'poster') {
        return {
          screen: SCREENS.SESSIONS.DETAILS,
          params: {
            sessionId: String(notification.navigation_id),
          },
        };
      }

      if (viewTarget === 'responder' || notification.type === 'MATCH_FOUND') {
        return {
          screen: SCREENS.SESSIONS.RESPONDER_DETAILS,
          params: {
            sessionId: String(notification.navigation_id),
          },
        };
      }
      return {
        screen: SCREENS.SESSIONS.DETAILS,
        params: {
          sessionId: String(notification.navigation_id),
        },
      };
    case 'INQUIRY':
      return {
        screen: SCREENS.SESSIONS.INQUIRY_CHAT_THREADS,
        params: {
          inquiryId: String(notification.navigation_id),
        },
      };
    case 'RTD_ORDER':
      return {
        screen: SCREENS.CONVERTER_RTD.ORDER_DETAIL,
        params: {
          orderId: String(notification.navigation_id),
        },
      };
    case 'PAYMENT':
      return {
        screen: SCREENS.WALLET.TRANSACTION_HISTORY,
      };
    default:
      return null;
  }
};

