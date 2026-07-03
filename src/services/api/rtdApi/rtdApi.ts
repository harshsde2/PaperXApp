/**
 * RTD (Ready-to-Dispatch) API - Converter only
 * Products and orders management
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { api } from '../client';
import { RTD_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  RtdProduct,
  RtdOrder,
  RtdListingPackItem,
  RtdEntitlementItem,
  PurchaseRtdPackPayload,
  GetConverterRtdProductsParams,
  GetConverterRtdProductsResponse,
  GetRtdOrdersParams,
  GetRtdOrdersResponse,
  CreateRtdProductRequest,
  UpdateRtdProductRequest,
} from './@types';

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
// LISTING PACKS & ENTITLEMENT
// ============================================

export const useGetRtdListingPacks = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.converterRtd.listingPacks(),
    queryFn: async (): Promise<RtdListingPackItem[]> => {
      const response = await api.get(RTD_ENDPOINTS.LISTING_PACKS);
      const raw = extractData<{ data?: RtdListingPackItem[] } | RtdListingPackItem[]>(response);
      if (Array.isArray(raw)) return raw;
      return (raw as { data?: RtdListingPackItem[] })?.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 0,
    enabled: options?.enabled ?? true,
  });
};

export const useGetRtdEntitlement = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.converterRtd.entitlement(),
    queryFn: async (): Promise<{ entitlement: RtdEntitlementItem | null }> => {
      const response = await api.get(RTD_ENDPOINTS.RTD_ENTITLEMENT);
      const raw = extractData<{ entitlement?: RtdEntitlementItem | null }>(response);
      return { entitlement: raw?.entitlement ?? null };
    },
    staleTime: 0,
    gcTime: 0,
    enabled: options?.enabled ?? true,
  });
};

export const usePurchaseRtdListingPack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PurchaseRtdPackPayload): Promise<{ entitlement: RtdEntitlementItem }> => {
      const response = await api.post(RTD_ENDPOINTS.LISTING_PACKS_PURCHASE, payload);
      const raw = extractData<{ entitlement?: RtdEntitlementItem }>(response);
      return { entitlement: raw?.entitlement ?? (raw as any)?.entitlement };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.entitlement() });
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.all });
    },
  });
};

// ============================================
// PRODUCT HOOKS
// ============================================

export const useGetConverterRtdProducts = (
  params?: GetConverterRtdProductsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.converterRtd.myProducts(params),
    queryFn: async (): Promise<RtdProduct[]> => {
      const response = await api.get<GetConverterRtdProductsResponse>(RTD_ENDPOINTS.PRODUCTS_MY, {
        params,
      });
      const raw = extractData<GetConverterRtdProductsResponse | RtdProduct[]>(response);
      if (Array.isArray(raw)) return raw;
      return (raw as GetConverterRtdProductsResponse)?.data ?? [];
    },
    staleTime: 1000 * 60,
    gcTime: 0,
    enabled: options?.enabled ?? true,
  });
};

export const useGetRtdProductDetail = (
  id: number | string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.converterRtd.productDetail(id),
    queryFn: async (): Promise<RtdProduct> => {
      const response = await api.get(RTD_ENDPOINTS.PRODUCT_DETAIL(id));
      return extractData<RtdProduct>(response);
    },
    staleTime: 1000 * 60,
    gcTime: 0,
    enabled: options?.enabled ?? true,
  });
};

export const useCreateRtdProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateRtdProductRequest): Promise<RtdProduct> => {
      const response = await api.post(RTD_ENDPOINTS.PRODUCT_STORE, data);
      return extractData<RtdProduct>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.all });
    },
  });
};

export const useUpdateRtdProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateRtdProductRequest;
    }): Promise<RtdProduct> => {
      const response = await api.put(RTD_ENDPOINTS.PRODUCT_UPDATE(id), data);
      return extractData<RtdProduct>(response);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.converterRtd.productDetail(variables.id),
      });
    },
  });
};

export const usePauseRtdProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<RtdProduct> => {
      const response = await api.post(RTD_ENDPOINTS.PRODUCT_PAUSE(id));
      return extractData<RtdProduct>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.all });
    },
  });
};

export const useResumeRtdProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<RtdProduct> => {
      const response = await api.post(RTD_ENDPOINTS.PRODUCT_RESUME(id));
      return extractData<RtdProduct>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.all });
    },
  });
};

// ============================================
// ORDER HOOKS
// ============================================

export const useGetRtdOrders = (
  params?: GetRtdOrdersParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.converterRtd.orders(params),
    queryFn: async (): Promise<RtdOrder[]> => {
      const response = await api.get<GetRtdOrdersResponse>(RTD_ENDPOINTS.ORDERS_MY, {
        params,
      });
      const raw = extractData<GetRtdOrdersResponse | RtdOrder[]>(response);
      if (Array.isArray(raw)) return raw;
      return (raw as GetRtdOrdersResponse)?.data ?? [];
    },
    staleTime: 0,
    gcTime: 0,
    enabled: options?.enabled ?? true,
  });
};

export const useGetRtdOrdersInfinite = (
  params?: Omit<GetRtdOrdersParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.converterRtd.ordersInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetRtdOrdersResponse> => {
      const response = await api.get<GetRtdOrdersResponse>(RTD_ENDPOINTS.ORDERS_MY, {
        params: { ...params, page: pageParam },
      });
      const raw = extractData<GetRtdOrdersResponse>(response);
      if (Array.isArray(raw)) {
        return { data: raw as RtdOrder[], meta: undefined };
      }
      return raw;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    staleTime: 0,
    gcTime: 0,
  });
};

export const useGetRtdOrderDetail = (
  id: number | string,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) => {
  return useQuery({
    queryKey: queryKeys.converterRtd.orderDetail(id),
    queryFn: async (): Promise<RtdOrder> => {
      const response = await api.get(RTD_ENDPOINTS.ORDER_DETAIL(id));
      return extractData<RtdOrder>(response);
    },
    staleTime: 0,
    gcTime: 0,
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });
};

export const useAcceptRtdOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<RtdOrder> => {
      const response = await api.post(RTD_ENDPOINTS.ORDER_ACCEPT(id));
      return extractData<RtdOrder>(response);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.orders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.orderDetail(id) });
    },
  });
};

export const useDeclineRtdOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<RtdOrder> => {
      const response = await api.post(RTD_ENDPOINTS.ORDER_DECLINE(id));
      return extractData<RtdOrder>(response);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.orders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.converterRtd.orderDetail(id) });
    },
  });
};
