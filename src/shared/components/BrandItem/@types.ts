import { Theme } from '@theme/types';

export interface BrandItemData {
  id: number;
  name: string;
}

export type BrandItemProps = {
  item: BrandItemData;
  isSelected: boolean;
  onSelect: (brand: BrandItemData) => void;
  theme: Theme;
};
