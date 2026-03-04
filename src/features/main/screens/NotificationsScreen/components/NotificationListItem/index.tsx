import React, { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { NotificationListItemProps } from './@types';
import { createStyles } from './styles';

const formatRelativeTime = (createdAt: string): string => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return created.toLocaleDateString();
};

export const NotificationListItem = memo<NotificationListItemProps>(function NotificationListItem({
  item,
  onPress,
}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const timeLabel = useMemo(() => formatRelativeTime(item.createdAt), [item.createdAt]);
  const isUnread = item.readAt == null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, isUnread && styles.unreadContainer]}
      onPress={() => onPress(item)}
    >
      <View style={styles.titleRow}>
        <Text variant="bodyLarge" numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        {isUnread ? <View style={styles.unreadDot} /> : null}
      </View>

      <Text variant="bodySmall" numberOfLines={2} style={styles.body}>
        {item.body}
      </Text>

      <View style={styles.footer}>
        <Text variant="captionSmall" style={styles.meta}>
          {item.navigationType.toLowerCase().replace('_', ' ')}
        </Text>
        <Text variant="captionSmall" style={styles.time}>
          {timeLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

