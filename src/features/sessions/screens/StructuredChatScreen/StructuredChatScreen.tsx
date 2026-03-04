import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { useAppSelector } from '@store/hooks';
import { useQueryClient } from '@tanstack/react-query';
import {
  queryKeys,
  useGetThreadMessagesInfinite,
  useSendThreadMessage,
  type ThreadMessage,
} from '@services/api';
import { createStyles } from './styles';
import { markThreadOpenedNow } from '../../utils/threadReadState';

const SEND_COOLDOWN_MS = 800;
const POLL_INTERVAL_MS = 8000;

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function resolveUserId(authUser: any): number | null {
  if (!authUser) return null;
  for (const key of ['user_id', 'id']) {
    const n = Number(authUser[key]);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

const MessageBubble = React.memo(
  function MessageBubble({
    item,
    isMine,
    styles,
  }: {
    item: ThreadMessage;
    isMine: boolean;
    styles: any;
  }) {
    return (
      <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.partnerMessage]}>
        <Text style={isMine ? styles.myMessageText : styles.partnerMessageText}>
          {item.body}
        </Text>
        <Text style={styles.messageTime}>
          {formatTime(item.created_at)}
          {item.status === 'pending' ? '  Sending...' : ''}
        </Text>
      </View>
    );
  },
  (prev, next) => prev.item.id === next.item.id && prev.item.status === next.item.status && prev.isMine === next.isMine
);

