/**
 * Converter API Types
 * Types for converter operations
 */

import { PaginationMeta } from '../types';

// ============================================
// COMPLETE PROFILE
// ============================================

export interface CompleteConverterProfileRequest {
  converter_type_ids: number[];
  converter_type_custom?: string;
  finished_product_ids: number[];
  machine_ids: number[];
  scrap_type_ids?: number[];
  raw_material_ids: number[];
  capacity_daily?: number;
  capacity_monthly?: number;
  capacity_unit?: string;
  factory_address: string;
  factory_city: string;
  factory_state: string;
  factory_latitude: number;
  factory_longitude: number;
}

export interface CompleteConverterProfileResponse {
  success: boolean;
  message?: string;
  converter: {
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

export interface ConverterDashboardStats {
  total_orders: number;
  active_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_inquiries: number;
  raw_material_requests: number;
  scrap_sales: number;
  unread_notifications: number;
}

export interface ConverterDashboardResponse {
  stats: ConverterDashboardStats;
  recent_orders?: ConverterOrderItem[];
  material_requests?: MaterialRequestItem[];
}

// ============================================
// ORDERS
// ============================================

export type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface ConverterOrderItem {
  id: number;
  title: string;
  product_name: string;
  quantity: number;
  quantity_unit: string;
  status: OrderStatus;
  requester_name?: string;
  requester_company?: string;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// MATERIAL REQUESTS
// ============================================

export interface MaterialRequestItem {
  id: number;
  material_name: string;
  material_id: number;
  quantity: number;
  quantity_unit: string;
  urgency: 'normal' | 'urgent';
  status: 'open' | 'fulfilled' | 'cancelled';
  created_at: string;
  expires_at?: string;
}

// ============================================
// CONVERTER TYPES (Reference Data)
// ============================================

export interface ConverterType {
  id: number;
  name: string;
  description?: string;
}

export interface FinishedProduct {
  id: number;
  name: string;
  category?: string;
  description?: string;
}

export interface ScrapType {
  id: number;
  name: string;
  description?: string;
}

