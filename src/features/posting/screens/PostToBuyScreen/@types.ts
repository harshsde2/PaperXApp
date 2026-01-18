import type {
  InquiryType,
  IntentType,
  ThicknessUnit,
  QuantityUnit,
  PriceUnit,
  UrgencyType,
} from '@services/api/dealerApi/@types';

export interface PostToBuyFormData {
  inquiry_type: InquiryType;
  intent: IntentType;
  title: string;
  description: string;
  material_ids: number[];
  thickness?: number;
  thickness_unit?: ThicknessUnit;
  size?: string;
  quantity?: number;
  quantity_unit: QuantityUnit;
  price?: number;
  price_unit?: PriceUnit;
  price_negotiable: boolean;
  urgency: UrgencyType;
  location: string;
  latitude?: number;
  longitude?: number;
  deadline?: string;
}
