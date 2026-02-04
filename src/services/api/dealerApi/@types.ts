/**
 * Dealer API Types
 * All TypeScript types, interfaces, and enums for dealer API
 */

import { PaginationMeta } from '../types';

// ============================================
// COMMON TYPES
// ============================================

export type AgentType = 'AUTHORIZED_AGENT' | 'INDEPENDENT_DEALER';
export type UrgencyType = 'normal' | 'urgent';
export type OpportunityStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type SessionStatus = 'active' | 'completed' | 'cancelled' | 'expired';
export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface Location {
  type: 'factory' | 'warehouse' | 'office';
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  pincode?: string;
}

export interface ThicknessRange {
  unit: 'GSM' | 'MM' | 'MICRON';
  min: number;
  max: number;
}

// ============================================
// DEALER REGISTRATION (Legacy - keeping for backward compatibility)
// ============================================

export interface DealerMaterialsRequest {
  materials: string[];
  material_details?: Array<{
    material_id: string;
    category: string;
    name: string;
  }>;
}

export interface DealerMaterialsResponse {
  materials: string[];
  message?: string;
}

export interface DealerMillBrandRequest {
  mill_brand_name?: string;
  prefer_not_to_disclose?: boolean;
  relationship: 'authorized-agent' | 'independent-dealer';
  material_id?: string;
}

export interface DealerMillBrandResponse {
  mill_brand_name?: string | null;
  relationship: string;
  message?: string;
}

export interface DealerMaterialSpecsRequest {
  finishes?: string[];
  coatings?: string[];
  surfaces?: string[];
  print_compatibility?: string[];
  custom_specs?: string[];
}

export interface DealerMaterialSpecsResponse {
  specs: {
    finishes?: string[];
    coatings?: string[];
    surfaces?: string[];
    print_compatibility?: string[];
    custom_specs?: string[];
  };
  message?: string;
}

export interface DealerThicknessRequest {
  unit: 'GSM' | 'MM' | 'MICRON';
  min_value: number;
  max_value: number;
  material_id?: string;
}

export interface DealerThicknessResponse {
  unit: string;
  min_value: number;
  max_value: number;
  message?: string;
}

export interface WarehouseLocation {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
  latitude: number;
  longitude: number;
  is_primary: boolean;
}

export interface DealerWarehousesRequest {
  no_warehouse?: boolean;
  warehouses: WarehouseLocation[];
}

export interface DealerWarehousesResponse {
  warehouses: WarehouseLocation[];
  no_warehouse: boolean;
  message?: string;
}

export interface CompleteDealerRegistrationRequest {
  materials?: DealerMaterialsRequest;
  mill_brand_details?: DealerMillBrandRequest[];
  material_specs?: DealerMaterialSpecsRequest;
  thickness?: DealerThicknessRequest;
  warehouses?: DealerWarehousesRequest;
}

export interface CompleteDealerRegistrationResponse {
  registration_complete: boolean;
  verification_status: 'pending' | 'approved' | 'rejected';
  message?: string;
}

// ============================================
// COMPLETE DEALER PROFILE (Postman API Format)
// ============================================

export interface DealerMaterial {
  material_id: number;
  brand_id: number;
  agent_type: AgentType;
  finish_ids: number[];
  thickness_ranges: ThicknessRange[];
}

export interface CompleteDealerProfileRequest {
  materials: DealerMaterial[];
  machines_available?: number[];
  capacity_daily?: number;
  capacity_monthly?: number;
  capacity_unit?: string;
  has_warehouse?: boolean;
  locations: Location[];
}

export interface CompleteDealerProfileResponse {
  success: boolean;
  message?: string;
  dealer: {
    id: number;
    user_id: number;
    profile_complete: boolean;
    verification_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
  };
}

// ============================================
// DASHBOARD
// ============================================

export interface DealerDashboardStats {
  total_opportunities: number;
  active_opportunities: number;
  pending_opportunities: number;
  completed_deals: number;
  active_sessions: number;
  unread_notifications: number;
  total_revenue?: number;
  this_month_revenue?: number;
}

