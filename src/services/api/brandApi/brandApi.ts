/**
 * Brand API Service
 * Handles all brand/corporate operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { BRAND_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  CompleteBrandProfileRequest,
  CompleteBrandProfileResponse,
  BrandDashboardResponse,
  PostBrandRequirementRequest,
  PostBrandRequirementResponse,
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
// COMPLETE PROFILE
// ============================================

export const useCompleteBrandProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CompleteBrandProfileRequest
    ): Promise<CompleteBrandProfileResponse> => {
      const response = await api.post<CompleteBrandProfileResponse>(
        BRAND_ENDPOINTS.COMPLETE_PROFILE,
        data
      );
      return extractData<CompleteBrandProfileResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brand.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
    onError: (error: Error) => {
      console.error('Complete brand profile error:', error);
    },
  });
};

// ============================================
// DASHBOARD
// ============================================

export const useGetBrandDashboard = () => {
  return useQuery({
    queryKey: queryKeys.brand.dashboard(),
    queryFn: async (): Promise<BrandDashboardResponse> => {
      const response = await api.get<BrandDashboardResponse>(BRAND_ENDPOINTS.DASHBOARD);
      return extractData<BrandDashboardResponse>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ============================================
// POST REQUIREMENT
// ============================================

export const usePostBrandRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: PostBrandRequirementRequest
    ): Promise<PostBrandRequirementResponse> => {
      const response = await api.post<PostBrandRequirementResponse>(
        BRAND_ENDPOINTS.POST_REQUIREMENT,
        data
      );
      return extractData<PostBrandRequirementResponse>(response);
    },
    onSuccess: () => {
      // Invalidate dashboard and requirements queries
      queryClient.invalidateQueries({ queryKey: queryKeys.brand.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.brand.dashboard() });
    },
    onError: (error: Error) => {
      console.error('Post brand requirement error:', error);
    },
  });
};