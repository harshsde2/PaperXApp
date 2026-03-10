import type { RtdProduct, RtdPriceSlab } from '@services/api/rtdApi/@types';

export interface QuantityPricingCardProps {
  product: RtdProduct;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  priceSlab: RtdPriceSlab | null;
  /** When false, GST row is hidden and total = subtotal + platform fee. Default true for backward compatibility. */
  sellerGstRegistered?: boolean;
}
