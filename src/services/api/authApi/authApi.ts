/**
 * Authentication API Service
 * Handles authentication operations using React Query and Axios
 * After OTP verify: fetches full profile (single source of truth), syncs to Redux + storage, returns hasCompletedRegistration for navigation.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '@shared/constants/api';
import type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './@types';
import type { UpdateProfileResponse } from '@services/api/userApi/@types';
import { storageService } from '@services/storage/storageService';
import { queryKeys } from '../queryClient';
import { useAppDispatch } from '@store/hooks';
import { setCredentials, setOTPSent, setOTPVerified, logout as logoutAction } from '@store/slices/authSlice';
import { setRoles, clearRoles } from '@store/slices/roleSlice';
import type { User } from '@shared/types';

/** Map API profile (snake_case) to auth User shape for Redux/storage */
function profileToAuthUser(
  profile: UpdateProfileResponse | null,
  minimalUser: any,
  token: string
): { user: User; token: string } {
  if (profile) {
    // Prefer backend-driven registration completion flags if available
    const backendHasCompletedRegistration =
      typeof (profile as any)?.has_completed_registration === 'boolean'
        ? (profile as any).has_completed_registration
        : typeof (profile as any)?.profile_complete === 'boolean'
          ? (profile as any).profile_complete
          : undefined;

    return {
      user: {
        id: String(profile.id ?? minimalUser?.id ?? ''),
        mobile: profile.mobile ?? minimalUser?.mobile ?? '',
        primaryRole: (profile.primary_role ?? minimalUser?.primary_role) as User['primaryRole'],
        primary_role: (profile.primary_role ?? minimalUser?.primary_role) as User['primary_role'],
        secondaryRole: (profile.secondary_role ?? minimalUser?.secondary_role) as User['secondaryRole'],
        isVerified: true,
        companyName: profile.company_name ?? null,
        udyamVerifiedAt: profile.udyam_verified_at ?? null,
        operation_area: (profile.operation_area as User['operation_area']) ?? 'local',
        company_name: profile.company_name ?? '',
        gst_in: profile.gst_in ?? '',
        state: profile.state ?? '',
        city: profile.city ?? '',
        udyam_certificate: profile.udyam_certificate ?? null,
        udyam_verified_at: profile.udyam_verified_at ?? null,
        avatar: profile.avatar ?? null,
        created_at: profile.created_at ?? '',
        updated_at: profile.updated_at ?? '',
        materials: (profile as any).materials ?? [],
        machines: (profile as any).machines ?? [],
        locations: (profile as any).locations ?? [],
        // Use backend's completed-registration flag when present, otherwise
        // fall back to profile_complete or simple company_name heuristic.
        profile_complete:
          typeof backendHasCompletedRegistration === 'boolean'
            ? backendHasCompletedRegistration
            : (profile as any).profile_complete ?? !!profile.company_name,
        grades: (profile as any).grades ?? null,
        capacity_daily: (profile as any).capacity_daily ?? '',
        capacity_monthly: (profile as any).capacity_monthly ?? '',
        capacity_unit: (profile as any).capacity_unit ?? '',
        user_id: profile.id ?? 0,
        status: ((profile as any).status as User['status']) ?? 'ACTIVE',
      },
      token,
    };
  }
  return {
    user: {
      id: String(minimalUser?.user_id ?? minimalUser?.id ?? ''),
      mobile: minimalUser?.mobile ?? '',
      primaryRole: (minimalUser?.primary_role) as User['primaryRole'],
      primary_role: (minimalUser?.primary_role) as User['primary_role'],
      secondaryRole: (minimalUser?.secondary_role) as User['secondaryRole'],
      isVerified: true,
      companyName: null,
      udyamVerifiedAt: null,
      operation_area: 'local',
      company_name: '',
      gst_in: '',
      state: '',
      city: '',
      udyam_certificate: null,
      udyam_verified_at: null,
      avatar: null,
      created_at: '',
      updated_at: '',
      materials: [],
      machines: [],
      locations: [],
      profile_complete: false,
      grades: null,
      capacity_daily: '',
      capacity_monthly: '',
      capacity_unit: '',
      user_id: Number(minimalUser?.id ?? minimalUser?.user_id ?? 0),
      status: 'ACTIVE',
    },
    token,
  };
}

export type VerifyOTPResult = {
  verifyData: { token: string; user: any };
  profile: UpdateProfileResponse | null;
  hasCompletedRegistration: boolean;
};

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
    mutationFn: async (data: VerifyOTPRequest): Promise<VerifyOTPResult> => {
      const response = await api.post<VerifyOTPResponse>(AUTH_ENDPOINTS.VERIFY_OTP, data);
      const responseData = response.data as any;
      const verifyData = responseData?.data ?? responseData;

      console.log('verifyData', JSON.stringify(verifyData, null, 2));

      const token = verifyData?.access_token ?? verifyData?.token;
      if (!token) {
        throw new Error('No token in verify response');
      }
      storageService.setAuthToken(token);
      if (verifyData?.refresh_token) {
        storageService.setRefreshToken(verifyData.refresh_token);
      }

      const minimalUser = verifyData?.user ?? {};
      let profile: UpdateProfileResponse | null = null;
      try {
        const profileRes = await api.get<{ data?: UpdateProfileResponse }>(USER_ENDPOINTS.PROFILE);
        console.log('profileRes', JSON.stringify(profileRes.data, null, 2));
        const raw = profileRes.data as any;
        profile = raw?.data ?? raw ?? null;
      } catch (err) {
        if (__DEV__) {
          console.warn('[OTP Verification] Profile fetch failed, using minimal user', err);
        }
      }

      // Backend sends has_completed_registration/profile_complete in the PROFILE response.
      // Prefer those flags if available, fall back to company_name heuristic.
      const backendHasCompletedRegistration =
        typeof (profile as any)?.has_completed_registration === 'boolean'
          ? (profile as any).has_completed_registration
          : typeof (profile as any)?.profile_complete === 'boolean'
            ? (profile as any).profile_complete
            : undefined;

      const hasCompletedRegistration =
        typeof backendHasCompletedRegistration === 'boolean'
          ? backendHasCompletedRegistration
          : !!profile?.company_name;

      return {
        verifyData: { token, user: minimalUser },
        profile,
        hasCompletedRegistration,
      };
    },
    onSuccess: (data: VerifyOTPResult) => {
      const { verifyData, profile } = data;
      const token = verifyData.token;
      const minimalUser = verifyData.user;

      console.log('profile', JSON.stringify(data, null, 2));

      const { user, token: _t } = profileToAuthUser(profile, minimalUser, token);
      storageService.setUserData(profile ?? minimalUser);
      dispatch(setCredentials({ user, token }));

      if (user.primaryRole) {
        dispatch(
          setRoles({
            primaryRole: user.primaryRole as any,
            secondaryRole: user.secondaryRole as any,
          })
        );
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

