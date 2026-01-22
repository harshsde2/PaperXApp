/**
 * Session API Service
 * Handles all session-related operations for all roles (Brand, Converter, Dealer)
 * Unified API endpoints for session management
 */

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../client';
import { SESSION_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  GetActiveSessionsParams,
  GetActiveSessionsResponse,
  GetSessionHistoryParams,
  GetSessionHistoryResponse,
  GetSessionDetailResponse,
  LockSessionRequest,
  LockSessionResponse,
  RepublishSessionResponse,
  MarkDealFailedResponse,
  SessionDetail,
} from './@types';

// ============================================
// HELPER FUNCTION
// ============================================

const extractData = <T>(response: any): T => {
  if (response?.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data;
  }
  if (response?.data) {
    return response.data;
  }
  return response;
};

// ============================================
// GET ACTIVE SESSIONS (Sourcing Hub)
// ============================================

export const useGetActiveSessions = (params?: GetActiveSessionsParams) => {
  return useQuery({
    queryKey: queryKeys.sessions.active(params),
    queryFn: async (): Promise<GetActiveSessionsResponse> => {
      const response = await api.get<GetActiveSessionsResponse>(SESSION_ENDPOINTS.ACTIVE, {
        params,
      });
      const data = extractData<GetActiveSessionsResponse>(response);
      // Ensure data is an array (Laravel pagination wraps it)
      return data;
    },
    staleTime: 1000 * 30, // 30 seconds - sessions change frequently
    gcTime: 0, // Don't cache - always fresh
  });
};

export const useGetActiveSessionsInfinite = (params?: Omit<GetActiveSessionsParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.sessions.activeInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetActiveSessionsResponse> => {
      const response = await api.get<GetActiveSessionsResponse>(SESSION_ENDPOINTS.ACTIVE, {
        params: { ...params, page: pageParam },
      });
      const data = extractData<GetActiveSessionsResponse>(response);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.current_page < lastPage.last_page) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 30,
    gcTime: 0,
  });
};

// ============================================
// GET SESSION HISTORY
// ============================================

export const useGetSessionHistory = (params?: GetSessionHistoryParams) => {
  return useQuery({
    queryKey: queryKeys.sessions.history(params),
    queryFn: async (): Promise<GetSessionHistoryResponse> => {
      const response = await api.get<GetSessionHistoryResponse>(SESSION_ENDPOINTS.HISTORY, {
        params,
      });
      return extractData<GetSessionHistoryResponse>(response);
    },
    staleTime: 1000 * 60, // 1 minute - history doesn't change as frequently
  });
};

export const useGetSessionHistoryInfinite = (
  params?: Omit<GetSessionHistoryParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.sessions.historyInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetSessionHistoryResponse> => {
      const response = await api.get<GetSessionHistoryResponse>(SESSION_ENDPOINTS.HISTORY, {
        params: { ...params, page: pageParam },
      });
      const data = extractData<GetSessionHistoryResponse>(response);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination.current_page < lastPage.pagination.last_page) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60,
  });
};

// ============================================
// GET SESSION DETAIL
// ============================================

export const useGetSessionDetail = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: async (): Promise<SessionDetail> => {
      const response = await api.get<GetSessionDetailResponse>(SESSION_ENDPOINTS.DETAIL(id));
      return extractData<SessionDetail>(response);
    },
    enabled: !!id,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 0, // Don't cache - always fresh
  });
};

// ============================================
// LOCK SESSION (Select Dealers)
// ============================================

export const useLockSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      data,
    }: {
      sessionId: number | string;
      data: LockSessionRequest;
    }): Promise<LockSessionResponse> => {
      const response = await api.post<LockSessionResponse>(
        SESSION_ENDPOINTS.LOCK(sessionId),
        data
      );
      return extractData<LockSessionResponse>(response);
    },
    onSuccess: (_, { sessionId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.history() });
      // Also invalidate dealer opportunities if applicable
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.opportunities() });
    },
    onError: (error: Error) => {
      console.error('[useLockSession] Error:', error);
    },
  });
};

// ============================================
// REPUBLISH SESSION
// ============================================

export const useRepublishSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number | string): Promise<RepublishSessionResponse> => {
      const response = await api.post<RepublishSessionResponse>(
        SESSION_ENDPOINTS.REPUBLISH(sessionId)
      );
      return extractData<RepublishSessionResponse>(response);
    },
    onSuccess: (_, sessionId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.history() });
    },
    onError: (error: Error) => {
      console.error('[useRepublishSession] Error:', error);
    },
  });
};

// ============================================
// MARK DEAL AS FAILED
// ============================================

export const useMarkDealFailed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number | string): Promise<MarkDealFailedResponse> => {
      const response = await api.post<MarkDealFailedResponse>(
        SESSION_ENDPOINTS.DEAL_FAILED(sessionId)
      );
      return extractData<MarkDealFailedResponse>(response);
    },
    onSuccess: (_, sessionId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.history() });
    },
    onError: (error: Error) => {
      console.error('[useMarkDealFailed] Error:', error);
    },
  });
};
