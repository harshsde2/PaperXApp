import type { StackScreenProps } from '@react-navigation/stack';
import type { MainStackParamList } from '@navigation/MainNavigator';
import { SCREENS } from '@navigation/constants';

export type BrandRTDMarketplaceScreenProps = StackScreenProps<
  MainStackParamList,
  typeof SCREENS.BRAND_RTD.MARKETPLACE
>;

export interface MarketplaceFilterState {
  category?: string;
  lead_time?: string;
  sort_by?: string;
  sort_dir?: string;
}
