import React, { useMemo } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { SCREENS } from '@navigation/constants';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@services/api';
import {
  useGetInquiryChatThreads,
  type ChatThreadListItem,
} from '@services/api';
import { useMarkStructuredThreadRead } from '@services/api/sessionApi/sessionApi';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { ListItemSkeleton } from '@shared/components/skeletons';
import { createStyles } from './styles';
import { getThreadLastOpenedAt, markThreadOpenedNow } from '../../utils/threadReadState';

type RouteParams = {
  inquiryId?: string;
  inquiryTitle?: string;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'No activity yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No activity yet';
  return date.toLocaleString();
};

const isThreadNewSinceLastOpen = (
  lastMessageAt?: string | null,
  lastOpenedAt?: string | null
) => {
  if (!lastMessageAt) return false;
  const date = new Date(lastMessageAt);
  if (Number.isNaN(date.getTime())) return false;
  if (!lastOpenedAt) return true;
  const openedAt = new Date(lastOpenedAt);
  if (Number.isNaN(openedAt.getTime())) return true;
  return date.getTime() > openedAt.getTime();
};

export default function InquiryChatThreadsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const route = useRoute<{ params?: RouteParams }>();

  const inquiryId = Number(route.params?.inquiryId ?? 0);
  const inquiryTitle = route.params?.inquiryTitle;

  const { data, isLoading, refetch, isRefetching } = useGetInquiryChatThreads(inquiryId, {
    enabled: inquiryId > 0,
  });
  const showSkeleton = useSkeleton(isLoading);
  const markStructuredThreadRead = useMarkStructuredThreadRead();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const threads = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return [...list].sort((a, b) => {
      const aTime = new Date(a.last_message_at ?? 0).getTime();
      const bTime = new Date(b.last_message_at ?? 0).getTime();
      return bTime - aTime;
    });
  }, [data]);

  const renderThread = ({ item }: { item: ChatThreadListItem }) => {
    const threadId = Number(item.id ?? item.thread_id ?? 0);
    const hasValidThreadId = Number.isFinite(threadId) && threadId > 0;
    const partnerName =
      item.responder_user?.name ??
      item.responder_user?.company_name ??
      item.poster_user?.name ??
      `Responder #${item.responder_user?.id ?? item.responder_user_id ?? item.thread_id ?? item.id ?? '?'}`;

    const unreadCount = Number(item.unread_count ?? 0);
    const lastOpenedAt = getThreadLastOpenedAt(threadId);
    const showFresh = isThreadNewSinceLastOpen(item.last_message_at, lastOpenedAt);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          if (!hasValidThreadId) return;

          markThreadOpenedNow(threadId);
          markStructuredThreadRead.mutate(threadId);

          // Optimistically clear unread badge for a smoother UX.
          queryClient.setQueryData<ChatThreadListItem[] | undefined>(
            queryKeys.chat.structured.inquiryThreads(inquiryId),
            (existing) =>
              (existing ?? []).map((thread) =>
                Number(thread.id ?? thread.thread_id) === threadId
                  ? { ...thread, unread_count: 0 }
                  : thread
              )
          );

          navigation.navigate(SCREENS.SESSIONS.STRUCTURED_CHAT, {
            threadId: String(threadId),
            inquiryId: String(item.inquiry_id),
            partnerName,
          });
        }}
      >
        <View style={styles.cardTop}>
          <Text style={styles.partnerName} numberOfLines={1}>
            {partnerName}
          </Text>
          <View style={styles.cardRightPills}>
            {showFresh && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            )}
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
            {!!item.responder_role && (
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{item.responder_role.replace('_', ' ')}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.preview} numberOfLines={1}>
          {item.last_message_preview || 'No messages yet'}
        </Text>
        <Text style={styles.dateText}>{formatDate(item.last_message_at)}</Text>
      </TouchableOpacity>
    );
  };

  if (showSkeleton) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <ListItemSkeleton count={6} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaEdges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Responses Chat</Text>
        <Text style={styles.headerSubtitle} numberOfLines={2}>
          {inquiryTitle || `Inquiry #${inquiryId}`}
        </Text>

        <FlatList
          data={threads}
          keyExtractor={(item) => String(item.id ?? item.thread_id ?? 0)}
          renderItem={renderThread}
          contentContainerStyle={threads.length === 0 ? styles.centered : styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.primary.DEFAULT}
            />
          }
          ListEmptyComponent={<Text style={styles.emptyText}>No responder threads found yet.</Text>}
        />
      </View>
    </ScreenWrapper>
  );
}
