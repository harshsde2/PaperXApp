/**
 * Brand RTD (Ready-to-Dispatch) API
 * Catalog browsing, order lifecycle (request → pay → dispatch/complete → dispute)
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
  GetRtdCatalogParams,
  GetRtdCatalogResponse,
  GetRtdOrdersParams,
  GetRtdOrdersResponse,
  RequestRtdOrderPayload,
  ConfirmRtdPaymentPayload,
  CreateBrandRtdRazorpayOrderResponse,
} from '../rtdApi/@types';
import type { VerifyRazorpayPaymentRequest } from '../walletApi/@types';

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
// CATALOG HOOKS
// ============================================

export const useGetRtdCatalog = (
  params?: GetRtdCatalogParams,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.brandRtd.catalog(params),
    queryFn: async (): Promise<RtdProduct[]> => {
      const response = await api.get<GetRtdCatalogResponse>(
        RTD_ENDPOINTS.PRODUCTS_CATALOG,
        { params },
      );
      const raw = extractData<GetRtdCatalogResponse | RtdProduct[]>(response);
      if (Array.isArray(raw)) return raw;
      return (raw as GetRtdCatalogResponse)?.data ?? [];
    },
    staleTime: 1000 * 60,
    gcTime: 0,
    enabled: options?.enabled ?? true,
  });
};

export const useGetRtdCatalogInfinite = (
  params?: Omit<GetRtdCatalogParams, 'page'>,
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.brandRtd.catalogInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetRtdCatalogResponse> => {
      const response = await api.get<GetRtdCatalogResponse>(
        RTD_ENDPOINTS.PRODUCTS_CATALOG,
        { params: { ...params, page: pageParam } },
      );
      const raw = extractData<GetRtdCatalogResponse>(response);
      if (Array.isArray(raw)) {
        return { data: raw as RtdProduct[], meta: undefined };
      }
      return raw;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    staleTime: 1000 * 60,
    gcTime: 0,
  });
};

// ============================================
// BRAND ORDER HOOKS
// ============================================

export const useGetBrandRtdOrders = (
  params?: GetRtdOrdersParams,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.brandRtd.orders(params),
    queryFn: async (): Promise<RtdOrder[]> => {
      const response = await api.get<GetRtdOrdersResponse>(
        RTD_ENDPOINTS.ORDERS_MY,
        { params },
      );
      const raw = extractData<GetRtdOrdersResponse | RtdOrder[]>(response);
      if (Array.isArray(raw)) return raw;
      return (raw as GetRtdOrdersResponse)?.data ?? [];
    },
    staleTime: 0,
    gcTime: 0,
    enabled: options?.enabled ?? true,
  });
};

export const useGetBrandRtdOrdersInfinite = (
  params?: Omit<GetRtdOrdersParams, 'page'>,
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.brandRtd.ordersInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetRtdOrdersResponse> => {
      const response = await api.get<GetRtdOrdersResponse>(
        RTD_ENDPOINTS.ORDERS_MY,
        { params: { ...params, page: pageParam } },
      );
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

export const useGetBrandRtdOrderDetail = (
  id: number | string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) => {
  return useQuery({
    queryKey: queryKeys.brandRtd.orderDetail(id),
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

export const useRequestRtdOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RequestRtdOrderPayload): Promise<RtdOrder> => {
      const response = await api.post(RTD_ENDPOINTS.ORDER_STORE, data);
      return extractData<RtdOrder>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brandRtd.orders() });
    },
  });
};

export const useRequestRtdOrderWithLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RequestRtdOrderPayload & { logo?: any }): Promise<RtdOrder> => {
      const formData = new FormData();
      formData.append('product_id', String(data.product_id));
      formData.append('quantity', String(data.quantity));
      if (data.logo) {
        formData.append('logo', data.logo);
      }
      const response = await api.post(RTD_ENDPOINTS.ORDER_STORE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return extractData<RtdOrder>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brandRtd.orders() });
    },
  });
};

export const useConfirmRtdPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ConfirmRtdPaymentPayload): Promise<RtdOrder> => {
      const response = await api.post(
        RTD_ENDPOINTS.ORDER_CONFIRM_PAYMENT(data.order_id),
        {
          order_id: data.order_id,
          transaction_id: data.transaction_id,
        },
      );
      return extractData<RtdOrder>(response);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brandRtd.orders() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.brandRtd.orderDetail(variables.order_id),
      });
    },
  });
};

export const useCreateBrandRtdRazorpayOrder = () => {
  return useMutation({
    mutationFn: async (orderId: number): Promise<CreateBrandRtdRazorpayOrderResponse> => {
      const response = await api.post(RTD_ENDPOINTS.ORDER_RAZORPAY_CREATE(orderId));
      return extractData<CreateBrandRtdRazorpayOrderResponse>(response);
    },
  });
};

export type VerifyBrandRtdRazorpayPaymentVariables = { orderId: number } & VerifyRazorpayPaymentRequest;

export const useVerifyBrandRtdRazorpayPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: VerifyBrandRtdRazorpayPaymentVariables): Promise<RtdOrder> => {
      const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = vars;
      const response = await api.post(RTD_ENDPOINTS.ORDER_RAZORPAY_VERIFY(orderId), {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      return extractData<RtdOrder>(response);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brandRtd.orders() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.brandRtd.orderDetail(variables.orderId),
      });
    },
  });
};

export const useRaiseRtdDispute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number): Promise<RtdOrder> => {
      const response = await api.post(RTD_ENDPOINTS.ORDER_DISPUTE(orderId));
      return extractData<RtdOrder>(response);
    },
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brandRtd.orders() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.brandRtd.orderDetail(orderId),
      });
    },
  });
};

export const useCancelRtdOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number): Promise<RtdOrder> => {
      const response = await api.post(RTD_ENDPOINTS.ORDER_CANCEL(orderId));
      return extractData<RtdOrder>(response);
    },
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brandRtd.orders() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.brandRtd.orderDetail(orderId),
      });
    },
  });
};
