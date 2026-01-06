/**
 * API Services Barrel Export
 * Central export point for all API-related functionality
 */

// API Client
export { api, default as apiClient } from './client';

// Query Client
export { queryClient, queryKeys } from './queryClient';

// API Types
export type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  PaginatedResponse,
  PaginationParams,
  FilterParams,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  UserProfile,
} from './types';
export { ERROR_CODES } from './types';

// API Services (export individual services as they're created)
export * from './authApi';
export * from './userApi';

// Export types
export type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadUdyamRequest,
  UploadUdyamResponse,
} from './userApi';

