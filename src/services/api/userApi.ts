/**
 * User API Service
 * Handles user profile operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import { USER_ENDPOINTS, REGISTRATION_ENDPOINTS } from '@shared/constants/api';
import type { ApiResponse } from './types';
import { storageService } from '@services/storage/storageService';
import { queryKeys } from './queryClient';
import { useAppDispatch } from '@store/hooks';
import { updateUser } from '@store/slices/authSlice';

/**
 * Update User Profile Request
 */
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
  udyam_certificate?: string; // Base64 string
  udyam_certificate_name?: string;
  udyam_certificate_type?: string;
}

/**
 * Update User Profile Response
 */
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

/**
 * Get User Profile Query
 */
export const useGetProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async (): Promise<UpdateProfileResponse> => {
      const response = await api.get<UpdateProfileResponse>(USER_ENDPOINTS.PROFILE);
      const responseData = response.data as any;
      
      // Handle wrapped response
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }
      
      return responseData;
    },
  });
};

/**
 * Update User Profile Mutation
 */
export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
      const response = await api.post<UpdateProfileResponse>(USER_ENDPOINTS.UPDATE_PROFILE, data);
      const responseData = response.data as any;
      
      // Handle wrapped response
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }
      
      return responseData;
    },
    onSuccess: (data) => {
      console.log('[Update Profile Success] Full response:', JSON.stringify(data, null, 2));

      // NOTE: Do NOT update Redux state or storage here
      // State will be updated only when user clicks "Proceed to Dashboard" in VerificationStatusScreen
      // This prevents automatic navigation to dashboard before user sees verification status

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error: Error) => {
      console.error('Update Profile error:', error);
    },
  });
};

/**
 * Upload UDYAM Certificate Request
 */
export interface UploadUdyamRequest {
  file: {
    uri: string;
    type: string;
    name: string;
  };
}

/**
 * Upload UDYAM Certificate Response
 */
export interface UploadUdyamResponse {
  udyam_certificate: string;
  udyam_verified_at: string | null;
  message?: string;
}

/**
 * Upload UDYAM Certificate Mutation
 */
export const useUploadUdyam = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: UploadUdyamRequest['file']): Promise<UploadUdyamResponse> => {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('udyam_certificate', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      // Use user profile endpoint for file upload (same endpoint as profile update)
      const response = await api.post<UploadUdyamResponse>(
        USER_ENDPOINTS.UPDATE_PROFILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const responseData = response.data as any;

      // Handle wrapped response
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }

      return responseData;
    },
    onSuccess: (data) => {
      console.log('[Upload UDYAM Success] Full response:', JSON.stringify(data, null, 2));

      // Update Redux state with UDYAM verification status
      if (data.udyam_verified_at) {
        dispatch(
          updateUser({
            udyamVerifiedAt: data.udyam_verified_at,
          })
        );
      }

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error: Error) => {
      console.error('Upload UDYAM error:', error);
    },
  });
};

