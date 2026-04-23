import type { MarketInsightArticle } from '../../@types';

export interface StandardNewsCardProps {
  article: MarketInsightArticle;
  categoryColor: string;
  onPress: (article: MarketInsightArticle) => void;
}
