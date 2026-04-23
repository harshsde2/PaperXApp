import type { Theme } from '@theme/types';
export type { MarketInsightArticle } from '@services/api';

export const FILTER_CHIPS = [
  'All',
  'Market Prices',
  'Supply Chain',
  'Packaging',
  'Sustainability',
  'Mills & Manufacturing',
  'Trade & Export',
] as const;

export type FilterChipLabel = (typeof FILTER_CHIPS)[number];
export type MarketArticleCategory = Exclude<FilterChipLabel, 'All'>;

export interface FilterChipItem {
  label: FilterChipLabel;
  count: number;
}

export const getCategoryColor = (theme: Theme, category: string): string => {
  switch (category) {
    case 'Supply Chain':
      return theme.colors.warning.DEFAULT;
    case 'Packaging':
      return theme.colors.success.DEFAULT;
    case 'Sustainability':
      return theme.colors.success.dark;
    case 'Mills & Manufacturing':
      return theme.colors.secondary.DEFAULT;
    case 'Trade & Export':
      return theme.colors.primary.dark;
    case 'All':
      return theme.colors.primary.DEFAULT;
    case 'Market Prices':
    default:
      return theme.colors.info.DEFAULT;
  }
};