export interface DealerDashboardResponse {
  stats: DealerDashboardStats;
  recent_opportunities?: OpportunityListItem[];
  active_sessions?: SessionListItem[];
}

// ============================================
// OPPORTUNITIES
// ============================================

export interface OpportunityListItem {
  id: number;
  title: string;
  description?: string;
  material_name: string;
  material_id: number;
  quantity: number;
  quantity_unit: string;
  urgency: UrgencyType;
  status: OpportunityStatus;
  requester_name?: string;
  requester_company?: string;
  location?: string;
  distance_km?: number;
  created_at: string;
  expires_at?: string;
}

export interface GetOpportunitiesParams {
  urgency?: UrgencyType;
  status?: OpportunityStatus;
  page?: number;
  per_page?: number;
}

export interface GetOpportunitiesResponse {
  opportunities: OpportunityListItem[];
  pagination?: PaginationMeta;
}

export interface OpportunityDetail extends OpportunityListItem {
  specifications?: Record<string, any>;
  required_finish_ids?: number[];
  required_thickness?: ThicknessRange;
  delivery_address?: Location;
  delivery_deadline?: string;
  budget_min?: number;
  budget_max?: number;
  additional_notes?: string;
  requester: {
    id: number;
    name: string;
    company_name?: string;
    rating?: number;
    verified: boolean;
  };
}

export interface GetOpportunityDetailResponse {
  opportunity: OpportunityDetail;
}

export interface AcceptOpportunityResponse {
  success: boolean;
  message?: string;
  session_id?: number;
}

export interface DeclineOpportunityRequest {
  reason?: string;
}

export interface DeclineOpportunityResponse {
  success: boolean;
  message?: string;
}

// ============================================
// SESSIONS
// ============================================

export interface SessionListItem {
  id: number;
  opportunity_id: number;
  title: string;
  status: SessionStatus;
  counterparty_name: string;
  counterparty_company?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface SessionDetail extends SessionListItem {
  opportunity: OpportunityDetail;
  quotes: Quote[];
  messages_count: number;
  counterparty: {
    id: number;
    name: string;
    company_name?: string;
    mobile?: string;
    email?: string;
    rating?: number;
    verified: boolean;
  };
}

export interface GetSessionDetailResponse {
  session: SessionDetail;
}

export interface GetSessionHistoryParams {
  status?: SessionStatus;
  page?: number;
  per_page?: number;
}

export interface GetSessionHistoryResponse {
  sessions: SessionListItem[];
  pagination?: PaginationMeta;
}

// ============================================
// CHAT
// ============================================

export interface ChatMessage {
  id: number;
  session_id: number;
  sender_id: number;
  sender_name: string;
  message: string;
  type: 'text' | 'image' | 'document' | 'quote';
  attachments?: string[];
  quote_id?: number;
  is_read: boolean;
  created_at: string;
}

export interface GetChatMessagesParams {
  page?: number;
  per_page?: number;
}

export interface GetChatMessagesResponse {
  messages: ChatMessage[];
  pagination?: PaginationMeta;
}

export interface SendChatMessageRequest {
  message: string;
  type?: 'text' | 'image' | 'document';
  attachments?: string[];
}

export interface SendChatMessageResponse {
  success: boolean;
  message: ChatMessage;
}

// ============================================
// QUOTATION
// ============================================

export interface Quote {
  id: number;
  session_id: number;
  quoted_price: number;
  currency: string;
  delivery_days: number;
  notes?: string;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
}

export interface SubmitQuoteRequest {
  quoted_price: number;
  currency?: string;
  delivery_days: number;
  notes?: string;
}

export interface SubmitQuoteResponse {
  success: boolean;
  message?: string;
  quote: Quote;
}

// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationType =
  | 'opportunity'
  | 'session'
  | 'quote'
  | 'message'
  | 'system'
  | 'payment';

export interface DealerNotification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface GetNotificationsParams {
  unread_only?: boolean;
  type?: NotificationType;
  page?: number;
  per_page?: number;
}

export interface GetNotificationsResponse {
  notifications: DealerNotification[];
  unread_count: number;
  pagination?: PaginationMeta;
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message?: string;
}

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  message?: string;
  marked_count: number;
}

