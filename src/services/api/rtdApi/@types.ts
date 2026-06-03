/**
 * RTD (Ready-to-Dispatch) API types - Converter & Brand
 */

// ============================================
// PRODUCT TYPES
// ============================================

export interface RtdPriceSlab {
  id?: number;
  min_qty: number;
  max_qty: number;
  price_per_unit: string | number;
}

export interface RtdProduct {
  id: number;
  /** When false, brand sees no GST (product value + platform fee only). */
  seller_gst_registered?: boolean;
  category: string;
  product_name: string;
  /** When product_name is empty, API returns category as display title */
  display_name?: string;
  image_path: string | null;
  size: string | null;
  size_unit?: 'inches' | 'cm' | 'mm' | null;
  material_id?: number | null;
  material: string | null;
  material_custom?: string | null;
  thickness: string | null;
  thickness_unit?: 'GSM' | 'MM' | 'OUNCE' | 'BF' | 'MICRON' | null;
  finish_ids?: number[] | null;
  finish: string | null;
  branding_methods?: string[] | null;
  branding_method: string | null;
  lead_time: string | null;
  lead_time_label: string | null;
  moq: number;
  max_capacity?: number;
  base_price: string;
  buy_now_enabled: boolean;
  delivery_geography: string | null;
  location_id?: number | null;
  location_source?: 'saved' | 'manual' | null;
  latitude?: number | null;
  longitude?: number | null;
  status: 'active' | 'paused' | 'pending' | string;
  decline_count?: number;
  visibility_score?: number;
  price_slabs?: RtdPriceSlab[];
  created_at?: string;
  updated_at?: string;
}

export type RtdLeadTime = 'SAME_DAY' | 'H24' | 'H48' | 'DAYS_3_5';

export interface CreateRtdProductRequest {
  category: string;
  product_name: string;
  image_path?: string | null;
  size?: string;
  size_unit?: 'inches' | 'cm' | 'mm';
  material_id?: number;
  material?: string;
  material_custom?: string;
  thickness?: string;
  thickness_unit?: 'GSM' | 'MM' | 'OUNCE' | 'BF' | 'MICRON';
  finish_ids?: number[];
  finish?: string;
  branding_methods?: string[];
  branding_method?: string;
  lead_time: RtdLeadTime;
  moq: number;
  max_capacity?: number;
  base_price: number;
  buy_now_enabled?: boolean;
  delivery_geography?: string;
  location_id?: number;
  location_source?: 'saved' | 'manual';
  latitude?: number;
  longitude?: number;
  price_slabs?: Omit<RtdPriceSlab, 'id'>[];
}

export interface UpdateRtdProductRequest {
  category?: string;
  product_name?: string;
  image_path?: string | null;
  size?: string;
  size_unit?: 'inches' | 'cm' | 'mm';
  material_id?: number;
  material?: string;
  material_custom?: string;
  thickness?: string;
  thickness_unit?: 'GSM' | 'MM' | 'OUNCE' | 'BF' | 'MICRON';
  finish_ids?: number[];
  finish?: string;
  branding_methods?: string[];
  branding_method?: string;
  lead_time?: RtdLeadTime;
  moq?: number;
  max_capacity?: number;
  base_price?: number;
  buy_now_enabled?: boolean;
  delivery_geography?: string;
  location_id?: number;
  location_source?: 'saved' | 'manual';
  latitude?: number;
  longitude?: number;
  price_slabs?: Omit<RtdPriceSlab, 'id'>[];
}

export interface GetConverterRtdProductsParams {
  status?: string;
  category?: string;
  per_page?: number;
  page?: number;
}

export interface GetConverterRtdProductsResponse {
  data: RtdProduct[];
  meta?: PaginationMeta;
}

// ============================================
// ORDER TYPES
// ============================================

