/**
 * Dashboard API Service
 * Unified dashboard API for all roles
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { DASHBOARD_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  DashboardRole,
  GetDashboardParams,
  GetDashboardResponse,
  DealerDashboardData,
  MachineDealerDashboardData,
  ConverterDashboardData,
  BrandDashboardData,
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
// UNIFIED DASHBOARD API
// ============================================

/**
 * Get dashboard data based on role
 * @param role - Optional role parameter (defaults to user's primary role)
 */
export const useGetDashboard = <T = any>(params?: GetDashboardParams) => {
  return useQuery({
    queryKey: ['dashboard', params?.role] as const,
    queryFn: async (): Promise<T> => {
      const response = await api.get<GetDashboardResponse<T>>(
        DASHBOARD_ENDPOINTS.DASHBOARD(params?.role)
      );
      return extractData<T>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get Dealer Dashboard
 */
export const useGetDealerDashboard = () => {
  return useGetDashboard<DealerDashboardData>({ role: 'dealer' });
};

/**
 * Get Machine Dealer Dashboard
 */
export const useGetMachineDealerDashboard = () => {
  return useGetDashboard<MachineDealerDashboardData>({ role: 'machine-dealer' });
};

/**
 * Get Converter Dashboard
 */
export const useGetConverterDashboard = () => {
  return useGetDashboard<ConverterDashboardData>({ role: 'converter' });
};

/**
 * Get Brand Dashboard
 */
export const useGetBrandDashboard = () => {
  return useGetDashboard<BrandDashboardData>({ role: 'brand' });
};
