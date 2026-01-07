/**
 * Authentication API Types
 * All TypeScript types, interfaces, and enums for authentication API
 */

export interface SendOTPRequest {
  mobile: string;
}

export interface SendOTPResponse {
  otp_sent?: boolean;
  expires_in?: number;
  retry_after?: number;
  message?: string;
  success?: boolean;
}

export interface VerifyOTPRequest {
  mobile: string;
  otp: string;
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

