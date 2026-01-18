/**
 * useWallet Hook
 * Provides convenient access to wallet functionality across the app
 */

import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  useGetWalletBalance,
  useDeductCredits,
  DeductedTransactionType,
} from '@services/api';
import { SCREENS } from '@navigation/constants';

export interface DeductCreditsOptions {
  credits: number;
  description: string;
  transactionType: DeductedTransactionType;
  referenceId?: string;
  referenceType?: string;
  metadata?: Record<string, any>;
}

export interface DeductCreditsResult {
  success: boolean;
  error?: string;
  currentBalance?: number;
  requiredCredits?: number;
}

export interface UseWalletReturn {
  /** Current wallet balance */
  balance: number;
  /** Whether wallet data is loading */
  isLoading: boolean;
  /** Error if wallet fetch failed */
  error: Error | null;
  /** Wallet ID */
  walletId: string | null;
  /** Wallet status */
  status: string;
  /** Check if user has enough credits */
  hasEnoughCredits: (required: number) => boolean;
  /** Credits needed to reach a certain amount */
  creditsNeeded: (required: number) => number;
  /** Navigate to wallet screen */
  goToWallet: () => void;
  /** Navigate to credit packs screen */
  goToBuyCredits: () => void;
  /** Refetch wallet balance */
  refetch: () => void;
  /** Deduct credits with automatic error handling */
  deductCredits: (options: DeductCreditsOptions) => Promise<DeductCreditsResult>;
}

export const useWallet = (): UseWalletReturn => {
  const navigation = useNavigation<any>();
  const {
    data: wallet,
    isLoading,
    error,
    refetch,
  } = useGetWalletBalance();
  const { mutateAsync: deductCreditsMutation } = useDeductCredits();

  const balance = wallet?.balance ?? 0;
  const walletId = wallet?.wallet_id ?? null;
  const status = wallet?.status ?? 'ACTIVE';

  const hasEnoughCredits = useCallback(
    (required: number): boolean => {
      return balance >= required;
    },
    [balance]
  );

  const creditsNeeded = useCallback(
    (required: number): number => {
      const needed = required - balance;
      return needed > 0 ? needed : 0;
    },
    [balance]
  );

  const goToWallet = useCallback(() => {
    navigation.navigate(SCREENS.WALLET.MAIN);
  }, [navigation]);

  const goToBuyCredits = useCallback(() => {
    navigation.navigate(SCREENS.WALLET.CREDIT_PACKS);
  }, [navigation]);

  const deductCredits = useCallback(
    async (options: DeductCreditsOptions): Promise<DeductCreditsResult> => {
      // First check if enough credits locally
      if (!hasEnoughCredits(options.credits)) {
        return {
          success: false,
          error: `Insufficient credits. You have ${balance} credits, but ${options.credits} are required.`,
          currentBalance: balance,
          requiredCredits: options.credits,
        };
      }

      try {
        const response = await deductCreditsMutation({
          credits: options.credits,
          description: options.description,
          transaction_type: options.transactionType,
          reference_id: options.referenceId,
          reference_type: options.referenceType,
          metadata: options.metadata,
        });

        // Check if response indicates success
        if (response && 'success' in response) {
          if (response.success) {
            return { success: true };
          } else {
            // Insufficient balance error from server
            const errorResponse = response as any;
            return {
              success: false,
              error: errorResponse.message || 'Insufficient credits',
              currentBalance: errorResponse.data?.current_balance ?? balance,
              requiredCredits: errorResponse.data?.required ?? options.credits,
            };
          }
        }

        return { success: true };
      } catch (err: any) {
        // Handle API error response
        const errorData = err?.response?.data;
        if (errorData?.data?.current_balance !== undefined) {
          return {
            success: false,
            error: errorData.message || 'Insufficient credits',
            currentBalance: errorData.data.current_balance,
            requiredCredits: errorData.data.required,
          };
        }

        return {
          success: false,
          error: err?.message || 'Failed to deduct credits',
        };
      }
    },
    [hasEnoughCredits, balance, deductCreditsMutation]
  );

  return useMemo(
    () => ({
      balance,
      isLoading,
      error: error as Error | null,
      walletId,
      status,
      hasEnoughCredits,
      creditsNeeded,
      goToWallet,
      goToBuyCredits,
      refetch,
      deductCredits,
    }),
    [
      balance,
      isLoading,
      error,
      walletId,
      status,
      hasEnoughCredits,
      creditsNeeded,
      goToWallet,
      goToBuyCredits,
      refetch,
      deductCredits,
    ]
  );
};

export default useWallet;
