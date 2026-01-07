/**
 * User API Service
 * Handles user profile operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { USER_ENDPOINTS } from '@shared/constants/api';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadUdyamRequest,
  UploadUdyamResponse,
  SwitchRoleRequest,
  SwitchRoleResponse,
} from './@types';
import { storageService } from '@services/storage/storageService';
import { queryKeys } from '../queryClient';
import { useAppDispatch } from '@store/hooks';
import { updateUser } from '@store/slices/authSlice';
import { setRoles } from '@store/slices/roleSlice';

// ============================================
// GET PROFILE
// ============================================

export const useGetProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async (): Promise<UpdateProfileResponse> => {
      const response = await api.get<UpdateProfileResponse>(USER_ENDPOINTS.PROFILE);
      const responseData = response.data as any;

      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }

      return responseData;
    },
  });
};

// ============================================
// UPDATE PROFILE
// ============================================

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
      const response = await api.post<UpdateProfileResponse>(USER_ENDPOINTS.UPDATE_PROFILE, data);
      const responseData = response.data as any;

      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }

      return responseData;
    },
    onSuccess: (data) => {
      console.log('[Update Profile Success] Full response:', JSON.stringify(data, null, 2));
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error: Error) => {
      console.error('Update Profile error:', error);
    },
  });
};

// ============================================
// UPLOAD UDYAM
// ============================================

export const useUploadUdyam = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: UploadUdyamRequest['file']): Promise<UploadUdyamResponse> => {
      const formData = new FormData();
      formData.append('udyam_certificate', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      const response = await api.post<UploadUdyamResponse>(USER_ENDPOINTS.UPDATE_PROFILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = response.data as any;

      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }

      return responseData;
    },
    onSuccess: (data) => {
      console.log('[Upload UDYAM Success] Full response:', JSON.stringify(data, null, 2));

      if (data.udyam_verified_at) {
        dispatch(
          updateUser({
            udyamVerifiedAt: data.udyam_verified_at,
          })
        );
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error: Error) => {
      console.error('Upload UDYAM error:', error);
    },
  });
};

// ============================================
// SWITCH ROLE
// ============================================

export const useSwitchRole = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SwitchRoleRequest): Promise<SwitchRoleResponse> => {
      const response = await api.post<SwitchRoleResponse>(USER_ENDPOINTS.SWITCH_ROLE, data);
      const responseData = response.data as any;

      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }

      return responseData;
    },
    onSuccess: (data) => {
      console.log('[Switch Role Success] Full response:', JSON.stringify(data, null, 2));

      // Update role in Redux
      if (data.user) {
        dispatch(
          setRoles({
            primaryRole: (data.user.primary_role || data.current_role) as any,
            secondaryRole: data.user.secondary_role as any,
          })
        );

        // Update user data if needed
        dispatch(
          updateUser({
            primaryRole: (data.user.primary_role || data.current_role) as any,
            secondaryRole: data.user.secondary_role as any,
          })
        );
      }

      // Invalidate user-related queries to refresh data for new role
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error: Error) => {
      console.error('Switch Role error:', error);
    },
  });
};