// ============================================
// POST REQUIREMENT
// ============================================

export type InquiryType = 'material' | 'machine' | 'job';
export type IntentType = 'buy' | 'sell';
export type ThicknessUnit = 'GSM' | 'MM' | 'OUNCE' | 'BF' | 'MICRON';
export type QuantityUnit = 'kg' | 'tons' | 'sheets' | 'reams' | 'rolls' | 'pieces';
export type PriceUnit = 'per_sheet' | 'per_kg' | 'per_ton' | 'per_ream' | 'per_roll' | 'per_piece';
export type SizeUnit = 'inches' | 'cm' | 'mm';
export type LocationSource = 'saved' | 'manual';
export type VisibilityType = 'dealers' | 'converters' | 'manufacturers' | 'all';

export interface PostRequirementRequest {
  inquiry_type: InquiryType;
  intent: IntentType;
  material_id: number; // Single material selection (required)
  thickness: number; // Required
  thickness_unit: ThicknessUnit; // Required
  size: string; // Required - format "WxH" (e.g., "28x40")
  size_unit: SizeUnit; // Required
  finish_ids?: number[] | null; // Selected grade/finish/variant IDs (optional)
  quantity: number;
  quantity_unit: QuantityUnit;
  urgency: UrgencyType;
  visibility: VisibilityType; // Who can see the requirement (required)
  // Location fields
  location_id?: number | null; // ID of saved location (if selected from saved locations)
  location_source: LocationSource; // Whether location is from saved or manual
  location: string;
  latitude: number;
  longitude: number;
}

export interface PostRequirementMaterial {
  id: number;
  name: string;
  category: string;
  created_at: string | null;
  updated_at: string | null;
  pivot: {
    inquiry_id: number;
    material_id: number;
  };
}

export interface PostRequirementFinish {
  id: number;
  name: string;
  type: string;
  pivot?: {
    inquiry_id: number;
    finish_id: number;
  };
}

export interface PostRequirementResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    poster_id: number;
    poster_type: string;
    inquiry_type: InquiryType;
    intent: IntentType;
    urgency: UrgencyType;
    visibility: VisibilityType;
    quantity: string;
    quantity_unit: QuantityUnit;
    size: string;
    size_unit: SizeUnit;
    thickness: number;
    thickness_unit: ThicknessUnit;
    material_id: number;
    finish_ids?: number[] | null;
    // Location fields
    location_id?: number | null;
    location_source?: LocationSource;
    location: string;
    latitude: string;
    longitude: string;
    specs?: any;
    attachment_paths?: string[] | null;
    status: string;
    posting_fee_paid: boolean;
    posting_fee_amount?: number | null;
    updated_at: string;
    created_at: string;
    material?: PostRequirementMaterial; // Single material
    finishes?: PostRequirementFinish[];
    machines: any[];
  };
}

// ============================================
// GET REQUIREMENTS
// ============================================

export interface RequirementMaterial {
  id: number;
  name: string;
}

export interface RequirementListItem {
  id: number;
  inquiry_type: InquiryType;
  intent: IntentType;
  title: string;
  description: string;
  status: string;
  urgency: UrgencyType;
  quantity: string;
  quantity_unit: QuantityUnit;
  size?: string;
  price?: string;
  price_unit?: PriceUnit;
  price_negotiable: boolean;
  thickness?: string;
  thickness_unit?: ThicknessUnit;
  machine_condition?: string | null;
  job_type?: string | null;
  timeline_days?: number | null;
  location: string;
  latitude: string;
  longitude: string;
  materials: RequirementMaterial[];
  machines: any[];
  responses_count: number;
  /** Session id for this requirement; use for GET /sessions/{id}. Do not use requirement id (inquiry id) as session id. */
  session_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface GetRequirementsParams {
  inquiry_type?: InquiryType;
  intent?: IntentType;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface GetRequirementsResponse {
  requirements: RequirementListItem[];
  pagination?: PaginationMeta;
}
