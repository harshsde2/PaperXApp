/**
 * Reference Data API Service
 * Handles fetching materials, machines, finishes, mills, brands, etc.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../client';
import { REFERENCE_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  GetMaterialsResponse,
  GetMaterialsPaginatedResponse,
  GetMaterialsParams,
  GetMaterialDetailsResponse,
  GetMachinesParams,
  GetMachinesResponse,
  GetMaterialFinishesParams,
  GetMaterialFinishesResponse,
  GetMaterialFinishesPaginatedResponse,
  GetMaterialMillsParams,
  GetMaterialMillsResponse,
  GetMaterialThicknessTypesParams,
  GetMaterialThicknessTypesResponse,
  GetBrandsResponse,
  Material,
  MaterialDetails,
  Machine,
  MaterialFinish,
  MaterialMill,
  MaterialThicknessType,
  Brand,
} from './@types';

// ============================================
// MATERIALS
// ============================================

/**
 * Get all materials
 * Response format:
 * {
 *   "success": true,
 *   "message": "materials.fetch",
 *   "data": [{ id, name, category, grades: [{ id, name }] }]
 * }
 */
export const useGetMaterials = () => {
  return useQuery({
    queryKey: queryKeys.reference.materials(),
    queryFn: async (): Promise<Material[]> => {
      const response = await api.get<GetMaterialsResponse>(REFERENCE_ENDPOINTS.MATERIALS);
      const responseData = response.data as any;

      // Handle: { success: true, data: [...] }
      if (responseData?.success && Array.isArray(responseData?.data)) {
        return responseData.data;
      }

      // Handle: { data: { data: [...] } } (nested)
      if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
        return responseData.data.data;
      }

      // Handle: { data: { materials: [...] } }
      if (responseData?.data?.materials) {
        return responseData.data.materials;
      }

      // Handle: { materials: [...] }
      if (responseData?.materials) {
        return responseData.materials;
      }

      // Handle: { data: [...] } (direct array in data)
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }

      // Handle: [...] (direct array)
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - reference data doesn't change often
  });
};

/**
 * Get materials with infinite pagination
 * Optimized for large lists with page-based loading
 * API: GET /api/v1/materials?page=1&per_page=50
 */
