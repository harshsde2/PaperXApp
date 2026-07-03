/**
 * Converter API Service
 * Handles all converter operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { CONVERTER_ENDPOINTS, REFERENCE_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  CompleteConverterProfileRequest,
  CompleteConverterProfileResponse,
  ConverterDashboardResponse,
  ConverterType,
  FinishedProduct,
  ScrapType,
  ConverterReferenceDataResponse,
} from './@types';
import type { PostRequirementRequest, PostRequirementResponse } from '../dealerApi/@types';
import type { PostMachineRequest } from '../machineDealerApi/@types';
import type { Machine } from '../referenceApi/@types';
import type {
  JobworkPostResponse,
  PostJobworkFindPayload,
  PostJobworkGivePayload,
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

// ============================================
// REFERENCE DATA
// ============================================

/**
 * Get all converter types
 * Returns a flat list of converter types (id, name)
 */
export const useGetConverterTypes = () => {
  return useQuery({
    queryKey: ['converter-types'],
    queryFn: async (): Promise<ConverterType[]> => {
      const response = await api.get<{ success: boolean; data: ConverterType[] }>(
        REFERENCE_ENDPOINTS.CONVERTER_TYPES
      );
      const responseData = response.data as any;

      if (responseData?.success && Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    staleTime: 0,
  });
};

/**
 * Get all finished products
 * Returns a flat list of finished products (id, name)
 */
export const useGetFinishedProducts = () => {
  return useQuery({
    queryKey: ['finished-products'],
    queryFn: async (): Promise<FinishedProduct[]> => {
      const response = await api.get<{ success: boolean; data: FinishedProduct[] }>(
        REFERENCE_ENDPOINTS.FINISHED_PRODUCTS
      );
      const responseData = response.data as any;

      if (responseData?.success && Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    staleTime: 0,
  });
};

/**
 * Get all scrap types
 * Returns a flat list of scrap types (id, name)
 */
export const useGetScrapTypes = () => {
  return useQuery({
    queryKey: ['scrap-types'],
    queryFn: async (): Promise<ScrapType[]> => {
      const response = await api.get<{ success: boolean; data: ScrapType[] }>(
        REFERENCE_ENDPOINTS.SCRAP_TYPES
      );
      const responseData = response.data as any;

      if (responseData?.success && Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    staleTime: 0,
  });
};

/**
 * Get all converter reference data in a single API call
 * Returns converter types, finished products, scrap types, and machines
 * This is the recommended way to fetch all converter reference data at once
 */
export const useGetConverterReferenceData = () => {
  return useQuery({
    queryKey: ['converter-reference-data'],
    queryFn: async (): Promise<ConverterReferenceDataResponse> => {
      const response = await api.get<{ success: boolean; data: ConverterReferenceDataResponse }>(
        REFERENCE_ENDPOINTS.CONVERTER_REFERENCE_DATA
      );
      const responseData = response.data as any;

      if (responseData?.success && responseData?.data) {
        return responseData.data;
      }
      if (responseData?.data) {
        return responseData.data;
      }

      // Fallback: return empty structure
      return {
        converter_types: [],
        finished_products: [],
        scrap_types: [],
        machines: [],
      };
    },
    staleTime: 0,
  });
};

export const useCreateFinishedProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; category?: string | null; description?: string | null }): Promise<FinishedProduct> => {
      const payload: Record<string, string> = { name: params.name.trim() };
      if (params.category && params.category.trim()) payload.category = params.category.trim();
      if (params.description && params.description.trim()) payload.description = params.description.trim();
      const response = await api.post(REFERENCE_ENDPOINTS.FINISHED_PRODUCTS, payload);
      const responseData = response.data as any;
      return responseData?.data ?? responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['converter-reference-data'] });
      queryClient.invalidateQueries({ queryKey: ['finished-products'] });
    },
  });
};

export const useCreateMachine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; type?: string | null; description?: string | null }): Promise<Machine> => {
      const payload: Record<string, string> = { name: params.name.trim() };
      if (params.type && params.type.trim()) payload.type = params.type.trim();
      if (params.description && params.description.trim()) payload.description = params.description.trim();
      const response = await api.post(REFERENCE_ENDPOINTS.MACHINES, payload);
      const responseData = response.data as any;
      return responseData?.data ?? responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['converter-reference-data'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.reference.machines() });
    },
  });
};

export const useCreateScrapType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; category?: string | null; description?: string | null }): Promise<ScrapType> => {
      const payload: Record<string, string> = { name: params.name.trim() };
      if (params.category && params.category.trim()) payload.category = params.category.trim();
      if (params.description && params.description.trim()) payload.description = params.description.trim();
      const response = await api.post(REFERENCE_ENDPOINTS.SCRAP_TYPES, payload);
      const responseData = response.data as any;
      return responseData?.data ?? responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['converter-reference-data'] });
      queryClient.invalidateQueries({ queryKey: ['scrap-types'] });
    },
  });
};

// ============================================
// POST REQUIREMENT
// ============================================

export const usePostConverterRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostRequirementRequest): Promise<PostRequirementResponse> => {
      const response = await api.post<PostRequirementResponse>(
        CONVERTER_ENDPOINTS.POST_REQUIREMENT,
        data
      );
      return extractData<PostRequirementResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converter.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.converter.dashboard() });
    },
    onError: (error: Error) => {
      console.error('Post converter requirement error:', error);
    },
  });
};

// ============================================
// POST MACHINE (buy/sell as converter)
// ============================================

export interface PostConverterMachineResponse {
  inquiry_id: number;
  status: string;
}

export const usePostConverterMachine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostMachineRequest): Promise<PostConverterMachineResponse> => {
      const response = await api.post<{ success: boolean; data: PostConverterMachineResponse }>(
        CONVERTER_ENDPOINTS.POST_MACHINE,
        data
      );
      return extractData<PostConverterMachineResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converter.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.converter.dashboard() });
    },
    onError: (error: Error) => {
      console.error('Post converter machine error:', error);
    },
  });
};

// ============================================
// JOBWORK (Converter → Converter)
// ============================================

export const usePostConverterJobworkFind = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostJobworkFindPayload): Promise<JobworkPostResponse> => {
      const response = await api.post<JobworkPostResponse>(
        CONVERTER_ENDPOINTS.POST_JOBWORK_FIND,
        data,
      );
      return extractData<JobworkPostResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converter.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.converter.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.active() });
    },
    onError: (error: Error) => {
      console.error('Post converter jobwork (find) error:', error);
    },
  });
};

export const usePostConverterJobworkGive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostJobworkGivePayload): Promise<JobworkPostResponse> => {
      const response = await api.post<JobworkPostResponse>(
        CONVERTER_ENDPOINTS.POST_JOBWORK_GIVE,
        data,
      );
      return extractData<JobworkPostResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converter.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.converter.dashboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.active() });
    },
    onError: (error: Error) => {
      console.error('Post converter jobwork (give) error:', error);
    },
  });
};