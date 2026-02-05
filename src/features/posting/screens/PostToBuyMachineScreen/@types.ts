import type { MachineCategoryType } from '../../constants/machineConstants';

export type LocationSource = 'saved' | 'manual';

export interface SavedLocation {
  id: number;
  type: string;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string | null;
}

export interface PostToBuyMachineFormData {
  machine_category: MachineCategoryType | undefined;
  machine_id: number | undefined;
  machine_type: string;
  preferred_brands: string[]; // multi-select brand names
  condition_preference: string[]; // multi-select: Brand New, Excellent, Working Condition, Any
  budget_min: number | undefined;
  budget_max: number | undefined;
  urgency: 'normal' | 'urgent';
  location: string;
  latitude: number | undefined;
  longitude: number | undefined;
  location_id: number | undefined;
  location_source: LocationSource;
  additional_requirements: string;
}