export const useGetMaterialsInfinite = (perPage: number = 5) => {
  return useInfiniteQuery({
    queryKey: queryKeys.reference.materialsInfinite(perPage),
    queryFn: async ({ pageParam = 1 }): Promise<{
      materials: Material[];
      pagination: {
        current_page: number;
        per_page: number;
        total_pages: number;
        total_items: number;
        has_next: boolean;
      };
    }> => {
      const response = await api.get<GetMaterialsPaginatedResponse>(
        REFERENCE_ENDPOINTS.MATERIALS,
        {
          params: {
            page: pageParam,
            per_page: perPage,
          },
        }
      );
      const responseData = response.data as any;

      // Extract materials array
      let materials: Material[] = [];
      if (responseData?.success && Array.isArray(responseData?.data)) {
        materials = responseData.data;
      } else if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
        materials = responseData.data.data;
      } else if (responseData?.data?.materials) {
        materials = responseData.data.materials;
      } else if (responseData?.materials) {
        materials = responseData.materials;
      } else if (Array.isArray(responseData?.data)) {
        materials = responseData.data;
      } else if (Array.isArray(responseData)) {
        materials = responseData;
      }

      // Extract pagination info
      const pagination = responseData?.pagination || responseData?.meta?.pagination || {
        current_page: pageParam,
        per_page: perPage,
        total_pages: 1,
        total_items: materials.length,
        has_next: false,
      };

      return {
        materials,
        pagination: {
          current_page: pagination.current_page ?? pageParam,
          per_page: pagination.per_page ?? perPage,
          total_pages: pagination.total_pages ?? 1,
          total_items: pagination.total_items ?? materials.length,
          has_next: pagination.has_next ?? (materials.length === perPage),
        },
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Check if there's a next page based on pagination info
      if (lastPage.pagination.has_next === true) {
        return lastPage.pagination.current_page + 1;
      }
      
      // Fallback: if we got a full page of items, assume there might be more
      // This handles cases where the API doesn't return has_next correctly
      if (lastPage.materials.length >= perPage) {
        return allPages.length + 1;
      }
      
      return undefined;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

/**
 * Get material details by ID
 */
export const useGetMaterialDetails = (materialId: number | string) => {
  return useQuery({
    queryKey: queryKeys.reference.materialDetails(materialId),
    queryFn: async (): Promise<MaterialDetails | null> => {
      const response = await api.get<GetMaterialDetailsResponse>(
        REFERENCE_ENDPOINTS.MATERIAL_DETAILS(materialId)
      );
      const responseData = response.data as any;

      if (responseData?.data?.material) {
        return responseData.data.material;
      }
      if (responseData?.material) {
        return responseData.material;
      }
      if (responseData?.data) {
        return responseData.data;
      }

      return responseData;
    },
    enabled: !!materialId,
    staleTime: 1000 * 60 * 30,
  });
};

// ============================================
// MACHINES
// ============================================

/**
 * Get all machines with optional type filter
 */
export const useGetMachines = (params?: GetMachinesParams) => {
  return useQuery({
    queryKey: queryKeys.reference.machines(params),
    queryFn: async (): Promise<Machine[]> => {
      const response = await api.get<GetMachinesResponse>(REFERENCE_ENDPOINTS.MACHINES, {
        params,
      });
      const responseData = response.data as any;

      if (responseData?.success && Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (responseData?.data?.machines) {
        return responseData.data.machines;
      }
      if (responseData?.machines) {
        return responseData.machines;
      }
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    staleTime: 1000 * 60 * 30,
  });
};

// ============================================
// MATERIAL FINISHES
// ============================================

/**
 * Get material finishes (with optional material_id and pagination)
 */
export const useGetMaterialFinishes = (params?: GetMaterialFinishesParams) => {
  return useQuery({
    queryKey: queryKeys.reference.materialFinishes(params),
    queryFn: async (): Promise<MaterialFinish[]> => {
      const response = await api.get<GetMaterialFinishesResponse>(
        REFERENCE_ENDPOINTS.MATERIAL_FINISHES,
        { params }
      );
      const responseData = response.data as any;

      if (responseData?.success && Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (responseData?.data?.finishes) {
        return responseData.data.finishes;
      }
      if (responseData?.finishes) {
        return responseData.finishes;
      }
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    staleTime: 1000 * 60 * 30,
  });
};

/**
 * Get material finishes with infinite pagination
 * Optimized for large lists with page-based loading
 * API: GET /api/v1/material-finishes?page=1&per_page=50
 */
export const useGetMaterialFinishesInfinite = (perPage: number = 50, params?: Omit<GetMaterialFinishesParams, 'page' | 'per_page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.reference.materialFinishes({ ...params, infinite: true, perPage }),
    queryFn: async ({ pageParam = 1 }): Promise<{
      finishes: MaterialFinish[];
      pagination: {
        current_page: number;
        per_page: number;
        total_pages: number;
        total_items: number;
        has_next: boolean;
      };
    }> => {
      const response = await api.get<GetMaterialFinishesPaginatedResponse>(
        REFERENCE_ENDPOINTS.MATERIAL_FINISHES,
        {
          params: {
            ...params,
            page: pageParam,
            per_page: perPage,
          },
        }
      );
      const responseData = response.data as any;

      // Extract finishes array
      let finishes: MaterialFinish[] = [];
      if (responseData?.success && Array.isArray(responseData?.data)) {
        finishes = responseData.data;
      } else if (responseData?.data?.finishes) {
        finishes = responseData.data.finishes;
      } else if (responseData?.finishes) {
        finishes = responseData.finishes;
      } else if (Array.isArray(responseData?.data)) {
        finishes = responseData.data;
      } else if (Array.isArray(responseData)) {
        finishes = responseData;
      }

      // Extract pagination info
      const pagination = responseData?.meta || responseData?.pagination || {
        current_page: pageParam,
        per_page: perPage,
        total_pages: 1,
        total_items: finishes.length,
        last_page: 1,
      };

      return {
        finishes,
        pagination: {
          current_page: pagination.current_page ?? pageParam,
          per_page: pagination.per_page ?? perPage,
          total_pages: pagination.last_page ?? pagination.total_pages ?? 1,
          total_items: pagination.total ?? finishes.length,
          has_next: (pagination.current_page ?? pageParam) < (pagination.last_page ?? pagination.total_pages ?? 1),
        },
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Check if there's a next page based on pagination info
      if (lastPage.pagination.has_next === true) {
        return lastPage.pagination.current_page + 1;
      }
      
      // Fallback: if we got a full page of items, assume there might be more
      if (lastPage.finishes.length >= perPage) {
        return allPages.length + 1;
      }
      
      return undefined;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// ============================================
// MATERIAL MILLS
// ============================================

/**
 * Get material mills by material ID
 */
export const useGetMaterialMills = (params: GetMaterialMillsParams) => {
  return useQuery({
    queryKey: queryKeys.reference.materialMills(params),
    queryFn: async (): Promise<MaterialMill[]> => {
      const response = await api.get<GetMaterialMillsResponse>(
        REFERENCE_ENDPOINTS.MATERIAL_MILLS,
        { params }
      );
      const responseData = response.data as any;

      if (responseData?.success && Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (responseData?.data?.mills) {
        return responseData.data.mills;
      }
      if (responseData?.mills) {
        return responseData.mills;
      }
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    enabled: !!params.material_id,
    staleTime: 1000 * 60 * 30,
  });
};

// ============================================
// MATERIAL THICKNESS TYPES
// ============================================

/**
 * Get material thickness types by material ID
 */
export const useGetMaterialThicknessTypes = (params: GetMaterialThicknessTypesParams) => {
  return useQuery({
    queryKey: queryKeys.reference.materialThicknessTypes(params),
    queryFn: async (): Promise<MaterialThicknessType[]> => {
      const response = await api.get<GetMaterialThicknessTypesResponse>(
        REFERENCE_ENDPOINTS.MATERIAL_THICKNESS_TYPES,
        { params }
      );
      const responseData = response.data as any;

      if (responseData?.success && Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (responseData?.data?.thickness_types) {
        return responseData.data.thickness_types;
      }
      if (responseData?.thickness_types) {
        return responseData.thickness_types;
      }
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    enabled: !!params.material_id,
    staleTime: 1000 * 60 * 30,
  });
};

// ============================================
// BRANDS (MILLS)
// ============================================

/**
 * Get all brands/mills
 */
export const useGetBrands = () => {
  return useQuery({
    queryKey: queryKeys.reference.brands(),
    queryFn: async (): Promise<Brand[]> => {
      const response = await api.get<GetBrandsResponse>(REFERENCE_ENDPOINTS.BRANDS);
      const responseData = response.data as any;

      if (responseData?.success && Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (responseData?.data?.brands) {
        return responseData.data.brands;
      }
      if (responseData?.brands) {
        return responseData.brands;
      }
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    staleTime: 1000 * 60 * 30,
  });
};
