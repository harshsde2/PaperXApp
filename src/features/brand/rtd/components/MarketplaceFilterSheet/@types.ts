import type { AdvancedFilterState } from '../../screens/BrandRTDMarketplaceScreen/@types';

export interface MarketplaceFilterSheetProps {
  filters: AdvancedFilterState;
  onApply: (filters: AdvancedFilterState) => void;
  onReset: () => void;
}

export interface LeadTimeOption {
  value: string;
  label: string;
}
