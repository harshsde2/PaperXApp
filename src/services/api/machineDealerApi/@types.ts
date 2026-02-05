/**
 * Machine Dealer API Types
 * Types for machine dealer operations
 */

import { PaginationMeta } from '../types';
import type { MachineCategoryType } from '../../../features/posting/constants/machineConstants';

// ============================================
// COMMON TYPES
// ============================================

export type MachineCondition =
  | 'brand_new'
  | 'like_new'
  | 'working_condition'
  | 'needs_repair'
  | 'for_parts';

export type MachineIntent = 'sell' | 'buy';
export type UrgencyType = 'normal' | 'urgent';
export type ListingStatus = 'active' | 'pending' | 'sold' | 'expired' | 'cancelled';

// ============================================
// COMPLETE PROFILE
// ============================================

export interface CompleteMachineDealerProfileRequest {
  company_name: string;
  gst?: string | null;
  contact_person_name: string;
  mobile?: string | null;
  email?: string | null;
  city: string;
  location: string;
  latitude: number;
  longitude: number;
  primary_machine_category?: MachineCategoryType | null;
  primary_machine_id?: number | null;
  preferred_brand_names?: string[] | null;
}

export interface CompleteMachineDealerProfileResponse {
  success: boolean;
  message?: string;
  machine_dealer: {
    id: number;
    user_id: number;
    company_name: string;
    profile_complete: boolean;
    verification_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
  };
}

// ============================================
// DASHBOARD
// ============================================

export interface MachineDealerDashboardStats {
  total_listings: number;
  active_listings: number;
  pending_listings: number;
  sold_machines: number;
  total_inquiries: number;
  unread_messages: number;
}

export interface MachineDealerDashboardResponse {
  stats: MachineDealerDashboardStats;
  recent_listings?: MachineListingItem[];
  recent_inquiries?: MachineRequirementItem[];
}

// ============================================
// POST MACHINE
// ============================================

export interface PostMachineRequest {
  machine_id: number;
  machine_brand_id?: number;
  machine_type: string;
  condition: MachineCondition | string;
  intent: MachineIntent;
  urgency: UrgencyType;
  description?: string;
  price?: number;
  currency?: string;
  location: string;
  latitude: number;
  longitude: number;
  images?: string[];
  specifications?: Record<string, any>;
  year_of_manufacture?: number;
  serial_number?: string;
}

export interface PostMachineResponse {
  success: boolean;
  message?: string;
  listing: MachineListingItem;
}

// ============================================
// LISTINGS
// ============================================

export interface MachineListingItem {
  id: number;
  machine_id: number;
  machine_name: string;
  machine_type: string;
  machine_brand?: string;
  condition: MachineCondition | string;
  intent: MachineIntent;
  urgency: UrgencyType;
  status: ListingStatus;
  description?: string;
  price?: number;
  currency?: string;
  location: string;
  latitude: number;
  longitude: number;
  images?: string[];
  specifications?: Record<string, any>;
  year_of_manufacture?: number;
  views_count?: number;
  inquiries_count?: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface GetListingsParams {
  intent?: MachineIntent;
  status?: ListingStatus;
  urgency?: UrgencyType;
  page?: number;
  per_page?: number;
}

export interface GetListingsResponse {
  listings: MachineListingItem[];
  pagination?: PaginationMeta;
}

// ============================================
// REQUIREMENTS
// ============================================

export interface MachineRequirementItem {
  id: number;
  machine_type: string;
  machine_name?: string;
  condition_preference?: MachineCondition | string;
  intent: MachineIntent;
  urgency: UrgencyType;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  location?: string;
  description?: string;
  requester: {
    id: number;
    name: string;
    company_name?: string;
    verified: boolean;
  };
  created_at: string;
  expires_at?: string;
}

export interface GetRequirementsParams {
  intent?: MachineIntent;
  urgency?: UrgencyType;
  machine_type?: string;
  page?: number;
  per_page?: number;
}

export interface GetRequirementsResponse {
  requirements: MachineRequirementItem[];
  pagination?: PaginationMeta;
}

