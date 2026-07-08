/**
 * Session API Types
 * All TypeScript types, interfaces, and enums for session API
 * Unified for all roles (Brand, Converter, Dealer)
 */

import { PaginationMeta } from '../types';

// ============================================
// COMMON TYPES
// ============================================

export type SessionStatus =
  | 'MATCHING'
  | 'RESPONSES_RECEIVED'
  | 'LOCKED'
  | 'CHAT_ACTIVE'
  | 'DEAL_SUCCESS'
  | 'DEAL_FAILED'
  | 'EXPIRED'
  | 'REPUBLISHED';

export type SessionStatusLabel = 'FINDING' | 'ACTIVE' | 'LOCKED' | 'COMPLETED' | 'FAILED' | 'EXPIRED';

export type SessionFilter = 'all' | 'finding_matches' | 'active' | 'locked';

export type HistoryFilter = 'all' | 'completed' | 'expired';

// ============================================
// SESSION ITEM
// ============================================

export interface SessionItem {
  material_category: string;
  quantity: number;
  quantity_unit: string;
}

// ============================================
// COUNTDOWN
// ============================================

export interface SessionCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

// ============================================
// MATCHING PROGRESS
// ============================================

export interface MatchingProgress {
  matched: number;
  total: number;
  status: string;
}

// ============================================
// ACTIVE SESSION LIST ITEM
// ============================================

export interface ActiveSessionListItem {
  id: number;
  inquiry_id: number;
  title: string;
  status: SessionStatus;
  status_label: SessionStatusLabel;
  urgency: string;
  created_at: string;
  items: SessionItem[];
  /**
   * Optional brand-specific requirement summary when poster_type === 'brand'.
   * Present only for brand → converter flows.
   */
  brand_requirement?: {
    requirement_type: string | null;
    packaging_type: string | null;
    quantity_range: string | null;
    timeline: string | null;
    description: string | null;
    special_needs: string | null;
  } | null;
  countdown: SessionCountdown | null;
  responses_received: number;
  matched_dealers_count: number;
  matching_progress: MatchingProgress | null;
  /** True when the current user posted this inquiry (poster view). */
  is_owner?: boolean;
  /** For receivers: label like "A dealer" / "A converter". */
  poster_label?: string;
  /** Post intent: 'buy' | 'sell' for card badge. */
  intent?: 'buy' | 'sell';
  /** Present for converter jobwork sessions. */
  inquiry_type?: 'jobwork_find' | 'jobwork_give' | string;
  /** Present for converter jobwork sessions: 'find' | 'give'. */
  jobwork_mode?: 'find' | 'give';
  /** Present for converter jobwork sessions (jobwork type name). */
  jobwork_type?: string;
}

// ============================================
// GET ACTIVE SESSIONS
// ============================================

export interface GetActiveSessionsParams {
  filter?: SessionFilter;
  page?: number;
  per_page?: number;
}

