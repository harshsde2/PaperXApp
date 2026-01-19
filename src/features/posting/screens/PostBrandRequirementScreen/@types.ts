/**
 * PostBrandRequirementScreen Types
 */

import type {
  BrandRequirementType,
  BrandPackagingType,
  BrandTimeline,
  BrandUrgency,
} from '@services/api';

export interface PostBrandRequirementFormData {
  requirement_type: BrandRequirementType;
  packaging_type?: BrandPackagingType;
  quantity_range: string;
  timeline: BrandTimeline;
  special_needs: string;
  design_attachments: string[];
  title: string;
  description: string;
  urgency: BrandUrgency;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
}

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}
