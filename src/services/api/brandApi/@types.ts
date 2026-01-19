/**
 * Brand API Types
 * Types for brand/corporate operations
 */

import { PaginationMeta } from '../types';

// ============================================
// COMPLETE PROFILE
// ============================================

export interface CompleteBrandProfileRequest {
  company_name: string;
  brand_name: string;
  contact_person_name: string;
  mobile: string;
  email?: string;
  gst?: string;
  city: string;
  location: string;
  latitude: number;
  longitude: number;
  brand_type_ids: number[];
}

export interface CompleteBrandProfileResponse {
  success: boolean;
  message?: string;
  brand: {
    id: number;
    user_id: number;
    company_name: string;
    brand_name: string;
    profile_complete: boolean;
    verification_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
  };
}

// ============================================
// DASHBOARD
// ============================================

export interface BrandDashboardStats {
  total_requirements: number;
  active_requirements: number;
  pending_responses: number;
  completed_orders: number;
  active_sessions: number;
  total_suppliers: number;
  unread_notifications: number;
}

export interface BrandDashboardResponse {
  stats: BrandDashboardStats;
  recent_requirements?: BrandRequirementItem[];
  active_sessions?: BrandSessionItem[];
}

// ============================================
// REQUIREMENTS
// ============================================

export type RequirementStatus = 'draft' | 'active' | 'in_progress' | 'fulfilled' | 'cancelled';

export interface BrandRequirementItem {
  id: number;
  title: string;
  product_type: string;
  quantity: number;
  quantity_unit: string;
  urgency: 'normal' | 'urgent';
  status: RequirementStatus;
  responses_count: number;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  created_at: string;
  expires_at?: string;
}

// ============================================
// SESSIONS
// ============================================

export type BrandSessionStatus = 'active' | 'negotiating' | 'completed' | 'cancelled';

export interface BrandSessionItem {
  id: number;
  requirement_id: number;
  supplier_name: string;
  supplier_company?: string;
  status: BrandSessionStatus;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
}

// ============================================
// BRAND TYPES (Reference Data)
// ============================================

export interface BrandType {
  id: number;
  name: string;
  description?: string;
}

// ============================================
// POST REQUIREMENT
// ============================================

export type BrandRequirementType = 'Packaging' | 'Printing' | 'Labels' | 'Other';
export type BrandPackagingType = 'Boxes' | 'Bags' | 'Pouches' | 'Cartons' | 'Containers' | 'Other';
export type BrandTimeline = '1-2 Days' | '3-5 Days' | '1 Week' | '2 Weeks' | '1 Month' | 'Flexible';
export type BrandUrgency = 'normal' | 'urgent';

export interface PostBrandRequirementRequest {
  requirement_type: BrandRequirementType;
  packaging_type?: BrandPackagingType;
  quantity_range: string;
  timeline: BrandTimeline;
  special_needs?: string;
  design_attachments?: string[];
  title: string;
  description: string;
  urgency: BrandUrgency;
  location: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface PostBrandRequirementResponse {
  success: boolean;
  message: string;
  data: {
    inquiry_id: number;
    session_id: number;
    matched_converters_count: number;
    message: string;
  };
}