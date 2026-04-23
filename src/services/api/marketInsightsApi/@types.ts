export type MarketSentiment = 'bullish' | 'bearish' | 'neutral';

export interface MarketInsightArticle {
  title: string;
  source: string;
  published_at: string;
  summary: string;
  url: string;
  image_url: string | null;
  category: string;
}

export interface MarketInsight {
  id: number;
  insight_date: string;
  insight_text: string;
  sentiment: MarketSentiment;
  articles: MarketInsightArticle[];
  created_at: string;
  updated_at: string;
}

export interface MarketInsightsHistoryResponse {
  days: number;
  items: MarketInsight[];
}
