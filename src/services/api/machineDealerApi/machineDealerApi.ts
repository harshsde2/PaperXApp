/**
 * Machine Dealer API Service
 * Handles all machine dealer operations
 */

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../client';
import { MACHINE_DEALER_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  CompleteMachineDealerProfileRequest,
  CompleteMachineDealerProfileResponse,
  MachineDealerDashboardResponse,
  PostMachineRequest,
  PostMachineResponse,
  GetListingsParams,
  GetListingsResponse,
  GetRequirementsParams,
  GetRequirementsResponse,
  MachineListingItem,
  MachineRequirementItem,
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

export const useCompleteMachineDealerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CompleteMachineDealerProfileRequest
    ): Promise<CompleteMachineDealerProfileResponse> => {
      const response = await api.post<CompleteMachineDealerProfileResponse>(
        MACHINE_DEALER_ENDPOINTS.COMPLETE_PROFILE,
        data
      );
      return extractData<CompleteMachineDealerProfileResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.machineDealer.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
    onError: (error: Error) => {
      console.error('Complete machine dealer profile error:', error);
    },
  });
};

// ============================================
// DASHBOARD
// ============================================

export const useGetMachineDealerDashboard = () => {
  return useQuery({
    queryKey: queryKeys.machineDealer.dashboard(),
    queryFn: async (): Promise<MachineDealerDashboardResponse> => {
      const response = await api.get<MachineDealerDashboardResponse>(
        MACHINE_DEALER_ENDPOINTS.DASHBOARD
      );
      return extractData<MachineDealerDashboardResponse>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ============================================
// POST MACHINE
// ============================================

export const usePostMachine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostMachineRequest): Promise<PostMachineResponse> => {
      const response = await api.post<PostMachineResponse>(
        MACHINE_DEALER_ENDPOINTS.POST_MACHINE,
        data
      );
      return extractData<PostMachineResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.machineDealer.listings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.machineDealer.dashboard() });
    },
    onError: (error: Error) => {
      console.error('Post machine error:', error);
    },
  });
};

// ============================================
// LISTINGS
// ============================================

export const useGetMachineListings = (params?: GetListingsParams) => {
  return useQuery({
    queryKey: queryKeys.machineDealer.listings(params),
    queryFn: async (): Promise<GetListingsResponse> => {
      const response = await api.get<GetListingsResponse>(MACHINE_DEALER_ENDPOINTS.LISTINGS, {
        params,
      });
      return extractData<GetListingsResponse>(response);
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useGetMachineListingsInfinite = (params?: Omit<GetListingsParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.machineDealer.listingsInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetListingsResponse> => {
      const response = await api.get<GetListingsResponse>(MACHINE_DEALER_ENDPOINTS.LISTINGS, {
        params: { ...params, page: pageParam },
      });
      return extractData<GetListingsResponse>(response);
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
// REQUIREMENTS
// ============================================

export const useGetMachineRequirements = (params?: GetRequirementsParams) => {
  return useQuery({
    queryKey: queryKeys.machineDealer.requirements(params),
    queryFn: async (): Promise<GetRequirementsResponse> => {
      const response = await api.get<GetRequirementsResponse>(
        MACHINE_DEALER_ENDPOINTS.REQUIREMENTS,
        { params }
      );
      return extractData<GetRequirementsResponse>(response);
    },
    staleTime: 1000 * 60,
  });
};

export const useGetMachineRequirementsInfinite = (params?: Omit<GetRequirementsParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.machineDealer.requirementsInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetRequirementsResponse> => {
      const response = await api.get<GetRequirementsResponse>(
        MACHINE_DEALER_ENDPOINTS.REQUIREMENTS,
        {
          params: { ...params, page: pageParam },
        }
      );
      return extractData<GetRequirementsResponse>(response);
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

