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
export type BrandTimeline = 'Urgent 1-2 Days' | 'Normal 3-5 Days';

export interface PostBrandRequirementRequest {
  requirement_type: BrandRequirementType;
  packaging_type?: BrandPackagingType | null; // Only required when requirement_type is 'Packaging'
  quantity_range: string; // Required - e.g., "100-500", "500-1000", etc.
  timeline: BrandTimeline; // Required - delivery timeline
  description: string; // Required - special requirements or brief description
  location: string; // Required - full address
  city: string; // Required - city name
  latitude: number; // Required - GPS latitude
  longitude: number; // Required - GPS longitude
}

export interface PostBrandRequirementResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    brand_id: number;
    requirement_type: BrandRequirementType;
    packaging_type?: BrandPackagingType | null;
    quantity_range: string;
    timeline: BrandTimeline;
    description: string;
    location: string;
    city: string;
    latitude: string;
    longitude: string;
    status: string;
    created_at: string;
    updated_at: string;
    matched_converters_count?: number;
  };
}
