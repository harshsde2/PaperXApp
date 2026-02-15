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

  // Reference Data
  reference: {
    all: ['reference'] as const,
    materials: () => [...queryKeys.reference.all, 'materials'] as const,
    materialsInfinite: (perPage?: number) =>
      [...queryKeys.reference.all, 'materials', 'infinite', perPage] as const,
    materialDetails: (id: number | string) =>
      [...queryKeys.reference.all, 'materials', id, 'details'] as const,
    machines: (params?: Record<string, any>) =>
      [...queryKeys.reference.all, 'machines', params] as const,
    materialFinishes: (params?: Record<string, any>) =>
      [...queryKeys.reference.all, 'material-finishes', params] as const,
    materialFinishesInfinite: (perPage?: number) =>
      [...queryKeys.reference.all, 'material-finishes', 'infinite', perPage] as const,
    materialMills: (params?: Record<string, any>) =>
      [...queryKeys.reference.all, 'material-mills', params] as const,
    materialThicknessTypes: (params?: Record<string, any>) =>
      [...queryKeys.reference.all, 'material-thickness-types', params] as const,
    brands: () => [...queryKeys.reference.all, 'brands'] as const,
  },

  // Dealer
  dealer: {
    all: ['dealer'] as const,
    registration: () => [...queryKeys.dealer.all, 'registration'] as const,
    materials: () => [...queryKeys.dealer.all, 'materials'] as const,
    millBrand: () => [...queryKeys.dealer.all, 'mill-brand'] as const,
    materialSpecs: () => [...queryKeys.dealer.all, 'material-specs'] as const,
    thickness: () => [...queryKeys.dealer.all, 'thickness'] as const,
    warehouses: () => [...queryKeys.dealer.all, 'warehouses'] as const,
    dashboard: () => [...queryKeys.dealer.all, 'dashboard'] as const,
    opportunities: (params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'opportunities', params] as const,
    opportunitiesInfinite: (params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'opportunities', 'infinite', params] as const,
    opportunityDetail: (id: number | string) =>
      [...queryKeys.dealer.all, 'opportunities', id] as const,
    sessions: () => [...queryKeys.dealer.all, 'sessions'] as const,
    sessionDetail: (id: number | string) =>
      [...queryKeys.dealer.all, 'sessions', id] as const,
    sessionHistory: (params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'sessions', 'history', params] as const,
    sessionHistoryInfinite: (params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'sessions', 'history', 'infinite', params] as const,
    chatMessages: (sessionId: number | string, params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'chat', sessionId, 'messages', params] as const,
    chatMessagesInfinite: (sessionId: number | string, params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'chat', sessionId, 'messages', 'infinite', params] as const,
    notifications: (params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'notifications', params] as const,
    notificationsInfinite: (params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'notifications', 'infinite', params] as const,
    requirements: (params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'requirements', params] as const,
    requirementsInfinite: (params?: Record<string, any>) =>
      [...queryKeys.dealer.all, 'requirements', 'infinite', params] as const,
  },

  // Machine Dealer
  machineDealer: {
    all: ['machine-dealer'] as const,
    dashboard: () => [...queryKeys.machineDealer.all, 'dashboard'] as const,
    listings: (params?: Record<string, any>) =>
      [...queryKeys.machineDealer.all, 'listings', params] as const,
    listingsInfinite: (params?: Record<string, any>) =>
      [...queryKeys.machineDealer.all, 'listings', 'infinite', params] as const,
    listingDetail: (id: number | string) =>
      [...queryKeys.machineDealer.all, 'listings', id] as const,
    requirements: (params?: Record<string, any>) =>
      [...queryKeys.machineDealer.all, 'requirements', params] as const,
    requirementsInfinite: (params?: Record<string, any>) =>
      [...queryKeys.machineDealer.all, 'requirements', 'infinite', params] as const,
  },

  // Converter
  converter: {
    all: ['converter'] as const,
    dashboard: () => [...queryKeys.converter.all, 'dashboard'] as const,
    orders: (params?: Record<string, any>) =>
      [...queryKeys.converter.all, 'orders', params] as const,
    orderDetail: (id: number | string) =>
      [...queryKeys.converter.all, 'orders', id] as const,
    materialRequests: (params?: Record<string, any>) =>
      [...queryKeys.converter.all, 'material-requests', params] as const,
  },

  // Brand
  brand: {
    all: ['brand'] as const,
    dashboard: () => [...queryKeys.brand.all, 'dashboard'] as const,
    requirements: (params?: Record<string, any>) =>
      [...queryKeys.brand.all, 'requirements', params] as const,
    requirementDetail: (id: number | string) =>
      [...queryKeys.brand.all, 'requirements', id] as const,
    sessions: (params?: Record<string, any>) =>
      [...queryKeys.brand.all, 'sessions', params] as const,
    sessionDetail: (id: number | string) =>
      [...queryKeys.brand.all, 'sessions', id] as const,
  },

  // Posts
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    myPosts: () => [...queryKeys.posts.all, 'my-posts'] as const,
  },

  // Matches
  matches: {
    all: ['matches'] as const,
    lists: () => [...queryKeys.matches.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.matches.lists(), filters] as const,
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

  // Wallet
  wallet: {
    all: ['wallet'] as const,
    balance: () => [...queryKeys.wallet.all, 'balance'] as const,
    creditPacks: () => [...queryKeys.wallet.all, 'credit-packs'] as const,
    transactions: (params?: Record<string, any>) =>
      [...queryKeys.wallet.all, 'transactions', params] as const,
    transactionsInfinite: (params?: Record<string, any>) =>
      [...queryKeys.wallet.all, 'transactions', 'infinite', params] as const,
  },

  // Sessions (Unified for all roles)
  sessions: {
    all: ['sessions'] as const,
    active: (params?: Record<string, any>) =>
      [...queryKeys.sessions.all, 'active', params] as const,
    activeInfinite: (params?: Record<string, any>) =>
      [...queryKeys.sessions.all, 'active', 'infinite', params] as const,
    history: (params?: Record<string, any>) =>
      [...queryKeys.sessions.all, 'history', params] as const,
    historyInfinite: (params?: Record<string, any>) =>
      [...queryKeys.sessions.all, 'history', 'infinite', params] as const,
    detail: (id: number | string) => [...queryKeys.sessions.all, 'detail', id] as const,
    posterDetail: (id: number | string) => [...queryKeys.sessions.all, 'poster-detail', id] as const,
    responderDetail: (id: number | string) => [...queryKeys.sessions.all, 'responder-detail', id] as const,
    chatList: () => [...queryKeys.sessions.all, 'chat-list'] as const,
  },

  // Inquiries
  inquiries: {
    all: ['inquiries'] as const,
    detail: (id: number | string) => [...queryKeys.inquiries.all, 'detail', id] as const,
    responses: (id: number | string) => [...queryKeys.inquiries.all, id, 'responses'] as const,
    matchmakingResponses: (id: number | string, params?: Record<string, any>) =>
      [...queryKeys.inquiries.all, id, 'matchmaking-responses', params] as const,
  },
} as const;

export default queryClient;
