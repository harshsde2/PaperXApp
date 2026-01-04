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
      // Handle both wrapped response (response.data.data) and direct response (response.data)
      return response.data.data || response.data || { otp_sent: true };
    },
    onSuccess: () => {
      dispatch(setOTPSent(true));
    },
    onError: (error: Error) => {
      dispatch(setOTPSent(false));
      // console.error('Send OTP error:', JSON.stringify(error,null,2));
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
      
      // Handle both wrapped response (response.data.data) and direct response (response.data)
      const responseData = response.data as any;
      
      // If response has a 'data' property, use it (wrapped response)
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }
      
      // Otherwise, return response.data directly
      return responseData;
    },
    onSuccess: (data) => {
      // Log response for debugging
      console.log('[OTP Verification Success] Full response:', JSON.stringify(data, null, 2));
      console.log('[OTP Verification] access_token:', data?.access_token);
      console.log('[OTP Verification] token:', (data as any)?.token);
      console.log('[OTP Verification] user:', data?.user);

      // Get token from either access_token or token field
      const token = data?.access_token || (data as any)?.token;
      
      // Only store values that are defined (not null/undefined) to prevent MMKV errors
      if (token) {
        storageService.setAuthToken(token);
        console.log('[OTP Verification] Token stored in storage');
      } else {
        console.warn('[OTP Verification] No token found in response');
      }

      if (data?.refresh_token) {
        storageService.setRefreshToken(data.refresh_token);
      }

      if (data?.user) {
        storageService.setUserData(data.user);
        console.log('[OTP Verification] User data stored in storage');
      }

      // Update Redux state - we need at least a token to authenticate
      if (token) {
        // If we have user data, use it; otherwise create minimal user object
        const user = data?.user || {
          user_id: '',
          mobile: '',
          verified: true,
        };

        console.log('[OTP Verification] Dispatching setCredentials with:', {
          hasToken: !!token,
          hasUser: !!user,
          userMobile: user.mobile,
        });

        dispatch(
          setCredentials({
            user: {
              id: user.user_id || (user as any).id || '',
              mobile: user.mobile || '',
              primaryRole: user.primary_role || (user as any).primaryRole as any,
              secondaryRole: user.secondary_role || (user as any).secondaryRole as any,
              isVerified: user.verified !== undefined ? user.verified : true,
            },
            token: token,
          })
        );

        console.log('[OTP Verification] setCredentials dispatched');

        // Set roles if available
        if (user.primary_role || (user as any).primaryRole) {
          dispatch(
            setRoles({
              primaryRole: (user.primary_role || (user as any).primaryRole) as any,
              secondaryRole: (user.secondary_role || (user as any).secondaryRole) as any,
            })
          );
        }
      } else {
        console.error('[OTP Verification] Cannot authenticate: No token in response');
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
      // Attempt to call logout API, but don't wait if it fails
      try {
        await api.post(AUTH_ENDPOINTS.LOGOUT);
      } catch (error) {
        // Log error but continue with local logout
        console.warn('Logout API call failed:', error);
      }
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

