/**
 * PostBrandRequirementScreen Types
 */

import type {
  BrandRequirementType,
  BrandPackagingType,
  BrandTimeline,
} from '@services/api';

export type LocationSource = 'saved' | 'manual';

export interface SavedLocation {
  id: number;
  type: string;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string | null;
  source?: string;
  backend_location_id?: number;
}

export interface PostBrandRequirementFormData {
  requirement_type: BrandRequirementType;
  packaging_type?: BrandPackagingType;
  quantity_range: string;
  timeline: BrandTimeline;
  description: string;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  location_id?: number;
  location_source: LocationSource;
}

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}
