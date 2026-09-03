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
  // First request of the day triggers RSS + AI generation on the backend,
  // which can take well over the default 30s timeout.
  const response = await api.get<MarketInsight>(INSIGHTS_ENDPOINTS.TODAY, { timeout: 120000 });
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

/**
 * Market insights are generated once per day, so unlike sessions/matches they
 * are NOT time-sensitive. Caching them means re-opening the screen renders
 * instantly from cache instead of showing a spinner on every visit.
 */
const INSIGHTS_STALE_TIME = 30 * 60 * 1000; // 30 minutes
const INSIGHTS_GC_TIME = 60 * 60 * 1000; // keep in memory for 1 hour

export const useGetTodayMarketInsight = () => {
  return useQuery({
    queryKey: queryKeys.insights.today(),
    queryFn: fetchTodayMarketInsight,
    staleTime: INSIGHTS_STALE_TIME,
    gcTime: INSIGHTS_GC_TIME,
  });
};

export const useGetMarketInsightByDate = (date: string) => {
  return useQuery({
    queryKey: queryKeys.insights.byDate(date),
    queryFn: () => fetchMarketInsightByDate(date),
    enabled: Boolean(date),
    // A past date's insight never changes — cache it aggressively.
    staleTime: INSIGHTS_STALE_TIME,
    gcTime: INSIGHTS_GC_TIME,
  });
};

export const useGetMarketInsightsHistory = (days: number = 7) => {
  return useQuery({
    queryKey: queryKeys.insights.history(days),
    queryFn: () => fetchMarketInsightsHistory(days),
    staleTime: INSIGHTS_STALE_TIME,
    gcTime: INSIGHTS_GC_TIME,
  });
};
