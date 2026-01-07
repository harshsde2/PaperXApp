/**
 * Authentication API Service
 * Handles authentication operations using React Query and Axios
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { AUTH_ENDPOINTS } from '@shared/constants/api';
import type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './@types';
import { storageService } from '@services/storage/storageService';
import { queryKeys } from '../queryClient';
import { useAppDispatch } from '@store/hooks';
import { setCredentials, setOTPSent, setOTPVerified, logout as logoutAction } from '@store/slices/authSlice';
import { setRoles, clearRoles } from '@store/slices/roleSlice';

export const useSendOTP = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: SendOTPRequest): Promise<SendOTPResponse> => {
      const response = await api.post<SendOTPResponse>(AUTH_ENDPOINTS.SEND_OTP, data);
      return response.data.data || response.data || { otp_sent: true };
    },
    onSuccess: () => {
      dispatch(setOTPSent(true));
    },
    onError: (error: Error) => {
      dispatch(setOTPSent(false));
    },
  });
};

export const useVerifyOTP = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
      const response = await api.post<VerifyOTPResponse>(AUTH_ENDPOINTS.VERIFY_OTP, data);
      
      const responseData = response.data as any;
      
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }
      
      return responseData;
    },
    onSuccess: (data) => {
      console.log('[OTP Verification Success] Full response:', JSON.stringify(data, null, 2));

      const token = data?.access_token || (data as any)?.token;
      
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

      if (token) {
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
              companyName: (user as any).company_name || null,
              udyamVerifiedAt: (user as any).udyam_verified_at || null,
            },
            token: token,
          })
        );

        console.log('[OTP Verification] setCredentials dispatched');

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

      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error: Error) => {
      dispatch(setOTPVerified(false));
      console.error('Verify OTP error:', error);
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        await api.post(AUTH_ENDPOINTS.LOGOUT);
      } catch (error) {
        console.warn('Logout API call failed:', error);
      }
    },
    onSuccess: () => {
      storageService.clearAuth();
      dispatch(logoutAction());
      dispatch(clearRoles());
      queryClient.clear();
    },
    onError: (error: Error) => {
      storageService.clearAuth();
      dispatch(logoutAction());
      dispatch(clearRoles());
      queryClient.clear();
      console.error('Logout error:', error);
    },
  });
};

