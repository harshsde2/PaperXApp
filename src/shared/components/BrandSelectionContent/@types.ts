import { Theme } from '@theme/types';
import { Brand } from '@services/api';

export interface SelectedBrand {
  id: number;
  name: string;
}

export type BrandSelectionContentProps = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedBrand: SelectedBrand | null;
  brands: Brand[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelect: (brand: SelectedBrand) => void;
  theme: Theme;
};