export type RtdOrderStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'PAID'
  | 'IN_PRODUCTION'
  | 'DISPATCHED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface RtdOrderPayout {
  id: number;
  /** Payout amount (API may return as `amount` or `payout_amount`) */
  amount?: string;
  payout_amount?: string;
  payout_status: 'PENDING' | 'RELEASED' | 'HOLD_DISPUTE';
  released_at?: string | null;
}

export interface RtdOrderProduct {
  id: number;
  product_name: string;
  category: string;
  image_path: string | null;
  base_price: string;
  moq: number;
  delivery_geography?: string | null;
  display_name?: string;
}

export interface RtdOrderBrand {
  id: number;
  name: string;
  company_name?: string;
  email?: string;
  mobile?: string;
}

export interface RtdOrderConverter {
  id: number;
  name: string;
  company_name?: string;
  email?: string;
  mobile?: string;
}

export interface RtdOrder {
  id: number;
  /** When false, order has no GST (gst_amount = 0). */
  seller_gst_registered?: boolean;
  product_id: number;
  quantity: number;
  status: RtdOrderStatus;
  subtotal: string;
  commission_amount: string;
  gst_amount: string;
  total_amount: string;
  /** @deprecated Use unit_price - API returns unit_price */
  price_per_unit?: string;
  /** Converter price per unit (API returns this as unit_price) */
  unit_price?: string | number;
  confirmation_deadline?: string | null;
  paid_at?: string | null;
  dispatched_at?: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
  tracking_number?: string | null;
  dispatch_proof_type?: 'tracking_number' | 'lr_photo' | 'delivery_challan' | null;
  dispatch_proof_url?: string | null;
  logo_path?: string | null;
  transaction_id?: string | null;
  product?: RtdOrderProduct;
  brand?: RtdOrderBrand;
  converter?: RtdOrderConverter;
  payout?: RtdOrderPayout | null;
  created_at: string;
  updated_at: string;
}

/** Document type for dispatch proof (one of these + file is required). */
export type RtdDispatchProofType =
  | 'courier_receipt'
  | 'lr_copy'
  | 'eway_bill'
  | 'transport_challan'
  | 'invoice_copy';

export interface DispatchRtdOrderRequest {
  courier_name: string;
  tracking_number: string;
  dispatch_date: string; // YYYY-MM-DD
  proof_type: RtdDispatchProofType;
  file_path: string;
}

export interface GetRtdOrdersParams {
  status?: RtdOrderStatus;
  per_page?: number;
  page?: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface GetRtdOrdersResponse {
  data: RtdOrder[];
  meta?: PaginationMeta;
}

// ============================================
// BRAND RTD TYPES
// ============================================

export interface GetRtdCatalogParams {
  category?: string;
  lead_time?: RtdLeadTime;
  delivery_geography?: string;
  min_price?: number;
  max_price?: number;
  min_moq?: number;
  max_moq?: number;
  has_branding?: 'yes' | 'no';
  sort_by?: 'base_price' | 'created_at' | 'visibility_score';
  sort_dir?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface GetRtdCatalogResponse {
  data: RtdProduct[];
  meta?: PaginationMeta;
}

export interface RequestRtdOrderPayload {
  product_id: number;
  quantity: number;
}

export interface ConfirmRtdPaymentPayload {
  order_id: number;
  transaction_id?: string;
}

/** Brand RTD order checkout — create Razorpay order (same shape as wallet for checkout UI). */
export interface CreateBrandRtdRazorpayOrderResponse {
  key_id: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  receipt: string;
  order: {
    id: number;
    total_amount: string;
  };
}

// ============================================
// RTD LISTING PACKS (Converter pay to list)
// ============================================

export interface RtdListingPackItem {
  slug: string;
  name: string;
  product_limit: number;
  validity_days: number;
  price: number;
  sort_order?: number;
}

export interface RtdEntitlementItem {
  id: number;
  pack_slug: string;
  product_limit: number;
  used_count: number;
  remaining_slots: number;
  validity_ends_at: string;
  purchased_at: string;
}

export interface PurchaseRtdPackPayload {
  pack_slug: string;
}
