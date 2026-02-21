import type { RtdOrderStatus } from '@services/api';

export interface OrderActionButtonsProps {
  status: RtdOrderStatus;
  onAccept: () => void;
  onDecline: () => void;
  onMarkInProduction: () => void;
  onDispatch: () => void;
  loading?: boolean;
}
