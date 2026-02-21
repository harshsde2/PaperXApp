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
  category: string;
  product_name: string;
  image_path: string | null;
  size: string | null;
  material: string | null;
  gsm: string | null;
  finish: string | null;
  branding_method: string | null;
  lead_time: string | null;
  lead_time_label: string | null;
  moq: number;
  max_capacity?: number;
  base_price: string;
  buy_now_enabled: boolean;
  delivery_geography: string | null;
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
  material?: string;
  gsm?: string;
  finish?: string;
  branding_method?: string;
  lead_time: RtdLeadTime;
  moq: number;
  max_capacity?: number;
  base_price: number;
  buy_now_enabled?: boolean;
  delivery_geography?: string;
  price_slabs?: Omit<RtdPriceSlab, 'id'>[];
}

export interface UpdateRtdProductRequest {
  product_name?: string;
  image_path?: string | null;
  size?: string;
  material?: string;
  gsm?: string;
  finish?: string;
  branding_method?: string;
  lead_time?: RtdLeadTime;
  moq?: number;
  max_capacity?: number;
  base_price?: number;
  buy_now_enabled?: boolean;
  delivery_geography?: string;
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
}

export interface RtdOrderBrand {
  id: number;
  name: string;
  company_name?: string;
}

export interface RtdOrder {
  id: number;
  product_id: number;
  quantity: number;
  status: RtdOrderStatus;
  subtotal: string;
  commission_amount: string;
  gst_amount: string;
  total_amount: string;
  price_per_unit: string;
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
  payout?: RtdOrderPayout | null;
  created_at: string;
  updated_at: string;
}

export type RtdDispatchProofType = 'tracking_number' | 'lr_photo' | 'delivery_challan';

export interface DispatchRtdOrderRequest {
  proof_type: RtdDispatchProofType;
  tracking_number?: string;
  file?: any;
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
