import type { NotificationItem } from '@services/api/notificationApi';

export interface NotificationsListRow {
  id: number;
  type: string;
  title: string;
  body: string;
  meta: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
  navigationType: NotificationItem['navigation_type'];
  navigationId: string;
}

