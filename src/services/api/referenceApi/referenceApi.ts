/**
 * Reference Data API Service
 * Handles fetching materials, machines, finishes, mills, brands, etc.
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { REFERENCE_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  GetMaterialsResponse,
  GetMaterialDetailsResponse,
  GetMachinesParams,
  GetMachinesResponse,
  GetMaterialFinishesParams,
  GetMaterialFinishesResponse,
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
 */
export const useGetMaterials = () => {
  return useQuery({
    queryKey: queryKeys.reference.materials(),
    queryFn: async (): Promise<Material[]> => {
      const response = await api.get<GetMaterialsResponse>(REFERENCE_ENDPOINTS.MATERIALS);
      const responseData = response.data as any;

      if (responseData?.data?.materials) {
        return responseData.data.materials;
      }
      if (responseData?.materials) {
        return responseData.materials;
      }
      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }

      return [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - reference data doesn't change often
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
 * Get material finishes by material ID
 */
export const useGetMaterialFinishes = (params: GetMaterialFinishesParams) => {
  return useQuery({
    queryKey: queryKeys.reference.materialFinishes(params),
    queryFn: async (): Promise<MaterialFinish[]> => {
      const response = await api.get<GetMaterialFinishesResponse>(
        REFERENCE_ENDPOINTS.MATERIAL_FINISHES,
        { params }
      );
      const responseData = response.data as any;

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
    enabled: !!params.material_id,
    staleTime: 1000 * 60 * 30,
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