export interface GetActiveSessionsResponse {
  data: ActiveSessionListItem[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from?: number;
  to?: number;
  path?: string;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

// ============================================
// HISTORY SESSION LIST ITEM
// ============================================

export interface HistorySessionListItem {
  id: number;
  inquiry_id: number;
  title: string;
  status: SessionStatus;
  status_label: SessionStatusLabel;
  partners_matched: number;
  quantity: number;
  quantity_unit: string;
  created_at: string;
  can_republish: boolean;
}

// ============================================
// HISTORY GROUPED BY MONTH
// ============================================

export interface HistoryMonthGroup {
  month: string;
  sessions: HistorySessionListItem[];
}

// ============================================
// GET SESSION HISTORY
// ============================================

export interface GetSessionHistoryParams {
  filter?: HistoryFilter;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface GetSessionHistoryResponse {
  sessions: HistoryMonthGroup[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

// ============================================
// SELECTED PARTNER
// ============================================

export interface SelectedPartner {
  id: number;
  company_name: string;
  location: string;
}

// ============================================
// SESSION DETAIL
// ============================================

export interface MyResponderStatus {
  expressed_interest: boolean;
  shortlisted: boolean;
  declined: boolean;
}

export interface SessionDetail {
  id: number;
  project_id: string;
  status: SessionStatus;
  inquiry: {
    id: number;
    title: string;
    items: SessionItem[];
    intent?: string;
  };
  selected_partners_count: number;
  selected_partners: SelectedPartner[];
  chat_enabled: boolean;
  chat_thread_id: number | null;
  created_at?: string | null;
  expires_at: string | null;
  locked_at: string | null;
  is_owner?: boolean;
  poster_label?: string;
  intent?: string;
  my_responder_status?: MyResponderStatus | null;
}

// ============================================
// POSTER DETAIL (owner only)
// ============================================

export interface PosterDetailRequirementSummary {
  title: string;
  material: string | null;
  quantity: number | string | null;
  quantity_unit: string | null;
  urgency: string;
  items: Array<{
    material_category: string | null;
    quantity: number | string | null;
    quantity_unit: string | null;
  }>;
}

/** Normalized jobwork details returned for converter jobwork inquiries (jobwork_find / jobwork_give). */
export interface JobworkDetails {
  mode: 'find' | 'give';
  jobwork_type?: string | null;
  quantity?: number | string | null;
  quantity_unit?: string | null;
  timeline?: string | null;
  location?: string | null;
  /** Find: machinery, city, sample, special_instructions */
  machinery_available?: string | null;
  city?: string | null;
  sample_available?: boolean;
  special_instructions?: string | null;
  /** Give: raw_materials, size, thickness, grade_finish, quality, other */
  raw_materials?: string | null;
  size?: string | null;
  size_unit?: string | null;
  thickness?: string | null;
  thickness_unit?: string | null;
  grade_finish?: string | null;
  quality_requirements?: string | null;
  other_instructions?: string | null;
}

export interface PosterDetailResponse {
  poster_type: string;
  intent: 'buy' | 'sell';
  title: string;
  requirement_summary: PosterDetailRequirementSummary;
  created_at: string | null;
  reached_count: number;
  matches_count: number;
  responses_count: number;
  /** Present for jobwork inquiries: 'jobwork_find' | 'jobwork_give'. */
  inquiry_type?: 'jobwork_find' | 'jobwork_give' | string;
  /** Present for converter jobwork inquiries. */
  jobwork_mode?: 'find' | 'give';
  /** Present for converter jobwork inquiries. */
  jobwork?: JobworkDetails;
  sample_available?: boolean;
  sample_image_url?: string | null;
}

// ============================================
// RESPONDER DETAIL (non-owner only)
// ============================================

export interface ResponderDetailMyStatus {
  expressed_interest: boolean;
  shortlisted: boolean;
  declined: boolean;
}

export interface ResponderDetailResponse {
  inquiry_id: number;
  intent: 'buy' | 'sell';
  poster_label: string;
  title: string;
  requirement_summary: PosterDetailRequirementSummary;
  created_at: string | null;
  expires_at: string | null;
  my_responder_status: ResponderDetailMyStatus;
  /** Present for jobwork inquiries: 'jobwork_find' | 'jobwork_give'. */
  inquiry_type?: 'jobwork_find' | 'jobwork_give' | string;
  /** Present for converter jobwork inquiries. */
  jobwork_mode?: 'find' | 'give';
  /** Present for converter jobwork inquiries. */
  jobwork?: JobworkDetails;
  sample_available?: boolean;
  sample_image_url?: string | null;
}

// ============================================
// CHAT LIST (Messages tab)
// ============================================

export interface ChatListItem {
  session_id: number;
  inquiry_id: number;
  partner_id?: number | null;
  partner_name: string;
  partner_company: string;
  last_message: string;
  last_message_at: string | null;
  unread_count: number;
}

export type GetChatListResponse = ChatListItem[];

// ============================================
// STRUCTURED CHAT (THREAD-NATIVE)
// ============================================

export interface ChatThreadParticipant {
  id: number;
  name: string;
  company_name?: string | null;
  primary_role?: string | null;
}

export interface ChatThreadListItem {
  id: number;
  thread_id?: number;
  inquiry_id: number;
  inquiry_title?: string;
  poster_user_id: number;
  responder_user_id: number;
  responder_role: string | null;
  /** Anonymous display label, e.g. "Responder 1" — real names are hidden from posters. */
  responder_label?: string;
  last_message_id: number | null;
  last_message_at: string | null;
  last_message_preview?: string | null;
  unread_count?: number;
  responder_user?: ChatThreadParticipant;
  poster_user?: ChatThreadParticipant;
}

export type GetInquiryChatThreadsResponse = ChatThreadListItem[];
export type GetAllChatThreadsResponse = ChatThreadListItem[];

export interface OpenChatThreadResponse {
  thread_id: number;
  id?: number;
  thread?: {
    id?: number;
    thread_id?: number;
  };
}

export interface ThreadMessage {
  id: number;
  thread_id: number;
  sender_user_id: number;
  sender_role: string | null;
  body: string;
  attachment: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface ThreadMessagesResponse {
  data: ThreadMessage[];
  meta: {
    next_cursor: number | null;
    limit: number;
  };
}

export interface GetThreadMessagesParams {
  limit?: number;
  cursor?: number | null;
}

export interface SendThreadMessagePayload {
  body: string;
  attachment?: string | null;
}

// ============================================
// GET SESSION DETAIL
// ============================================

export interface GetSessionDetailResponse {
  id: number;
  project_id: string;
  status: SessionStatus;
  inquiry: {
    id: number;
    title: string;
    items: SessionItem[];
    intent?: string;
  };
  selected_partners_count: number;
  selected_partners: SelectedPartner[];
  chat_enabled: boolean;
  chat_thread_id: number | null;
  created_at?: string | null;
  expires_at: string | null;
  locked_at: string | null;
  is_owner?: boolean;
  poster_label?: string;
  intent?: string;
  my_responder_status?: MyResponderStatus | null;
}

// ============================================
// LOCK SESSION
// ============================================

export interface LockSessionRequest {
  selected_dealer_ids?: number[];
  selected_converter_ids?: number[];
}

export interface LockSessionResponse {
  success: boolean;
  message: string;
  data: SessionDetail;
}

// ============================================
// REPUBLISH SESSION
// ============================================

export interface RepublishSessionResponse {
  success: boolean;
  message: string;
  data: {
    inquiry_id: number;
    republish_count: number;
    status: SessionStatus;
  };
}

// ============================================
// MARK DEAL AS FAILED
// ============================================

export interface MarkDealFailedResponse {
  success: boolean;
  message: string;
  data: SessionDetail;
}

// ============================================
// MATCHMAKING RESPONSE
// ============================================

export interface MatchmakingResponseDealer {
  id: number | null;
  company_name: string | null;
  location: string;
}

export interface MatchmakingResponseItem {
  id: number;
  match_type: 'exact_match' | 'slight_variation' | 'nearest';
  distance_km: number | null;
  dealer: MatchmakingResponseDealer;
  quantity_offered: number;
  quoted_price: number | null;
  price_status: 'agreed' | 'negotiable' | 'needs_more_details' | null;
  additional_details: string | null;
  responded_at: string;
  is_shortlisted: boolean;
  /** Whether the dealer has actually submitted a response */
  has_responded?: boolean;
  /** Match score from matchmaking algorithm (0-100) */
  match_score?: number;
}

export interface MatchmakingResponsesCountdown {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface GetMatchmakingResponsesResponse {
  inquiry: {
    id: number;
    title: string;
    items: SessionItem[];
  };
  countdown: MatchmakingResponsesCountdown | null;
  responses_count: number;
  responses: MatchmakingResponseItem[];
  filter: 'all' | 'responded' | 'exact_match' | 'slight_variation' | 'nearest';
}

export interface GetMatchmakingResponsesParams {
  filter?: 'all' | 'responded' | 'exact_match' | 'slight_variation' | 'nearest';
}
