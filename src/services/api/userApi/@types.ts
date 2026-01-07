/**
 * User API Types
 * All TypeScript types, interfaces, and enums for user API
 */

// ============================================
// USER PROFILE
// ============================================

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  company_name?: string;
  gst_in?: string;
  state?: string;
  city?: string;
  primary_role?: string;
  secondary_role?: string;
  operation_area?: 'local' | 'state' | 'panIndia';
  has_secondary_role?: number;
  udyam_certificate?: string;
  udyam_certificate_name?: string;
  udyam_certificate_type?: string;
}

export interface UpdateProfileResponse {
  id: number;
  name: string | null;
  mobile: string;
  email: string | null;
  email_verified_at: string | null;
  primary_role: string | null;
  has_secondary_role: number;
  secondary_role: string | null;
  operation_area: string | null;
  company_name: string | null;
  gst_in: string | null;
  state: string | null;
  city: string | null;
  udyam_certificate: string | null;
  udyam_verified_at: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadUdyamRequest {
  file: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface UploadUdyamResponse {
  udyam_certificate: string;
  udyam_verified_at: string | null;
  message?: string;
}

// ============================================
// SWITCH ROLE
// ============================================

export type UserRole = 'dealer' | 'converter' | 'brand' | 'machine_dealer' | 'mill' | 'scrap_dealer';

export interface SwitchRoleRequest {
  role: UserRole;
}

export interface SwitchRoleResponse {
  success: boolean;
  message?: string;
  current_role: UserRole;
  user: {
    id: number;
    name: string | null;
    mobile: string;
    email: string | null;
    primary_role: string;
    secondary_role: string | null;
    roles: string[];
  };
}
