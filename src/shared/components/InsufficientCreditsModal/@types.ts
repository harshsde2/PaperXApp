/**
 * InsufficientCreditsModal Component Types
 */

export interface InsufficientCreditsModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Current wallet balance */
  currentBalance: number;
  /** Credits required for the action */
  requiredCredits: number;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when user wants to buy credits */
  onBuyCredits: () => void;
  /** Optional title override */
  title?: string;
  /** Optional message override */
  message?: string;
  /** Test ID for testing */
  testID?: string;
}
