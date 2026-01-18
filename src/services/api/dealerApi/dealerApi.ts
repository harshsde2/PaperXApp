/**
 * Dealer API Service
 * Handles all dealer-specific operations including registration, opportunities, sessions, chat, quotes
 */

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../client';
import { DEALER_ENDPOINTS, REGISTRATION_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  // Legacy Registration Types
  DealerMaterialsRequest,
  DealerMaterialsResponse,
  DealerMillBrandRequest,
  DealerMillBrandResponse,
  DealerMaterialSpecsRequest,
  DealerMaterialSpecsResponse,
  DealerThicknessRequest,
  DealerThicknessResponse,
  DealerWarehousesRequest,
  DealerWarehousesResponse,
  CompleteDealerRegistrationRequest,
  CompleteDealerRegistrationResponse,
  // Profile Types
  CompleteDealerProfileRequest,
  CompleteDealerProfileResponse,
  // Dashboard Types
  DealerDashboardResponse,
  // Opportunity Types
  GetOpportunitiesParams,
  GetOpportunitiesResponse,
  GetOpportunityDetailResponse,
  AcceptOpportunityResponse,
  DeclineOpportunityRequest,
  DeclineOpportunityResponse,
  OpportunityListItem,
  OpportunityDetail,
  // Session Types
  GetSessionDetailResponse,
  GetSessionHistoryParams,
  GetSessionHistoryResponse,
  SessionDetail,
  SessionListItem,
  // Chat Types
  GetChatMessagesParams,
  GetChatMessagesResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
  ChatMessage,
  // Quote Types
  SubmitQuoteRequest,
  SubmitQuoteResponse,
  // Notification Types
  GetNotificationsParams,
  GetNotificationsResponse,
  MarkNotificationReadResponse,
  MarkAllNotificationsReadResponse,
  DealerNotification,
  // Post Requirement Types
  PostRequirementRequest,
  PostRequirementResponse,
  // Get Requirements Types
  GetRequirementsParams,
  GetRequirementsResponse,
  RequirementListItem,
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
// LEGACY REGISTRATION APIs (Step-by-step registration)
// ============================================

export const useSaveDealerMaterials = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DealerMaterialsRequest): Promise<DealerMaterialsResponse> => {
      const response = await api.post<DealerMaterialsResponse>(
        REGISTRATION_ENDPOINTS.DEALER_REGISTRATION + '/materials',
        data
      );
      return extractData<DealerMaterialsResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
    },
    onError: (error: Error) => {
      console.error('Save dealer materials error:', error);
    },
  });
};

export const useSaveDealerMillBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DealerMillBrandRequest): Promise<DealerMillBrandResponse> => {
      const response = await api.post<DealerMillBrandResponse>(
        REGISTRATION_ENDPOINTS.DEALER_REGISTRATION + '/mill-brand',
        data
      );
      return extractData<DealerMillBrandResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
    },
    onError: (error: Error) => {
      console.error('Save mill/brand details error:', error);
    },
  });
};

export const useSaveDealerMaterialSpecs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DealerMaterialSpecsRequest): Promise<DealerMaterialSpecsResponse> => {
      const response = await api.post<DealerMaterialSpecsResponse>(
        REGISTRATION_ENDPOINTS.DEALER_REGISTRATION + '/material-specs',
        data
      );
      return extractData<DealerMaterialSpecsResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
    },
    onError: (error: Error) => {
      console.error('Save material specs error:', error);
    },
  });
};

export const useSaveDealerThickness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DealerThicknessRequest): Promise<DealerThicknessResponse> => {
      const response = await api.post<DealerThicknessResponse>(
        REGISTRATION_ENDPOINTS.DEALER_REGISTRATION + '/thickness',
        data
      );
      return extractData<DealerThicknessResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
    },
    onError: (error: Error) => {
      console.error('Save thickness error:', error);
    },
  });
};

