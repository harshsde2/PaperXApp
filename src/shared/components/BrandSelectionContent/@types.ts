import type { ComponentType } from 'react';
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
  ListComponent?: ComponentType<any>;
  /** Called to create + select a custom brand when the user can't find theirs. */
  onAddCustom?: (name: string) => void;
  /** Whether a custom brand is currently being created. */
  isAddingCustom?: boolean;
};
