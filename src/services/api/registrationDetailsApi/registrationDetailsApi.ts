import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@services/api/client';
import {
  REGISTRATION_DETAILS_ENDPOINTS,
  CONVERTER_ENDPOINTS,
  BRAND_ENDPOINTS,
  DEALER_ENDPOINTS,
  MACHINE_DEALER_ENDPOINTS,
} from '@shared/constants/api';
import { queryKeys } from '@services/api/queryClient';
import type { RegistrationDetails } from './@types';

const REGISTRATION_DETAILS_QUERY_KEY = ['registration-details'];

/** Roles that support section editing today (Phase 1). */
export type EditableRole = 'converter' | 'brand' | 'dealer' | 'machine_dealer' | 'machine-dealer';

const SECTION_ENDPOINT_BY_ROLE: Record<string, string | undefined> = {
  converter: (CONVERTER_ENDPOINTS as any).UPDATE_SECTION,
  brand: (BRAND_ENDPOINTS as any).UPDATE_SECTION,
  dealer: (DEALER_ENDPOINTS as any).UPDATE_SECTION,
  machine_dealer: (MACHINE_DEALER_ENDPOINTS as any).UPDATE_SECTION,
  'machine-dealer': (MACHINE_DEALER_ENDPOINTS as any).UPDATE_SECTION,
};

const ROLE_CACHE_ROOT: Record<string, readonly unknown[] | undefined> = {
  converter: queryKeys.converter.all,
  brand: queryKeys.brand.all,
  dealer: queryKeys.dealer.all,
  machine_dealer: queryKeys.machineDealer.all,
  'machine-dealer': queryKeys.machineDealer.all,
};

export const fetchRegistrationDetails = async (): Promise<RegistrationDetails> => {
  const response = await api.get<RegistrationDetails>(REGISTRATION_DETAILS_ENDPOINTS.DETAIL);
  const raw = response.data as any;

  if (raw && typeof raw === 'object' && 'data' in raw) {
    return raw.data as RegistrationDetails;
  }

  return raw as RegistrationDetails;
};

export const useRegistrationDetails = () => {
  return useQuery<RegistrationDetails>({
    queryKey: REGISTRATION_DETAILS_QUERY_KEY,
    queryFn: fetchRegistrationDetails,
  });
};

/**
 * Partial per-section profile update. Posts only the given section's fields to
 * the role's merge endpoint; refreshes registration-details + role + profile caches.
 * The backend re-runs matchmaking after the update.
 */
export const useUpdateProfileSection = (role: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const endpoint = SECTION_ENDPOINT_BY_ROLE[role];
      if (!endpoint) {
        throw new Error(`Editing is not available for role "${role}" yet.`);
      }
      const response = await api.post(endpoint, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGISTRATION_DETAILS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      const root = ROLE_CACHE_ROOT[role];
      if (root) {
        queryClient.invalidateQueries({ queryKey: root });
      }
      // Session/matchmaking may have changed after a profile edit.
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
};