export const useSaveDealerWarehouses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DealerWarehousesRequest): Promise<DealerWarehousesResponse> => {
      const response = await api.post<DealerWarehousesResponse>(
        REGISTRATION_ENDPOINTS.DEALER_REGISTRATION + '/warehouses',
        data
      );
      return extractData<DealerWarehousesResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
    },
    onError: (error: Error) => {
      console.error('Save warehouses error:', error);
    },
  });
};

export const useCompleteDealerRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CompleteDealerRegistrationRequest
    ): Promise<CompleteDealerRegistrationResponse> => {
      const response = await api.post<CompleteDealerRegistrationResponse>(
        REGISTRATION_ENDPOINTS.DEALER_REGISTRATION + '/complete',
        data
      );
      return extractData<CompleteDealerRegistrationResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
    onError: (error: Error) => {
      console.error('Complete dealer registration error:', error);
    },
  });
};

export const useGetDealerRegistration = () => {
  return useQuery({
    queryKey: queryKeys.dealer.registration(),
    queryFn: async (): Promise<CompleteDealerRegistrationRequest> => {
      const response = await api.get<CompleteDealerRegistrationRequest>(
        REGISTRATION_ENDPOINTS.DEALER_REGISTRATION
      );
      return extractData<CompleteDealerRegistrationRequest>(response);
    },
  });
};

// ============================================
// COMPLETE DEALER PROFILE (Postman API Format)
// ============================================

export const useCompleteDealerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CompleteDealerProfileRequest): Promise<CompleteDealerProfileResponse> => {
      const response = await api.post<CompleteDealerProfileResponse>(
        DEALER_ENDPOINTS.COMPLETE_PROFILE,
        data
      );
      return extractData<CompleteDealerProfileResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
    onError: (error: Error) => {
      console.error('Complete dealer profile error:', error);
    },
  });
};

// ============================================
// DASHBOARD
// ============================================

export const useGetDealerDashboard = () => {
  return useQuery({
    queryKey: queryKeys.dealer.dashboard(),
    queryFn: async (): Promise<DealerDashboardResponse> => {
      const response = await api.get<DealerDashboardResponse>(DEALER_ENDPOINTS.DASHBOARD);
      return extractData<DealerDashboardResponse>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ============================================
// OPPORTUNITIES
// ============================================

export const useGetOpportunities = (params?: GetOpportunitiesParams) => {
  return useQuery({
    queryKey: queryKeys.dealer.opportunities(params),
    queryFn: async (): Promise<GetOpportunitiesResponse> => {
      const response = await api.get<GetOpportunitiesResponse>(DEALER_ENDPOINTS.OPPORTUNITIES, {
        params,
      });
      return extractData<GetOpportunitiesResponse>(response);
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useGetOpportunitiesInfinite = (params?: Omit<GetOpportunitiesParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.dealer.opportunitiesInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetOpportunitiesResponse> => {
      const response = await api.get<GetOpportunitiesResponse>(DEALER_ENDPOINTS.OPPORTUNITIES, {
        params: { ...params, page: pageParam },
      });
      return extractData<GetOpportunitiesResponse>(response);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination?.has_next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60,
  });
};

export const useGetOpportunityDetail = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.dealer.opportunityDetail(id),
    queryFn: async (): Promise<OpportunityDetail> => {
      const response = await api.get<GetOpportunityDetailResponse>(
        DEALER_ENDPOINTS.OPPORTUNITY_DETAIL(id)
      );
      const data = extractData<GetOpportunityDetailResponse>(response);
      return data.opportunity || data;
    },
    enabled: !!id,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useAcceptOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string): Promise<AcceptOpportunityResponse> => {
      const response = await api.post<AcceptOpportunityResponse>(
        DEALER_ENDPOINTS.ACCEPT_OPPORTUNITY(id)
      );
      return extractData<AcceptOpportunityResponse>(response);
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.opportunities() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.opportunityDetail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.sessions() });
    },
    onError: (error: Error) => {
      console.error('Accept opportunity error:', error);
    },
  });
};

export const useDeclineOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data?: DeclineOpportunityRequest;
    }): Promise<DeclineOpportunityResponse> => {
      const response = await api.post<DeclineOpportunityResponse>(
        DEALER_ENDPOINTS.DECLINE_OPPORTUNITY(id),
        data
      );
      return extractData<DeclineOpportunityResponse>(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.opportunities() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.opportunityDetail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.dashboard() });
    },
    onError: (error: Error) => {
      console.error('Decline opportunity error:', error);
    },
  });
};

