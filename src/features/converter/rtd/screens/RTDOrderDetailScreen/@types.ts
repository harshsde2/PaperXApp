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

export const STATUS_LABELS: Partial<Record<RtdOrderStatus, string>> = {
  REQUESTED: 'New Order Request',
  ACCEPTED: 'Waiting for Platform Fee',
  CONNECTED: 'Brand Connected',
  PAID: 'Payment Received',
  IN_PRODUCTION: 'In Production',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
  DECLINED: 'Declined',
  EXPIRED: 'Expired',
};

export const STATUS_DESCRIPTIONS: Partial<Record<RtdOrderStatus, string>> = {
  REQUESTED: 'A brand has requested this order. Accept or decline before the deadline.',
  ACCEPTED: 'You accepted this order. Waiting for the brand to pay the platform fee.',
  CONNECTED:
    'The brand has paid the platform fee. Contact them directly to arrange payment and delivery.',
  PAID: 'Payment has been received. Contact the brand to coordinate offline.',
  IN_PRODUCTION: 'Legacy order status.',
  DISPATCHED: 'Legacy order status.',
  COMPLETED: 'Legacy order status.',
  CANCELLED: 'This order was cancelled by the brand.',
  DISPUTED: 'Legacy dispute status.',
  DECLINED: 'You declined this order request.',
  EXPIRED: 'This order request expired before you responded.',
};
