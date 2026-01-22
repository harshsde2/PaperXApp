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
  countdown: SessionCountdown | null;
  responses_received: number;
  matched_dealers_count: number;
  matching_progress: MatchingProgress | null;
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

export interface SessionDetail {
  id: number;
  project_id: string;
  status: SessionStatus;
  inquiry: {
    id: number;
    title: string;
    items: SessionItem[];
  };
  selected_partners_count: number;
  selected_partners: SelectedPartner[];
  chat_enabled: boolean;
  chat_thread_id: number | null;
  locked_at: string | null;
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
  };
  selected_partners_count: number;
  selected_partners: SelectedPartner[];
  chat_enabled: boolean;
  chat_thread_id: number | null;
  locked_at: string | null;
}

// ============================================
// LOCK SESSION
// ============================================

export interface LockSessionRequest {
  selected_dealer_ids: number[];
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
