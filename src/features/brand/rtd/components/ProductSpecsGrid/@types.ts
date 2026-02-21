import type { RtdProduct } from '@services/api/rtdApi/@types';

export interface ProductSpecsGridProps {
  product: RtdProduct;
}

export interface SpecItem {
  label: string;
  value: string;
}