export default function StructuredChatScreen() {
  const route = useRoute<any>();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const threadId = Number(route.params?.threadId ?? 0);
  const inquiryId = Number(route.params?.inquiryId ?? 0);
  const hasValidThreadId = Number.isFinite(threadId) && threadId > 0;
  const isFocused = useIsFocused();

  const authUser = useAppSelector((state) => state.auth.user);
  const currentUserId = useMemo(() => resolveUserId(authUser), [authUser]);

  const [text, setText] = useState('');
  const [optimisticMessages, setOptimisticMessages] = useState<ThreadMessage[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);

  const listRef = useRef<FlatList<ThreadMessage>>(null);
  const hasInitialScrolledRef = useRef(false);
  const isNearBottomRef = useRef(true);
  const prevMessageCountRef = useRef(0);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const textRef = useRef('');
  const lastSendTimeRef = useRef(0);
  const isSendingRef = useRef(false);

  useEffect(() => {
    if (hasValidThreadId) {
      markThreadOpenedNow(threadId);
    }
  }, [hasValidThreadId, threadId]);

  useEffect(() => {
    hasInitialScrolledRef.current = false;
    prevMessageCountRef.current = 0;
  }, [threadId]);

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetThreadMessagesInfinite(
    threadId,
    { limit: 20 },
    {
      enabled: hasValidThreadId,
      refetchInterval: isFocused ? POLL_INTERVAL_MS : false,
    }
  );

  const sendMessage = useSendThreadMessage();

  const serverMessageIds = useMemo(() => {
    const ids = new Set<number>();
    for (const page of data?.pages ?? []) {
      for (const msg of page.data) {
        ids.add(msg.id);
      }
    }
    return ids;
  }, [data]);

  const messages = useMemo(() => {
    const serverMessages = (data?.pages ?? []).flatMap((page) => page.data);
    const pendingOnly = optimisticMessages.filter((m) => !serverMessageIds.has(m.id));
    const combined = [...serverMessages, ...pendingOnly];
    combined.sort((a, b) => a.id - b.id);
    return combined;
  }, [data, optimisticMessages, serverMessageIds]);

  const scrollToEndSmooth = useCallback((animated = true) => {
    InteractionManager.runAfterInteractions(() => {
      listRef.current?.scrollToEnd({ animated });
    });
  }, []);

  const handleContentSizeChange = useCallback(
    (_w: number, h: number) => {
      if (messages.length === 0 || h <= 0) return;
      if (!hasInitialScrolledRef.current) {
        hasInitialScrolledRef.current = true;
        prevMessageCountRef.current = messages.length;
        scrollToEndSmooth(false);
      } else if (isNearBottomRef.current && messages.length > prevMessageCountRef.current) {
        prevMessageCountRef.current = messages.length;
        scrollToEndSmooth(true);
      } else {
        prevMessageCountRef.current = messages.length;
      }
    },
    [messages.length, scrollToEndSmooth]
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
      isNearBottomRef.current = distanceFromBottom < 120;
    },
    []
  );

  const handleTextChange = useCallback((value: string) => {
    textRef.current = value;
    setText(value);
    setSendError((prev) => (prev ? null : prev));
  }, []);

  const handleSend = useCallback(() => {
    const body = textRef.current.trim();
    if (!body || !hasValidThreadId) return;
    if (isSendingRef.current) return;

    const now = Date.now();
    if (now - lastSendTimeRef.current < SEND_COOLDOWN_MS) return;

    isSendingRef.current = true;
    lastSendTimeRef.current = now;
    setSendError(null);

    const tempId = now + 1e12;
    const optimistic: ThreadMessage = {
      id: tempId,
      thread_id: threadId,
      sender_user_id: currentUserId ?? 0,
      sender_role: authUser?.primary_role ?? null,
      body,
      attachment: null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOptimisticMessages((prev) => [...prev, optimistic]);
    textRef.current = '';
    setText('');
    isNearBottomRef.current = true;

    InteractionManager.runAfterInteractions(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });

    sendMessage.mutate(
      { threadId, payload: { body } },
      {
        onSuccess: (createdMessage) => {
          isSendingRef.current = false;
          setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempId));
          setSendError(null);

          const normalized = createdMessage && typeof createdMessage === 'object'
            ? {
                id: Number(createdMessage.id),
                thread_id: Number(createdMessage.thread_id ?? threadId),
                sender_user_id: Number(createdMessage.sender_user_id ?? currentUserId),
                sender_role: createdMessage.sender_role ?? authUser?.primary_role ?? null,
                body: String(createdMessage.body ?? body),
                attachment: createdMessage.attachment ?? null,
                status: createdMessage.status ?? 'sent',
                created_at: createdMessage.created_at ?? new Date().toISOString(),
                updated_at: createdMessage.updated_at ?? new Date().toISOString(),
              }
            : null;

          if (normalized && normalized.id > 0) {
            queryClient.setQueryData(
              queryKeys.chat.structured.threadMessages(threadId, { limit: 20 }),
              (old: any) => {
                if (!old?.pages?.length) return old;
                const [firstPage, ...rest] = old.pages;
                const exists = firstPage.data.some((m: any) => Number(m.id) === normalized.id);
                if (exists) return old;
                return {
                  ...old,
                  pages: [
                    {
                      ...firstPage,
                      data: [...firstPage.data, normalized],
                    },
                    ...rest,
                  ],
                };
              }
            );
          }

          if (inquiryId > 0) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.chat.structured.inquiryThreads(inquiryId),
            });
          }
          InteractionManager.runAfterInteractions(() => {
            listRef.current?.scrollToEnd({ animated: true });
          });
        },
        onError: (error) => {
          isSendingRef.current = false;
          setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempId));
          textRef.current = body;
          setText(body);
          setSendError(error?.message || 'Message failed to send. Please try again.');
        },
      }
    );
  }, [hasValidThreadId, threadId, inquiryId, currentUserId, authUser?.primary_role, sendMessage, queryClient]);

  const renderItem = useCallback(
    ({ item }: { item: ThreadMessage }) => {
      const senderId = Number(item.sender_user_id);
      const mine = currentUserId != null && senderId === currentUserId;
      return <MessageBubble item={item} isMine={mine} styles={styles} />;
    },
    [currentUserId, styles]
  );

  const keyExtractor = useCallback((item: ThreadMessage) => String(item.id), []);

  const handleFetchOlder = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    await fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const listHeaderComponent = useMemo(() => {
    if (!hasNextPage) return null;
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadMoreLoadingRow}>
          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
        </View>
      );
    }
    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={handleFetchOlder}>
        <Text style={styles.loadMoreText}>Load older messages</Text>
      </TouchableOpacity>
    );
  }, [hasNextPage, isFetchingNextPage, handleFetchOlder, styles, theme.colors.primary.DEFAULT]);

  const listEmptyComponent = useMemo(
    () => <Text style={styles.emptyText}>No messages yet. Start chatting.</Text>,
    [styles.emptyText]
  );

  const handleRefresh = useCallback(() => {
    setIsManualRefreshing(true);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isRefetching && isManualRefreshing) {
      setIsManualRefreshing(false);
    }
  }, [isRefetching, isManualRefreshing]);

  const isSendDisabled = !text.trim();

  if (!hasValidThreadId) {
    return (
      <ScreenWrapper safeAreaEdges={['bottom', 'left', 'right']}>
        <View style={styles.centered}>
          <Text style={styles.invalidThreadText}>
            Unable to open this chat thread. Please go back and try again.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (isLoading) {
    return (
      <ScreenWrapper safeAreaEdges={['bottom', 'left', 'right']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaEdges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          windowSize={7}
          maxToRenderPerBatch={8}
          initialNumToRender={15}
          removeClippedSubviews={Platform.OS === 'android'}
          scrollEventThrottle={64}
          onScroll={handleScroll}
          onContentSizeChange={handleContentSizeChange}
          {...(Platform.OS === 'ios' && {
            maintainVisibleContentPosition: {
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 5,
            },
          })}
          refreshControl={
            <RefreshControl
              refreshing={isManualRefreshing && isRefetching}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary.DEFAULT}
            />
          }
          contentContainerStyle={messages.length === 0 ? styles.centered : styles.listContent}
          ListHeaderComponent={listHeaderComponent}
          ListEmptyComponent={listEmptyComponent}
        />

        {!!sendError && <Text style={styles.composerErrorText}>{sendError}</Text>}

        <View style={styles.composerContainer}>
          <TextInput
            value={text}
            onChangeText={handleTextChange}
            multiline
            placeholder="Type a message"
            placeholderTextColor={theme.colors.text.tertiary}
            style={styles.input}
          />
          <TouchableOpacity
            style={[styles.sendButton, isSendDisabled && styles.sendButtonDisabled]}
            disabled={isSendDisabled}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
