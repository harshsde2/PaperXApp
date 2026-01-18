/**
 * Wallet API Types
 * All TypeScript types, interfaces, and enums for wallet API
 */

import { PaginationMeta } from '../types';

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type WalletStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export type TransactionDirection = 'ADDED' | 'DEDUCTED' | 'ALL';

export type PaymentMethod = 'UPI' | 'NET_BANKING' | 'CARDS';

// Transaction types for added credits
export type AddedTransactionType =
  | 'PURCHASE'
  | 'REFERRAL_BONUS'
  | 'REFUND'
  | 'ADMIN_ADJUSTMENT'
  | 'OTHER';

// Transaction types for deducted credits
export type DeductedTransactionType =
  | 'REQUIREMENT_POSTED'
  | 'DEAL_CLOSED'
  | 'MACHINERY_INSPECTION'
  | 'LISTING_FEE'
  | 'PREMIUM_FEATURE'
  | 'OTHER';

export type TransactionType = AddedTransactionType | DeductedTransactionType;

// ============================================
// WALLET BALANCE
// ============================================

export interface WalletBalance {
  wallet_id: string;
  balance: number;
  status: WalletStatus;
  created_at: string;
}

export interface GetWalletBalanceResponse {
  wallet_id: string;
  balance: number;
  status: WalletStatus;
  created_at: string;
}

// ============================================
// CREDIT PACKS
// ============================================

export interface CreditPack {
  id: number;
  name: string;
  slug: string;
  credits: number;
  price: number;
  gst_percentage: number;
  gst_amount: number;
  total_price: number;
  description: string;
  validity: string;
  is_best_value: boolean;
}

export interface GetCreditPacksResponse {
  packs: CreditPack[];
}

// ============================================
// CALCULATE CREDITS
// ============================================

export interface CalculateCreditsRequest {
  amount: number;
}

export interface CalculateCreditsResponse {
  amount: number;
  gst_percentage: number;
  gst_amount: number;
  total_amount: number;
  credits: number;
}

// ============================================
// PURCHASE CREDITS
// ============================================

export interface PurchaseCreditsFromPackRequest {
  credit_pack_id: number;
  payment_method?: PaymentMethod;
}

export interface PurchaseCreditsCustomRequest {
  amount: number;
  gst_percentage?: number;
  payment_method?: PaymentMethod;
}

export type PurchaseCreditsRequest =
  | PurchaseCreditsFromPackRequest
  | PurchaseCreditsCustomRequest;

export interface PurchaseCreditsResponse {
  transaction_id: string;
  credits_added: number;
  new_balance: number;
  amount_paid: number;
}

// ============================================
// ADD CREDITS (Admin/System)
// ============================================

export interface AddCreditsRequest {
  credits: number;
  description: string;
  transaction_type?: AddedTransactionType;
  reference_id?: string;
  reference_type?: string;
  metadata?: Record<string, any>;
}

export interface AddCreditsResponse {
  transaction_id: string;
  credits_added: number;
  new_balance: number;
}

// ============================================
// DEDUCT CREDITS
// ============================================

export interface DeductCreditsRequest {
  credits: number;
  description: string;
  transaction_type?: DeductedTransactionType;
  reference_id?: string;
  reference_type?: string;
  metadata?: Record<string, any>;
}

export interface DeductCreditsSuccessResponse {
  success: true;
  message: string;
  data: {
    transaction_id: string;
    credits_deducted: number;
    new_balance: number;
  };
}

export interface DeductCreditsErrorResponse {
  success: false;
  message: string;
  data: {
    current_balance: number;
    required: number;
  };
}

export type DeductCreditsResponse =
  | DeductCreditsSuccessResponse
  | DeductCreditsErrorResponse;

// ============================================
// TRANSACTIONS
// ============================================

export interface WalletTransaction {
  id: number;
  transaction_id: string;
  type: TransactionDirection;
  amount: number;
  credits: string; // "+120" or "-50"
  balance_after: number;
  description: string;
  transaction_type: TransactionType;
  reference_id?: string | null;
  reference_type?: string | null;
  created_at: string;
  date: string;
  time: string;
}

export interface GetTransactionsParams {
  type?: TransactionDirection;
  transaction_type?: TransactionType;
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
  per_page?: number;
  page?: number;
}

export interface TransactionsPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface GetTransactionsResponse {
  wallet_id: string;
  balance: number;
  status: WalletStatus;
  transactions: WalletTransaction[];
  pagination: TransactionsPagination;
}

// ============================================
// INSUFFICIENT BALANCE ERROR
// ============================================

export interface InsufficientBalanceError {
  success: false;
  message: string;
  data: {
    current_balance: number;
    required: number;
  };
}

// ============================================
// HOOK RETURN TYPES
// ============================================

export interface UseWalletReturn {
  wallet: WalletBalance | undefined;
  isLoading: boolean;
  error: Error | null;
  balance: number;
  hasEnoughCredits: (required: number) => boolean;
  refetch: () => void;
}
