import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@assets/svgs';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { useTheme } from '@theme/index';
import { useNavigationHelpers } from '@navigation/helpers/useNavigationHelpers';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { ListItemSkeleton } from '@shared/components/skeletons';
import {
  useFlattenedNotificationFeed,
  useNotificationMarkAllRead,
  useNotificationMarkRead,
  useNotificationFeedInfinite,
  useNotificationUnreadCount,
} from '@services/api';
import type { NotificationsListRow } from './@types';
import { NotificationListItem } from './components/NotificationListItem';
import { createStyles } from './styles';
import { resolveNotificationNavigation } from './navigationResolver';

const NotificationsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigationHelpers();
  const insets = useSafeAreaInsets();

  const feedQuery = useNotificationFeedInfinite({ limit: 20 });
  useNotificationUnreadCount();
  const markReadMutation = useNotificationMarkRead();
  const markAllReadMutation = useNotificationMarkAllRead();

  const notificationItems = useFlattenedNotificationFeed(feedQuery.data?.pages).map<NotificationsListRow>(
    (notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      meta: notification.meta ?? {},
      readAt: notification.read_at,
      createdAt: notification.created_at,
      navigationType: notification.navigation_type,
      navigationId: notification.navigation_id,
    })
  );

  const visibleUnreadCount = useMemo(
    () => notificationItems.reduce((count, item) => (item.readAt == null ? count + 1 : count), 0),
    [notificationItems]
  );

  const handleRefresh = useCallback(() => {
    feedQuery.refetch();
  }, [feedQuery]);

  const handleLoadMore = useCallback(() => {
    if (!feedQuery.hasNextPage || feedQuery.isFetchingNextPage) return;
    feedQuery.fetchNextPage();
  }, [feedQuery]);

  const handlePressNotification = useCallback(
    (item: NotificationsListRow) => {
      if (item.readAt == null) {
        markReadMutation.mutate(item.id);
      }

      const destination = resolveNotificationNavigation({
        id: item.id,
        type: item.type,
        title: item.title,
        body: item.body,
        meta: item.meta,
        navigation_type: item.navigationType,
        navigation_id: item.navigationId,
        read_at: item.readAt,
        created_at: item.createdAt,
      });

      if (!destination) return;
      if (destination.params === undefined) {
        navigation.navigate(destination.screen);
      } else {
        navigation.navigate(destination.screen, destination.params as never);
      }
    },
    [markReadMutation, navigation]
  );

  const handleMarkAllRead = useCallback(() => {
    if (visibleUnreadCount === 0) return;
    markAllReadMutation.mutate();
  }, [markAllReadMutation, visibleUnreadCount]);

  const renderItem = useCallback(
    ({ item }: { item: NotificationsListRow }) => (
      <NotificationListItem item={item} onPress={handlePressNotification} />
    ),
    [handlePressNotification]
  );

  const listFooter = useMemo(() => {
    if (!feedQuery.isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }, [feedQuery.isFetchingNextPage, styles.footerLoading, theme.colors.primary.DEFAULT]);

  const isInitialLoading = feedQuery.isLoading && notificationItems.length === 0;
  const showSkeleton = useSkeleton(isInitialLoading);

  if (showSkeleton) {
    return (
      <View style={[styles.container, { paddingHorizontal: theme.spacing[4], paddingTop: insets.top + theme.spacing[3] }]}>
        <ListItemSkeleton count={7} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing[2] }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <AppIcon.ArrowLeft width={24} height={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h5" style={styles.title}>
          Notifications
        </Text>
        <CustomButton
          title="Mark all read"
          variant="secondary"
          size="sm"
          onPress={handleMarkAllRead}
          disabled={visibleUnreadCount === 0 || markAllReadMutation.isPending}
          style={styles.markAllButton}
        />
      </View>

      <FlatList
        data={notificationItems}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, notificationItems.length === 0 && styles.emptyWrap]}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        initialNumToRender={8}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text variant="bodyLarge" style={styles.emptyTitle}>
              You're all caught up
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtitle}>
              New updates will appear here.
            </Text>
          </View>
        }
        ListFooterComponent={listFooter}
        refreshControl={
          <RefreshControl
            refreshing={feedQuery.isRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
      />
    </View>
  );
};

export default NotificationsScreen;

