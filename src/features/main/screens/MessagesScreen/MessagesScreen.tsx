import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@store/hooks';
import { setMessagesUnreadCount } from '@store/slices/uiSlice';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useGetChatList } from '@services/api';
import type { ChatListItem } from '@services/api';
import { SCREENS } from '@navigation/constants';

interface MessageRow {
  id: string;
  sessionId: number;
  inquiryId: number;
  partnerId: number | string | null;
  senderName: string;
  senderCompany: string;
  lastMessage: string;
  time: string;
  unread: number;
}

function formatRelativeTime(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

const MessagesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { data: chatList = [], isLoading, isRefetching, refetch } = useGetChatList();

  const messages: MessageRow[] = useMemo(() => {
    return (chatList as ChatListItem[]).map((item, index) => ({
      id: item.partner_id != null ? `${item.session_id}_${item.partner_id}` : `${item.session_id}_${index}`,
      sessionId: item.session_id,
      inquiryId: item.inquiry_id,
      partnerId: item.partner_id ?? null,
      senderName: item.partner_name,
      senderCompany: item.partner_company,
      lastMessage: item.last_message || 'No message yet',
      time: formatRelativeTime(item.last_message_at),
      unread: item.unread_count ?? 0,
    }));
  }, [chatList]);

  const dispatch = useAppDispatch();
  const totalUnread = useMemo(
    () => messages.reduce((sum, m) => sum + m.unread, 0),
    [messages]
  );
  const badgeCount = totalUnread > 0 ? totalUnread : messages.length;
  useEffect(() => {
    dispatch(setMessagesUnreadCount(badgeCount));
  }, [dispatch, badgeCount]);

  const handlePressItem = useCallback(
    (item: MessageRow) => {
      navigation.navigate(SCREENS.SESSIONS.CHAT, {
        sessionId: String(item.sessionId),
        partnerId: item.partnerId != null ? String(item.partnerId) : '',
        partnerName: item.senderName,
        inquiryRef: String(item.inquiryId),
      });
    },
    [navigation]
  );

  const renderMessageItem = useCallback(
    ({ item }: { item: MessageRow }) => (
      <TouchableOpacity
        style={styles.messageCard}
        activeOpacity={0.7}
        onPress={() => handlePressItem(item)}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.senderName.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.senderName} numberOfLines={1}>
              {item.senderName}
            </Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
          <Text style={styles.senderCompany} numberOfLines={1}>
            {item.senderCompany}
          </Text>
          <Text
            style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [handlePressItem]
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <AppIcon.Search width={24} height={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {messages.length === 0 ? (
        <ScrollView
          contentContainerStyle={[styles.emptyWrap, styles.centered]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#4F46E5"
            />
          }
        >
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>
            When you're shortlisted or have an active chat, it will appear here.
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#4F46E5"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  messageCard: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4F46E5',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  senderCompany: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  lastMessageUnread: {
    color: '#374151',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default MessagesScreen;
