/**
 * React Query QueryClient Configuration
 * Centralized configuration for TanStack Query
 * 
 * Note: We do NOT persist cache to storage because most data is time-sensitive
 * and real-time. React Query uses in-memory caching only (lost on app restart).
 * For persistent storage, we use MMKV only for auth tokens and user preferences.
 */

import { QueryClient } from '@tanstack/react-query';
import { QUERY_CONFIG } from '@shared/constants/config';

/**
 * Create and configure QueryClient
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.defaultOptions.queries.staleTime,
      gcTime: QUERY_CONFIG.defaultOptions.queries.gcTime,
      retry: QUERY_CONFIG.defaultOptions.queries.retry,
      refetchOnWindowFocus: QUERY_CONFIG.defaultOptions.queries.refetchOnWindowFocus,
      refetchOnReconnect: QUERY_CONFIG.defaultOptions.queries.refetchOnReconnect,
    },
    mutations: {
      retry: QUERY_CONFIG.defaultOptions.mutations.retry,
    },
  },
});

// Query Keys Factory - Organized query keys
export const queryKeys = {
  // Auth
  auth: {
    profile: ['auth', 'profile'] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },

  // Posts
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    myPosts: () => [...queryKeys.posts.all, 'my-posts'] as const,
  },

  // Matches
  matches: {
    all: ['matches'] as const,
    lists: () => [...queryKeys.matches.all, 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.matches.lists(), filters] as const,
    details: () => [...queryKeys.matches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.matches.details(), id] as const,
    activeSessions: () => [...queryKeys.matches.all, 'active-sessions'] as const,
  },

  // Chat
  chat: {
    all: ['chat'] as const,
    conversations: () => [...queryKeys.chat.all, 'conversations'] as const,
    messages: (conversationId: string) =>
      [...queryKeys.chat.all, 'conversations', conversationId, 'messages'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },
} as const;

export default queryClient;

