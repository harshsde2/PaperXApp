/**
 * PostBrandRequirementScreen Types
 */

import type {
  BrandRequirementType,
  BrandPackagingType,
  BrandTimeline,
} from '@services/api';

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
}

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}
