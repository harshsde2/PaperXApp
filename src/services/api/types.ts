/**
 * API Request/Response Type Definitions
 * All API-related types consolidated here per .cursorrules
 */

/**
 * Base API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    request_id: string;
    version: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
      code: string;
    }>;
    request_id?: string;
    timestamp: string;
  };
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

// Common request types
export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// Auth request/response types
export interface SendOTPRequest {
  mobile: string;
  purpose: 'login' | 'signup';
}

export interface SendOTPResponse {
  otp_sent: boolean;
  expires_in: number;
  retry_after: number;
}

export interface VerifyOTPRequest {
  mobile: string;
  otp: string;
  purpose: 'login' | 'signup';
}

export interface VerifyOTPResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    user_id: string;
    email?: string;
    mobile: string;
    roles: string[];
    primary_role: string;
    secondary_role?: string;
    verified: boolean;
  };
}

// User types
export interface UserProfile {
  user_id: string;
  company_name?: string;
  email?: string;
  mobile: string;
  roles: string[];
  primary_role: string;
  secondary_role?: string;
  verified: boolean;
  gstin?: string;
  location?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

// Common error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