// ============================================
// SESSIONS
// ============================================

export const useGetSessionDetail = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.dealer.sessionDetail(id),
    queryFn: async (): Promise<SessionDetail> => {
      const response = await api.get<GetSessionDetailResponse>(DEALER_ENDPOINTS.SESSION_DETAIL(id));
      const data = extractData<GetSessionDetailResponse>(response);
      return data.session || data;
    },
    enabled: !!id,
    staleTime: 1000 * 30,
  });
};

export const useGetSessionHistory = (params?: GetSessionHistoryParams) => {
  return useQuery({
    queryKey: queryKeys.dealer.sessionHistory(params),
    queryFn: async (): Promise<GetSessionHistoryResponse> => {
      const response = await api.get<GetSessionHistoryResponse>(DEALER_ENDPOINTS.SESSION_HISTORY, {
        params,
      });
      return extractData<GetSessionHistoryResponse>(response);
    },
    staleTime: 1000 * 60,
  });
};

export const useGetSessionHistoryInfinite = (params?: Omit<GetSessionHistoryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.dealer.sessionHistoryInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetSessionHistoryResponse> => {
      const response = await api.get<GetSessionHistoryResponse>(DEALER_ENDPOINTS.SESSION_HISTORY, {
        params: { ...params, page: pageParam },
      });
      return extractData<GetSessionHistoryResponse>(response);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination?.has_next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60,
  });
};

// ============================================
// CHAT
// ============================================

export const useGetChatMessages = (sessionId: number | string, params?: GetChatMessagesParams) => {
  return useQuery({
    queryKey: queryKeys.dealer.chatMessages(sessionId, params),
    queryFn: async (): Promise<GetChatMessagesResponse> => {
      const response = await api.get<GetChatMessagesResponse>(
        DEALER_ENDPOINTS.CHAT_MESSAGES(sessionId),
        { params }
      );
      return extractData<GetChatMessagesResponse>(response);
    },
    enabled: !!sessionId,
    staleTime: 1000 * 10, // 10 seconds - messages should be fresh
  });
};

export const useGetChatMessagesInfinite = (
  sessionId: number | string,
  params?: Omit<GetChatMessagesParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.dealer.chatMessagesInfinite(sessionId, params),
    queryFn: async ({ pageParam = 1 }): Promise<GetChatMessagesResponse> => {
      const response = await api.get<GetChatMessagesResponse>(
        DEALER_ENDPOINTS.CHAT_MESSAGES(sessionId),
        {
          params: { ...params, page: pageParam },
        }
      );
      return extractData<GetChatMessagesResponse>(response);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination?.has_next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!sessionId,
    staleTime: 1000 * 10,
  });
};

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      data,
    }: {
      sessionId: number | string;
      data: SendChatMessageRequest;
    }): Promise<SendChatMessageResponse> => {
      const response = await api.post<SendChatMessageResponse>(
        DEALER_ENDPOINTS.SEND_MESSAGE(sessionId),
        data
      );
      return extractData<SendChatMessageResponse>(response);
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.chatMessages(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.sessionDetail(sessionId) });
    },
    onError: (error: Error) => {
      console.error('Send chat message error:', error);
    },
  });
};

// ============================================
// QUOTATION
// ============================================

