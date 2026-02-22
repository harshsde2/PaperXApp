import type { RtdProduct } from '@services/api/rtdApi/@types';

export interface RTDProductCardProps {
  product: RtdProduct;
  onBuyNow: (product: RtdProduct) => void;
  hasActiveOrder?: boolean;
  activeOrderId?: number;
  onViewOrder?: (orderId: number) => void;
}
