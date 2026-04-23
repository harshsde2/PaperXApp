import { useQuery } from '@tanstack/react-query';
import { api } from '@services/api/client';
import { queryKeys } from '@services/api/queryClient';
import { INSIGHTS_ENDPOINTS } from '@shared/constants/api';
import type { MarketInsight, MarketInsightsHistoryResponse } from './@types';

const extractData = <T>(response: any): T => {
  if (response?.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data as T;
  }
  if (response?.data) {
    return response.data as T;
  }
  return response as T;
};

export const fetchTodayMarketInsight = async (): Promise<MarketInsight> => {
  const response = await api.get<MarketInsight>(INSIGHTS_ENDPOINTS.TODAY);
  return extractData<MarketInsight>(response);
};

export const fetchMarketInsightByDate = async (date: string): Promise<MarketInsight> => {
  const response = await api.get<MarketInsight>(INSIGHTS_ENDPOINTS.BY_DATE(date));
  return extractData<MarketInsight>(response);
};

export const fetchMarketInsightsHistory = async (days: number = 7): Promise<MarketInsightsHistoryResponse> => {
  const response = await api.get<MarketInsightsHistoryResponse>(INSIGHTS_ENDPOINTS.HISTORY(days));
  return extractData<MarketInsightsHistoryResponse>(response);
};

export const useGetTodayMarketInsight = () => {
  return useQuery({
    queryKey: queryKeys.insights.today(),
    queryFn: fetchTodayMarketInsight,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useGetMarketInsightByDate = (date: string) => {
  return useQuery({
    queryKey: queryKeys.insights.byDate(date),
    queryFn: () => fetchMarketInsightByDate(date),
    enabled: Boolean(date),
    staleTime: 0,
    gcTime: 0,
  });
};

export const useGetMarketInsightsHistory = (days: number = 7) => {
  return useQuery({
    queryKey: queryKeys.insights.history(days),
    queryFn: () => fetchMarketInsightsHistory(days),
    staleTime: 0,
    gcTime: 0,
  });
};
