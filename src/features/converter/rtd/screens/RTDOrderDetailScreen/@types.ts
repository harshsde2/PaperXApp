import type { RtdOrderStatus } from '@services/api';

export interface RTDOrderDetailScreenProps {
  route: {
    params: {
      orderId: number | string;
    };
  };
}

export interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export const STATUS_LABELS: Record<RtdOrderStatus, string> = {
  REQUESTED: 'New Order Request',
  ACCEPTED: 'Waiting for Payment',
  PAID: 'Payment Received',
  IN_PRODUCTION: 'In Production',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
};

export const STATUS_DESCRIPTIONS: Record<RtdOrderStatus, string> = {
  REQUESTED: 'A brand has requested this order. Accept or decline before the deadline.',
  ACCEPTED: 'You accepted this order. Waiting for the brand to complete payment.',
  PAID: 'Payment has been received. Start production and mark when ready.',
  IN_PRODUCTION: 'Order is being produced. Dispatch when ready.',
  DISPATCHED: 'Order has been dispatched. Waiting for delivery confirmation from the brand.',
  COMPLETED: 'Order completed successfully. Payout has been released.',
  CANCELLED: 'This order was cancelled by the brand.',
  DISPUTED: 'A dispute has been raised on this order. Payout is on hold.',
};
