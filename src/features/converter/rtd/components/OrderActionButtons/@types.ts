import type { RtdOrderStatus } from '@services/api';

export interface OrderActionButtonsProps {
  status: RtdOrderStatus;
  onAccept: () => void;
  onDecline: () => void;
  onMarkInProduction: () => void;
  onDispatch: () => void;
  /** Show loading only on the Accept button */
  loadingAccept?: boolean;
  /** Show loading only on the Decline button */
  loadingDecline?: boolean;
  /** Show loading only on the Mark In Production button */
  loadingMarkInProduction?: boolean;
}
