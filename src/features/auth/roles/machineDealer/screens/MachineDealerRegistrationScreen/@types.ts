import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import type { MachineCategoryType } from '../../../../../posting/constants/machineConstants';

export type MachineDealerRegistrationScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'MachineDealerRegistration'
>;

/** A committed machine preference row shown in the list on the card. */
export type MachinePreferenceItem = {
  machine_category: MachineCategoryType;
  machine_id: number;
  machine_name: string;
  /** Optional preferred brands for this specific machine. */
  brand_names?: string[];
};

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
  // Staging selection that drives the category/type sheets before "Add"
  machine_category?: MachineCategoryType | null;
  machine_id?: number | null;
  // Committed list of machine preferences (what gets submitted)
  machine_preferences: MachinePreferenceItem[];
  preferred_brand_ids?: number[];
};
