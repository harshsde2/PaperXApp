import type { RtdOrder } from '@services/api';

export interface OrderCardProps {
  order: RtdOrder;
  onPress: (id: number) => void;
}
