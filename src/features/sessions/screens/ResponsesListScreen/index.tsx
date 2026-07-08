import React, { useMemo, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { Skeleton } from '@shared/components/Skeleton';
import { AppIcon } from '@assets/svgs';
import { useGetAllChatThreads } from '@services/api';
import type { ChatThreadListItem } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { createStyles } from './styles';

const formatTime = (iso: string | null | undefined): string => {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const getRoleLabel = (role: string | null | undefined): string => {
  if (!role) return '';
  const map: Record<string, string> = {
    dealer: 'Dealer',
    converter: 'Converter',
    brand: 'Brand',
    machine_dealer: 'Machine Dealer',
    machinedealer: 'Machine Dealer',
    scrap_dealer: 'Scrap Dealer',
    mill: 'Mill',
  };
  return map[role.toLowerCase()] ?? role;
};

const UnifiedInboxScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { data: threads, isLoading, isRefetching, refetch } = useGetAllChatThreads();
  const showSkeleton = useSkeleton(isLoading);

  const openChat = useCallback(
    (item: ChatThreadListItem) => {
      navigation.navigate(SCREENS.SESSIONS.STRUCTURED_CHAT, {
        threadId: String(item.id),
        inquiryId: String(item.inquiry_id),
        partnerName: item.responder_label || 'Responder',
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatThreadListItem }) => {
      const name = item.responder_label || 'Responder';
      const role = getRoleLabel(item.responder_role);
      const preview = item.last_message_preview || 'Tap to open chat';
      const time = formatTime(item.last_message_at);
      const unread = item.unread_count ?? 0;
      const inquiryTitle = item.inquiry_title || 'Inquiry';

      return (
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => openChat(item)}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.rowContent}>
            <View style={styles.rowTop}>
              <Text style={styles.nameText} numberOfLines={1}>
                {name}
              </Text>
              <Text style={styles.timeText}>{time}</Text>
            </View>

            <View style={styles.rowMid}>
              <Text style={styles.inquiryLabel} numberOfLines={1}>
                {inquiryTitle}
              </Text>
              {role ? (
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{role}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.rowBottom}>
              <Text style={styles.previewText} numberOfLines={1}>
                {preview}
              </Text>
              {unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{unread > 99 ? '99+' : unread}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [openChat, styles, theme],
  );

  const renderSkeleton = () => (
    <View style={styles.listContent}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={`skeleton-${i}`} style={styles.skeletonRow}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <View style={styles.skeletonBody}>
            <Skeleton height={14} width="55%" />
            <Skeleton height={11} width="40%" />
            <Skeleton height={11} width="75%" />
          </View>
        </View>
      ))}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <AppIcon.Messages width={48} height={48} color={theme.colors.text.disabled} />
      <Text style={styles.emptyTitle}>No chats yet</Text>
      <Text style={styles.emptySubtitle}>
        Your conversations will appear here once you start receiving responses to your posts.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppIcon.ArrowLeft width={24} height={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      {showSkeleton ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={threads ?? []}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={
            (threads ?? []).length === 0 ? styles.centered : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.primary.DEFAULT}
              colors={[theme.colors.primary.DEFAULT]}
            />
          }
        />
      )}
    </View>
  );
};

export default UnifiedInboxScreen;
