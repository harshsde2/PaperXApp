/**
 * Session API Service
 * Handles all session-related operations for all roles (Brand, Converter, Dealer)
 * Unified API endpoints for session management
 */

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../client';
import { SESSION_ENDPOINTS, INQUIRY_ENDPOINTS } from '@shared/constants/api';
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
  GetMatchmakingResponsesParams,
  GetMatchmakingResponsesResponse,
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

export const useGetActiveSessions = (
  params?: GetActiveSessionsParams,
  options?: { enabled?: boolean }
) => {
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
    enabled: options?.enabled ?? true,
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

export const useGetSessionDetail = (
  id: number | string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: async (): Promise<SessionDetail> => {
      const response = await api.get<GetSessionDetailResponse>(SESSION_ENDPOINTS.DETAIL(id));
      return extractData<SessionDetail>(response);
    },
    enabled: options?.enabled ?? !!id,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 0, // Don't cache - always fresh
  });
};

// ============================================
// GET SESSION BY INQUIRY ID
// ============================================
// Use when you have inquiry id (e.g. from requirements list) but need session.
// Returns session with `id` (session id); use that for session detail, not inquiry id.

export interface GetSessionByInquiryResponse {
  id: number;
  inquiry_id: number;
  project_id: string;
  status: string;
  inquiry: { id: number; title: string; items: any[] };
  selected_partners_count: number;
  selected_partners: any[];
  chat_enabled: boolean;
  chat_thread_id: number | null;
  locked_at: string | null;
}

export const useFetchSessionByInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inquiryId: number | string): Promise<GetSessionByInquiryResponse> => {
      const response = await api.get<GetSessionByInquiryResponse>(
        SESSION_ENDPOINTS.BY_INQUIRY(inquiryId)
      );
      return extractData<GetSessionByInquiryResponse>(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.active() });
    },
    onError: (e: Error) => {
      console.error('[useFetchSessionByInquiry] Error:', e);
    },
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

// ============================================
// GET MATCHMAKING RESPONSES
// ============================================

export const useGetMatchmakingResponses = (
  inquiryId: number | string,
  params?: GetMatchmakingResponsesParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.inquiries.matchmakingResponses(inquiryId, params),
    queryFn: async (): Promise<GetMatchmakingResponsesResponse> => {
      const response = await api.get<{ data: GetMatchmakingResponsesResponse }>(
        INQUIRY_ENDPOINTS.MATCHMAKING_RESPONSES(inquiryId),
        {
          params,
        }
      );
      return extractData<GetMatchmakingResponsesResponse>(response);
    },
    enabled: options?.enabled ?? !!inquiryId,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 0, // Don't cache - always fresh
  });
};

// ============================================
// EXPRESS INTEREST / DECLINE (Responder)
// ============================================

export const useExpressInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inquiryId: number | string) => {
      const response = await api.post(INQUIRY_ENDPOINTS.EXPRESS_INTEREST(inquiryId), {});
      return extractData<{ expressed_interest: boolean }>(response);
    },
    onSuccess: (_, inquiryId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.matchmakingResponses(inquiryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
};

export const useDeclineInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inquiryId: number | string) => {
      const response = await api.post(INQUIRY_ENDPOINTS.DECLINE(inquiryId), {});
      return extractData<{ declined: boolean }>(response);
    },
    onSuccess: (_, inquiryId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.matchmakingResponses(inquiryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
};
