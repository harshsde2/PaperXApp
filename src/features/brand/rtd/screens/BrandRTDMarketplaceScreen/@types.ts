import type { StackScreenProps } from '@react-navigation/stack';
import type { MainStackParamList } from '@navigation/MainNavigator';
import type { RtdLeadTime } from '@services/api/rtdApi/@types';
import { SCREENS } from '@navigation/constants';

export type BrandRTDMarketplaceScreenProps = StackScreenProps<
  MainStackParamList,
  typeof SCREENS.BRAND_RTD.MARKETPLACE
>;

export interface MarketplaceFilterState {
  category?: string;
  lead_time?: RtdLeadTime;
  delivery_geography?: string;
  min_price?: number;
  max_price?: number;
  min_moq?: number;
  max_moq?: number;
  has_branding?: 'yes' | 'no';
  sort_by?: 'base_price' | 'created_at' | 'visibility_score';
  sort_dir?: 'asc' | 'desc';
}

export type MoqRange = '' | '0-50' | '50-500' | '500+';
export type LocationScope = '' | 'city' | 'state' | 'pan_india';

export interface AdvancedFilterState {
  delivery_geography: string;
  lead_time: string;
  min_price: string;
  max_price: string;
  moq_range: MoqRange;
  category: string;
  location_scope: LocationScope;
  has_branding: 'yes' | 'no' | null;
}

export const INITIAL_ADVANCED_FILTERS: AdvancedFilterState = {
  delivery_geography: '',
  lead_time: '',
  min_price: '',
  max_price: '',
  moq_range: '',
  category: '',
  location_scope: '',
  has_branding: null,
};
