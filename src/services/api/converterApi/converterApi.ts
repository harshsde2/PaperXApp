/**
 * Converter API Service
 * Handles all converter operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { CONVERTER_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  CompleteConverterProfileRequest,
  CompleteConverterProfileResponse,
  ConverterDashboardResponse,
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

export const useCompleteConverterProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CompleteConverterProfileRequest
    ): Promise<CompleteConverterProfileResponse> => {
      const response = await api.post<CompleteConverterProfileResponse>(
        CONVERTER_ENDPOINTS.COMPLETE_PROFILE,
        data
      );
      return extractData<CompleteConverterProfileResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converter.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
    onError: (error: Error) => {
      console.error('Complete converter profile error:', error);
    },
  });
};

// ============================================
// DASHBOARD
// ============================================

export const useGetConverterDashboard = () => {
  return useQuery({
    queryKey: queryKeys.converter.dashboard(),
    queryFn: async (): Promise<ConverterDashboardResponse> => {
      const response = await api.get<ConverterDashboardResponse>(CONVERTER_ENDPOINTS.DASHBOARD);
      return extractData<ConverterDashboardResponse>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

