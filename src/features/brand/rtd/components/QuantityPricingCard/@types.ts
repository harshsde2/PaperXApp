import type { RtdProduct, RtdPriceSlab } from '@services/api/rtdApi/@types';

export interface QuantityPricingCardProps {
  product: RtdProduct;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  priceSlab: RtdPriceSlab | null;
}
