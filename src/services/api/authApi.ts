/**
 * Authentication API Service
 * Example implementation using React Query and Axios
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import { AUTH_ENDPOINTS } from '@shared/constants/api';
import type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './types';
import { storageService } from '@services/storage/storageService';
import { queryKeys } from './queryClient';
import { useAppDispatch } from '@store/hooks';
import { setCredentials, setOTPSent, setOTPVerified, logout as logoutAction } from '@store/slices/authSlice';
import { setRoles, clearRoles } from '@store/slices/roleSlice';

/**
 * Send OTP Mutation
 */
export const useSendOTP = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: SendOTPRequest): Promise<SendOTPResponse> => {
      const response = await api.post<SendOTPResponse>(AUTH_ENDPOINTS.SEND_OTP, data);
      return response.data.data;
    },
    onSuccess: () => {
      dispatch(setOTPSent(true));
    },
    onError: (error: Error) => {
      dispatch(setOTPSent(false));
      console.error('Send OTP error:', error);
    },
  });
};

/**
 * Verify OTP Mutation
 */
export const useVerifyOTP = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
      const response = await api.post<VerifyOTPResponse>(AUTH_ENDPOINTS.VERIFY_OTP, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Store tokens
      storageService.setAuthToken(data.access_token);
      storageService.setRefreshToken(data.refresh_token);
      storageService.setUserData(data.user);

      // Update Redux state
      dispatch(
        setCredentials({
          user: {
            id: data.user.user_id,
            mobile: data.user.mobile,
            primaryRole: data.user.primary_role as any,
            secondaryRole: data.user.secondary_role as any,
            isVerified: data.user.verified,
          },
          token: data.access_token,
        })
      );

      // Set roles if available
      if (data.user.primary_role) {
        dispatch(
          setRoles({
            primaryRole: data.user.primary_role as any,
            secondaryRole: data.user.secondary_role as any,
          })
        );
      }

      dispatch(setOTPVerified(true));

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error: Error) => {
      dispatch(setOTPVerified(false));
      console.error('Verify OTP error:', error);
    },
  });
};

/**
 * Logout Mutation
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    },
    onSuccess: () => {
      // Clear storage
      storageService.clearAuth();

      // Clear Redux state
      dispatch(logoutAction());
      dispatch(clearRoles());

      // Clear all queries
      queryClient.clear();
    },
    onError: (error: Error) => {
      // Even if API call fails, clear local data
      storageService.clearAuth();
      dispatch(logoutAction());
      dispatch(clearRoles());
      queryClient.clear();
      console.error('Logout error:', error);
    },
  });
};

