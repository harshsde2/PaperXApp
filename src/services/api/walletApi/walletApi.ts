/**
 * Wallet API Service
 * Handles all wallet-related operations including balance, purchases, transactions
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { api } from '../client';
import { WALLET_ENDPOINTS } from '@shared/constants/api';
import { queryKeys } from '../queryClient';
import type {
  // Balance
  WalletBalance,
  GetWalletBalanceResponse,
  // Credit Packs
  CreditPack,
  GetCreditPacksResponse,
  // Calculate
  CalculateCreditsRequest,
  CalculateCreditsResponse,
  // Purchase
  PurchaseCreditsRequest,
  PurchaseCreditsResponse,
  // Add
  AddCreditsRequest,
  AddCreditsResponse,
  // Deduct
  DeductCreditsRequest,
  DeductCreditsResponse,
  // Transactions
  GetTransactionsParams,
  GetTransactionsResponse,
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
// GET WALLET BALANCE
// ============================================

export const useGetWalletBalance = () => {
  return useQuery({
    queryKey: queryKeys.wallet.balance(),
    queryFn: async (): Promise<WalletBalance> => {
      const response = await api.get<GetWalletBalanceResponse>(
        WALLET_ENDPOINTS.BALANCE
      );
      return extractData<WalletBalance>(response);
    },
    staleTime: 1000 * 30, // 30 seconds - balance should be relatively fresh
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ============================================
// GET CREDIT PACKS
// ============================================

export const useGetCreditPacks = () => {
  return useQuery({
    queryKey: queryKeys.wallet.creditPacks(),
    queryFn: async (): Promise<CreditPack[]> => {
      const response = await api.get<GetCreditPacksResponse>(
        WALLET_ENDPOINTS.CREDIT_PACKS
      );
      const data = extractData<CreditPack[] | GetCreditPacksResponse>(response);
      // Handle both array and object response
      if (Array.isArray(data)) {
        return data;
      }
      return (data as GetCreditPacksResponse).packs || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - packs don't change often
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// ============================================
// CALCULATE CREDITS
// ============================================

export const useCalculateCredits = () => {
  return useMutation({
    mutationFn: async (
      data: CalculateCreditsRequest
    ): Promise<CalculateCreditsResponse> => {
      const response = await api.post<CalculateCreditsResponse>(
        WALLET_ENDPOINTS.CALCULATE,
        data
      );
      return extractData<CalculateCreditsResponse>(response);
    },
    onError: (error: Error) => {
      console.error('Calculate credits error:', error);
    },
  });
};

// ============================================
// PURCHASE CREDITS
// ============================================

export const usePurchaseCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: PurchaseCreditsRequest
    ): Promise<PurchaseCreditsResponse> => {
      const response = await api.post<PurchaseCreditsResponse>(
        WALLET_ENDPOINTS.PURCHASE,
        data
      );
      return extractData<PurchaseCreditsResponse>(response);
    },
    onSuccess: () => {
      // Invalidate wallet balance to refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
      // Invalidate transactions to show new purchase
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions() });
    },
    onError: (error: Error) => {
      console.error('Purchase credits error:', error);
    },
  });
};

// ============================================
// ADD CREDITS (Admin/System)
// ============================================

export const useAddCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCreditsRequest): Promise<AddCreditsResponse> => {
      const response = await api.post<AddCreditsResponse>(
        WALLET_ENDPOINTS.ADD,
        data
      );
      return extractData<AddCreditsResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions() });
    },
    onError: (error: Error) => {
      console.error('Add credits error:', error);
    },
  });
};

// ============================================
// DEDUCT CREDITS
// ============================================

export const useDeductCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: DeductCreditsRequest
    ): Promise<DeductCreditsResponse> => {
      const response = await api.post<DeductCreditsResponse>(
        WALLET_ENDPOINTS.DEDUCT,
        data
      );
      return extractData<DeductCreditsResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions() });
    },
    onError: (error: Error) => {
      console.error('Deduct credits error:', error);
    },
  });
};

// ============================================
// GET TRANSACTIONS
// ============================================

export const useGetTransactions = (params?: GetTransactionsParams) => {
  return useQuery({
    queryKey: queryKeys.wallet.transactions(params),
    queryFn: async (): Promise<GetTransactionsResponse> => {
      const response = await api.get<GetTransactionsResponse>(
        WALLET_ENDPOINTS.TRANSACTIONS,
        { params }
      );
      return extractData<GetTransactionsResponse>(response);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useGetTransactionsInfinite = (
  params?: Omit<GetTransactionsParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.wallet.transactionsInfinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<GetTransactionsResponse> => {
      const response = await api.get<GetTransactionsResponse>(
        WALLET_ENDPOINTS.TRANSACTIONS,
        { params: { ...params, page: pageParam } }
      );
      return extractData<GetTransactionsResponse>(response);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage.pagination &&
        lastPage.pagination.current_page < lastPage.pagination.last_page
      ) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 30,
  });
};
