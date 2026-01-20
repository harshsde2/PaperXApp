import type {
  InquiryType,
  IntentType,
  ThicknessUnit,
  QuantityUnit,
  PriceUnit,
  UrgencyType,
} from '@services/api/dealerApi/@types';

// Size unit types
export type SizeUnit = 'inches' | 'cm' | 'mm';

// Location source - whether from saved locations or manually selected on map
export type LocationSource = 'saved' | 'manual';

// Visibility type - who can see the requirement
export type VisibilityType = 'dealers' | 'converters' | 'manufacturers' | 'all';

// Saved location structure (from user's registered warehouses)
export interface SavedLocation {
  id: number;
  type: string;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string | null;
}

export interface PostToBuyFormData {
  inquiry_type: InquiryType;
  intent: IntentType;
  material_id?: number; // Single material selection (required)
  thickness?: number;
  thickness_unit?: ThicknessUnit;
  size?: string;
  size_unit?: SizeUnit;
  finish_ids: number[]; // Selected grade/finish/variant IDs (optional)
  quantity?: number;
  quantity_unit: QuantityUnit;
  price?: number;
  price_unit?: PriceUnit;
  price_negotiable: boolean;
  urgency: UrgencyType;
  visibility: VisibilityType; // Who can see the requirement (required)
  // Location fields
  location_id?: number; // ID of saved location (if selected from saved locations)
  location_source: LocationSource; // Whether location is from saved or manual
  location: string; // Address string
  latitude?: number;
  longitude?: number;
}