export const useSubmitQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      data,
    }: {
      sessionId: number | string;
      data: SubmitQuoteRequest;
    }): Promise<SubmitQuoteResponse> => {
      const response = await api.post<SubmitQuoteResponse>(
        DEALER_ENDPOINTS.SUBMIT_QUOTE(sessionId),
        data
      );
      return extractData<SubmitQuoteResponse>(response);
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.sessionDetail(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.chatMessages(sessionId) });
    },
    onError: (error: Error) => {
      console.error('Submit quote error:', error);
    },
  });
};

// ============================================
// NOTIFICATIONS
// ============================================

export const useGetDealerNotifications = (params?: GetNotificationsParams) => {
  return useQuery({
    queryKey: queryKeys.dealer.notifications(params),
    queryFn: async (): Promise<GetNotificationsResponse> => {
      const response = await api.get<GetNotificationsResponse>(DEALER_ENDPOINTS.NOTIFICATIONS, {
        params,
      });
      return extractData<GetNotificationsResponse>(response);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useGetDealerNotificationsInfinite = (
  params?: Omit<GetNotificationsParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.dealer.notificationsInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetNotificationsResponse> => {
      const response = await api.get<GetNotificationsResponse>(DEALER_ENDPOINTS.NOTIFICATIONS, {
        params: { ...params, page: pageParam },
      });
      return extractData<GetNotificationsResponse>(response);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination?.has_next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 30,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string): Promise<MarkNotificationReadResponse> => {
      const response = await api.post<MarkNotificationReadResponse>(
        DEALER_ENDPOINTS.MARK_NOTIFICATION_READ(id)
      );
      return extractData<MarkNotificationReadResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.notifications() });
    },
    onError: (error: Error) => {
      console.error('Mark notification read error:', error);
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<MarkAllNotificationsReadResponse> => {
      const response = await api.post<MarkAllNotificationsReadResponse>(
        DEALER_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ
      );
      return extractData<MarkAllNotificationsReadResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.notifications() });
    },
    onError: (error: Error) => {
      console.error('Mark all notifications read error:', error);
    },
  });
};

// ============================================
// POST REQUIREMENT
// ============================================

export const usePostDealerRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostRequirementRequest): Promise<PostRequirementResponse> => {
      const response = await api.post<PostRequirementResponse>(
        DEALER_ENDPOINTS.POST_REQUIREMENT,
        data
      );
      return extractData<PostRequirementResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dealer.dashboard() });
    },
    onError: (error: Error) => {
      console.error('Post dealer requirement error:', error);
    },
  });
};

// ============================================
// GET REQUIREMENTS
// ============================================

export const useGetRequirements = (params?: GetRequirementsParams) => {
  return useQuery({
    queryKey: queryKeys.dealer.requirements(params),
    queryFn: async (): Promise<GetRequirementsResponse> => {
      const response = await api.get<{ success: boolean; message: string; data: RequirementListItem[]; meta?: any }>(
        DEALER_ENDPOINTS.REQUIREMENTS,
        { params }
      );
      const responseData = response.data as any;
      // Handle the API response structure: { success, message, data: [...], meta: {...} }
      const requirements = responseData?.data || [];
      const meta = responseData?.meta;
      return {
        requirements,
        pagination: meta,
      };
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useGetRequirementsInfinite = (params?: Omit<GetRequirementsParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.dealer.requirementsInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetRequirementsResponse> => {
      const response = await api.get<{ success: boolean; message: string; data: RequirementListItem[]; meta?: any }>(
        DEALER_ENDPOINTS.REQUIREMENTS,
        { params: { ...params, page: pageParam } }
      );
      const responseData = response.data as any;
      // Handle the API response structure: { success, message, data: [...], meta: {...} }
      const requirements = responseData?.data || [];
      const meta = responseData?.meta;
      return {
        requirements,
        pagination: meta,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination && lastPage.pagination.current_page < lastPage.pagination.last_page) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60,
  });
};
