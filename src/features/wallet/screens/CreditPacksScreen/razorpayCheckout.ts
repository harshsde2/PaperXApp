/**
 * Thin wrapper around react-native-razorpay for CreditPacksScreen.
 * SDK rejects with a plain object (not always `Error`) on cancel / failure.
 */

import RazorpayCheckout from 'react-native-razorpay';
import type { CreateRazorpayOrderResponse } from '@services/api/walletApi/@types';
import type { CreateBrandRtdRazorpayOrderResponse } from '@services/api/rtdApi/@types';

export type RazorpayOpenResult = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

/**
 * Shared `modal` options for every RazorpayCheckout.open call.
 * - confirm_close: false — suppress the "cancel payment?" confirmation dialog.
 *   Razorpay's success screen lingers ~5s before auto-dismissing and its back
 *   handler otherwise pops that dialog even on success, which can dead-lock the
 *   checkout (its buttons stop responding → app must be force-restarted).
 * - animation: true — keep the normal open/close transition.
 */
const RAZORPAY_MODAL_OPTIONS = {
  confirm_close: false,
  animation: true,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** User closed checkout or chose cancel — do not show as a hard failure. */
export function isRazorpayUserCancellation(err: unknown): boolean {
  if (!isRecord(err)) {
    return false;
  }
  const code = typeof err.code === 'number' ? err.code : undefined;
  const description = String(err.description ?? '').toLowerCase();
  if (code === 0 || code === 2) {
    return true;
  }
  if (description.includes('cancel')) {
    return true;
  }
  return false;
}

export function isRazorpaySdkError(err: unknown): boolean {
  return isRecord(err) && typeof err.code === 'number' && 'description' in err;
}

export function formatPurchaseError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (isRecord(err) && typeof err.description === 'string') {
    return err.description;
  }
  return 'Something went wrong. Please try again.';
}

export async function openRazorpayForWalletOrder(
  order: CreateRazorpayOrderResponse,
  prefill: { contact?: string; name?: string }
): Promise<RazorpayOpenResult> {
  const options = {
    key: order.key_id,
    order_id: order.razorpay_order_id,
    amount: order.amount,
    currency: order.currency,
    name: 'Zupply',
    description: `${order.pack.name} – ${order.pack.credits} credits`,
    prefill: {
      ...(prefill.contact ? { contact: prefill.contact } : {}),
      ...(prefill.name ? { name: prefill.name } : {}),
    },
    theme: { color: '#0D0D0D' },
    // Razorpay shows its own "Payment Successful" screen for ~5s before it
    // auto-dismisses. Its default back handler pops a "cancel payment?" confirm
    // dialog on ANY back press — even on that success screen — and in the SDK's
    // current build that dialog can dead-lock the checkout activity (Cancel/OK
    // stop responding, forcing an app restart). Disabling confirm_close makes a
    // back-press on the success screen just dismiss cleanly.
    modal: RAZORPAY_MODAL_OPTIONS,
  };

  const data = (await RazorpayCheckout.open(options)) as {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  };

  const razorpay_payment_id = data?.razorpay_payment_id ?? '';
  const razorpay_order_id = data?.razorpay_order_id ?? order.razorpay_order_id;
  const razorpay_signature = data?.razorpay_signature ?? '';

  if (!razorpay_payment_id || !razorpay_signature) {
    throw new Error('Payment completed but verification details were missing. You can retry from your order.');
  }

  return {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  };
}

export async function openRazorpayForBrandRtdOrder(
  order: CreateBrandRtdRazorpayOrderResponse,
  prefill: { contact?: string; name?: string }
): Promise<RazorpayOpenResult> {
  const totalInr = parseFloat(String(order.order.total_amount ?? '0')) || 0;
  const description = `RTD Order #${order.order.id} — ₹${totalInr.toLocaleString('en-IN')}`;
  const options = {
    key: order.key_id,
    order_id: order.razorpay_order_id,
    amount: order.amount,
    currency: order.currency,
    name: 'Zupply',
    description,
    prefill: {
      ...(prefill.contact ? { contact: prefill.contact } : {}),
      ...(prefill.name ? { name: prefill.name } : {}),
    },
    theme: { color: '#0D0D0D' },
    // See openRazorpayForWalletOrder: disables the post-success "cancel payment?"
    // dialog that can dead-lock the checkout when back is pressed.
    modal: RAZORPAY_MODAL_OPTIONS,
  };

  const data = (await RazorpayCheckout.open(options)) as {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  };

  const razorpay_payment_id = data?.razorpay_payment_id ?? '';
  const razorpay_order_id = data?.razorpay_order_id ?? order.razorpay_order_id;
  const razorpay_signature = data?.razorpay_signature ?? '';

  if (!razorpay_payment_id || !razorpay_signature) {
    throw new Error('Payment completed but verification details were missing. You can retry from your order.');
  }

  return {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  };
}
