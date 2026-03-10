import { useQuery } from '@tanstack/react-query';
import { api } from '@services/api/client';
import { REGISTRATION_DETAILS_ENDPOINTS } from '@shared/constants/api';
import type { RegistrationDetails } from './@types';

const REGISTRATION_DETAILS_QUERY_KEY = ['registration-details'];

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

