import type { RtdLeadTime } from '@services/api';
import type { PriceSlabRow } from '../../components/PriceSlabInput';

export interface FormData {
  category: string;
  product_name: string;
  size: string;
  material: string;
  gsm: string;
  finish: string;
  branding_method: string;
  lead_time: RtdLeadTime | '';
  moq: string;
  max_capacity: string;
  base_price: string;
  buy_now_enabled: boolean;
  delivery_geography: string;
  price_slabs: PriceSlabRow[];
}

export interface FormErrors {
  category?: string;
  product_name?: string;
  size?: string;
  material?: string;
  gsm?: string;
  finish?: string;
  branding_method?: string;
  lead_time?: string;
  moq?: string;
  max_capacity?: string;
  base_price?: string;
  delivery_geography?: string;
  price_slabs?: string[];
}
