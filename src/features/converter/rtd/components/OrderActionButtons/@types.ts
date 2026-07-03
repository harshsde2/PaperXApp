import type { RtdOrderStatus } from '@services/api';

export interface OrderActionButtonsProps {
  status: RtdOrderStatus;
  onAccept: () => void;
  onDecline: () => void;
  loadingAccept?: boolean;
  loadingDecline?: boolean;
}
