import type { RtdOrderStatus } from '@services/api';

export interface OrderStatusBadgeProps {
  status: RtdOrderStatus;
}

export type OrderStatusBadgeStyleKey =
  | 'requested'
  | 'accepted'
  | 'paid'
  | 'inProduction'
  | 'dispatched'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'textRequested'
  | 'textAccepted'
  | 'textPaid'
  | 'textInProduction'
  | 'textDispatched'
  | 'textCompleted'
  | 'textCancelled'
  | 'textDisputed';
