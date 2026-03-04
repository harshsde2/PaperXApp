import type { NotificationsListRow } from '../../@types';

export interface NotificationListItemProps {
  item: NotificationsListRow;
  onPress: (item: NotificationsListRow) => void;
}

