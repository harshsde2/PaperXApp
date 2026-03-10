export interface RtdListingPackModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
  /** Called when user taps "Add credits" after insufficient balance (optional). */
  onAddCredits?: () => void;
}
