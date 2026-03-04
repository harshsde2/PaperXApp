export type NotificationNavigationType =
  | 'CHAT_THREAD'
  | 'SESSION'
  | 'INQUIRY'
  | 'RTD_ORDER'
  | 'PAYMENT';

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body: string;
  meta: Record<string, unknown>;
  navigation_type: NotificationNavigationType;
  navigation_id: string;
  read_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface NotificationFeedPagination {
  limit: number;
  has_more: boolean;
  next_cursor: string | null;
}

export interface NotificationFeedResponse {
  notifications: NotificationItem[];
  pagination: NotificationFeedPagination;
}

export interface NotificationFeedParams {
  limit?: number;
  unread_only?: boolean;
  cursor?: string;
}

export interface NotificationUnreadCountResponse {
  unread_count: number;
}
