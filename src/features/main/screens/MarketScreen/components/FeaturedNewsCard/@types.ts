import type { MarketInsightArticle } from '../../@types';

export interface FeaturedNewsCardProps {
  article: MarketInsightArticle;
  categoryColor: string;
  onPress: (article: MarketInsightArticle) => void;
}
