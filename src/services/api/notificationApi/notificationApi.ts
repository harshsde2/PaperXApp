import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { useMemo } from 'react';
import { api } from '../client';
import { queryKeys } from '../queryClient';
import { NOTIFICATION_ENDPOINTS } from '@shared/constants/api';
import type {
  NotificationFeedParams,
  NotificationFeedResponse,
  NotificationItem,
  NotificationUnreadCountResponse,
} from './@types';

const DEFAULT_LIMIT = 20;

const parseFeedResponse = (response: any): NotificationFeedResponse => {
  const payload = response?.data ?? response;
  const data = payload?.data ?? [];
  const meta = payload?.meta ?? {};

  return {
    notifications: Array.isArray(data) ? data : [],
    pagination: {
      limit: Number(meta?.limit ?? DEFAULT_LIMIT),
      has_more: Boolean(meta?.has_more),
      next_cursor: typeof meta?.next_cursor === 'string' ? meta.next_cursor : null,
    },
  };
};

const parseUnreadResponse = (response: any): NotificationUnreadCountResponse => {
  const payload = response?.data ?? response;
  const data = payload?.data ?? {};

  return {
    unread_count: Number(data?.unread_count ?? 0),
  };
};

const markOneReadInCache = (
  cache: InfiniteData<NotificationFeedResponse> | undefined,
  notificationId: number
): InfiniteData<NotificationFeedResponse> | undefined => {
  if (!cache) return cache;

  const nowIso = new Date().toISOString();
  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      notifications: page.notifications.map((notification) =>
        notification.id === notificationId && notification.read_at == null
          ? { ...notification, read_at: nowIso }
          : notification
      ),
    })),
  };
};

const markAllReadInCache = (
  cache: InfiniteData<NotificationFeedResponse> | undefined
): InfiniteData<NotificationFeedResponse> | undefined => {
  if (!cache) return cache;

  const nowIso = new Date().toISOString();
  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      notifications: page.notifications.map((notification) =>
        notification.read_at == null ? { ...notification, read_at: nowIso } : notification
      ),
    })),
  };
};

const createCursorQueryParams = (pageParam: string | undefined, params?: NotificationFeedParams) => ({
  limit: params?.limit ?? DEFAULT_LIMIT,
  unread_only: params?.unread_only ?? false,
  ...(pageParam ? { cursor: pageParam } : {}),
});

export const useNotificationFeedInfinite = (params?: Omit<NotificationFeedParams, 'cursor'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.feed(),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }): Promise<NotificationFeedResponse> => {
      const response = await api.get(NOTIFICATION_ENDPOINTS.LIST, {
        params: createCursorQueryParams(pageParam, params),
      });
      return parseFeedResponse(response);
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_more ? (lastPage.pagination.next_cursor ?? undefined) : undefined,
    staleTime: 15_000,
  });
};

export const useNotificationUnreadCount = () => {
  return useQuery({
    queryKey: queryKeys.notifications.unread(),
    queryFn: async (): Promise<NotificationUnreadCountResponse> => {
      const response = await api.get(NOTIFICATION_ENDPOINTS.UNREAD_COUNT);
      return parseUnreadResponse(response);
    },
    staleTime: 10_000,
    refetchInterval: false,
    refetchOnReconnect: true,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      await api.post(NOTIFICATION_ENDPOINTS.MARK_READ(String(id)));
      return Number(id);
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.feed() });
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.unread() });

      const previousFeed = queryClient.getQueryData<InfiniteData<NotificationFeedResponse>>(
        queryKeys.notifications.feed()
      );
      const previousUnread = queryClient.getQueryData<NotificationUnreadCountResponse>(
        queryKeys.notifications.unread()
      );

      queryClient.setQueryData<InfiniteData<NotificationFeedResponse> | undefined>(
        queryKeys.notifications.feed(),
        (oldData) => markOneReadInCache(oldData, notificationId)
      );

      queryClient.setQueryData<NotificationUnreadCountResponse | undefined>(
        queryKeys.notifications.unread(),
        (oldData) => {
          if (!oldData) return oldData;
          return { unread_count: Math.max(0, oldData.unread_count - 1) };
        }
      );

      return { previousFeed, previousUnread };
    },
    onError: (_error, _notificationId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(queryKeys.notifications.feed(), context.previousFeed);
      }
      if (context?.previousUnread) {
        queryClient.setQueryData(queryKeys.notifications.unread(), context.previousUnread);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread() });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.feed() });
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.unread() });

      const previousFeed = queryClient.getQueryData<InfiniteData<NotificationFeedResponse>>(
        queryKeys.notifications.feed()
      );
      const previousUnread = queryClient.getQueryData<NotificationUnreadCountResponse>(
        queryKeys.notifications.unread()
      );

      queryClient.setQueryData<InfiniteData<NotificationFeedResponse> | undefined>(
        queryKeys.notifications.feed(),
        (oldData) => markAllReadInCache(oldData)
      );

      queryClient.setQueryData<NotificationUnreadCountResponse>(
        queryKeys.notifications.unread(),
        { unread_count: 0 }
      );

      return { previousFeed, previousUnread };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(queryKeys.notifications.feed(), context.previousFeed);
      }
      if (context?.previousUnread) {
        queryClient.setQueryData(queryKeys.notifications.unread(), context.previousUnread);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread() });
    },
  });
};

export const useFlattenedNotificationFeed = (
  pages: Array<NotificationFeedResponse> | undefined
): NotificationItem[] => {
  return useMemo(() => {
    if (!pages?.length) return [];

    const deduped = new Map<number, NotificationItem>();
    pages.forEach((page) => {
      page.notifications.forEach((item) => {
        if (!deduped.has(item.id)) {
          deduped.set(item.id, item);
        }
      });
    });

    return Array.from(deduped.values());
  }, [pages]);
};

