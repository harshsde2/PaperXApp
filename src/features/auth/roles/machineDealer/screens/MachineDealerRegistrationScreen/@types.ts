import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import type { MachineCategoryType } from '../../../../../posting/constants/machineConstants';

export type MachineDealerRegistrationScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'MachineDealerRegistration'
>;

export type MachineDealerRegistrationFormData = {
  contactPersonName: string;
  email: string;
  mobile: string;
  gstin: string;
  city: string;
  location: string;
  latitude?: number;
  longitude?: number;
  businessDescription: string;
  machine_category?: MachineCategoryType | null;
  machine_id?: number | null;
  preferred_brand_ids?: number[];
};
