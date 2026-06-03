import type { RtdListingPackItem } from '@services/api';

export interface RtdListingPackModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
  /** Wallet credits balance for client-side check before purchase API. */
  walletBalance: number;
  /** When true, pack Buy buttons are disabled. */
  walletBalanceLoading?: boolean;
  /** Called when user taps Buy but balance is below pack price (no purchase API). */
  onInsufficientBalanceForPack?: (pack: RtdListingPackItem) => void;
  /** After server reports insufficient balance; navigate to buy wallet credits. */
  onBuyWalletCredits?: () => void;
}
