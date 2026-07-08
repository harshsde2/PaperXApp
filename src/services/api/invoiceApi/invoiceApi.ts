import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '@services/api/client';
import { queryKeys } from '@services/api/queryClient';
import { INVOICE_ENDPOINTS } from '@shared/constants/api';
import type { GetInvoicesResponse, InvoiceDetail } from './@types';

const extractData = <T>(response: any): T => {
  if (response?.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data as T;
  }
  if (response?.data) {
    return response.data as T;
  }
  return response as T;
};

export const useGetInvoicesInfinite = (perPage: number = 15) => {
  return useInfiniteQuery({
    queryKey: queryKeys.invoices.list(),
    queryFn: async ({ pageParam = 1 }): Promise<GetInvoicesResponse> => {
      const response = await api.get(INVOICE_ENDPOINTS.LIST, {
        params: { page: pageParam, per_page: perPage },
      });
      return extractData<GetInvoicesResponse>(response);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    staleTime: 30_000,
    gcTime: 0,
  });
};

export const useGetInvoiceDetail = (key: string) => {
  return useQuery({
    queryKey: queryKeys.invoices.detail(key),
    queryFn: async (): Promise<InvoiceDetail> => {
      const response = await api.get(INVOICE_ENDPOINTS.DETAIL(key));
      return extractData<InvoiceDetail>(response);
    },
    enabled: !!key,
    // download_url is a temporary signed link — always fetch fresh.
    staleTime: 0,
    gcTime: 0,
  });
};
