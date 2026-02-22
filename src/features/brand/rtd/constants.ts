import type { RtdOrder, RtdOrderStatus } from '@services/api/rtdApi/@types';

/**
 * Statuses that represent an active/in-progress order.
 * A brand is blocked from placing a new order for a product
 * while any order in one of these statuses exists.
 *
 * Mirrors backend: RTDOrderStatus::activeStatuses()
 */
export const ACTIVE_RTD_STATUSES: RtdOrderStatus[] = [
  'REQUESTED',
  'ACCEPTED',
  'PAID',
  'IN_PRODUCTION',
  'DISPATCHED',
  'DISPUTED',
];

/**
 * Safely extract product ID from an order.
 * Handles both `product_id` (top-level) and `product.id` (nested).
 */
export const getOrderProductId = (order: RtdOrder): number | undefined =>
  order.product_id ?? order.product?.id;
