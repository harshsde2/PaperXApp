import type { RtdLeadTime } from '@services/api';
import type { PriceSlabRow } from '../../components/PriceSlabInput';
import type { PickedImage } from '@shared/utils/imagePicker';

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

export interface FormData {
  category: string;
  product_name: string;
  image: PickedImage | null;
  image_path: string | null;
  size: string;
  size_unit: 'inches' | 'cm' | 'mm' | '';
  material_id?: number;
  material: string;
  thickness: string;
  thickness_unit: 'GSM' | 'MM' | 'OUNCE' | 'BF' | 'MICRON' | '';
  finish_ids: number[];
  finish: string;
  branding_enabled: boolean;
  branding_methods: string[];
  branding_method: string;
  lead_time: RtdLeadTime | '';
  moq: string;
  max_capacity: string;
  base_price: string;
  buy_now_enabled: boolean;
  delivery_geography: string;
  location_id?: number;
  location_source?: LocationSource;
  latitude?: number;
  longitude?: number;
  price_slabs: PriceSlabRow[];
  gst_rate?: string;
}

export interface FormErrors {
  category?: string;
  product_name?: string;
  size?: string;
  size_unit?: string;
  material?: string;
  thickness?: string;
  thickness_unit?: string;
  branding_methods?: string;
  finish?: string;
  branding_method?: string;
  lead_time?: string;
  moq?: string;
  max_capacity?: string;
  base_price?: string;
  delivery_geography?: string;
  price_slabs?: string[];
  gst_rate?: string;
}
