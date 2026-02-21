import type { RtdDispatchProofType } from '@services/api';

export interface DispatchProofModalProps {
  visible: boolean;
  orderId: number;
  onClose: () => void;
  onSuccess: () => void;
}
