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

export interface PostToSellMachineFormData {
  machine_category: MachineCategoryType | undefined;
  machine_id: number | undefined;
  machine_type: string; // display name from API or model from user
  brand: string;
  model: string;
  condition: string; // 'Brand New' | 'Excellent' | 'Working Condition' | 'Needs Repair'
  year_of_purchase: number | undefined;
  price: number | undefined;
  price_negotiable: boolean;
  urgency: 'normal' | 'urgent';
  location: string;
  latitude: number | undefined;
  longitude: number | undefined;
  location_id: number | undefined;
  location_source: LocationSource;
  description: string;
}
