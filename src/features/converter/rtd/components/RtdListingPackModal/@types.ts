export interface RtdListingPackModalProps {
  visible: boolean;
  onClose: () => void;
  /** Called after a pack is purchased (credits or Razorpay). Parent auto-creates the product. */
  onPurchaseSuccess: () => void;
  /** Wallet credits balance for client-side check before purchase API. */
  walletBalance: number;
  /** When true, pack Buy buttons are disabled. */
  walletBalanceLoading?: boolean;
}
