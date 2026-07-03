/**
 * Pricing API — server-authoritative posting-fee quote.
 * The server (config/pricing.php + PricingService) is the single source of truth; the
 * screen only displays what this returns and the post endpoint charges the same amount.
 */
import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { PRICING_ENDPOINTS } from '@shared/constants/api';

export interface PricingQuoteSpecs {
  role?: string;
  inquiry_type?: string; // material | machine | job
  intent?: string;
  material_id?: number | null;
  material_name?: string;
  material_category?: string;
  thickness?: number | null;
  thickness_unit?: string;
  size?: string | null;
  size_unit?: string;
  quantity?: number | null;
  quantity_unit?: string;
  urgency?: string; // normal | urgent
  machine_price_range?: string | null;
}

export interface PricingQuoteBreakdown {
  flow: 'raw_material' | 'ancillary' | 'machine' | 'jobwork' | 'brand';
  value_band?: string;
  kg?: number | null;
  bucket?: string;
  bucket_label?: string;
  kg_estimated?: boolean;
  machine_price_range?: string;
  price_range_label?: string;
  default_applied?: boolean;
  urgency: string;
  reason?: string;
}

export interface PricingQuote {
  base_fee: number;
  gst: number;
  gst_percent: number;
  total: number;
  currency: string;
  breakdown: PricingQuoteBreakdown;
}

export const usePricingQuote = (specs: PricingQuoteSpecs, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['pricing', 'quote', specs],
    queryFn: async (): Promise<PricingQuote> => {
      const response = await api.post(PRICING_ENDPOINTS.QUOTE, specs);
      const data = (response.data as any)?.data ?? response.data;
      return data as PricingQuote;
    },
    enabled: options?.enabled ?? true,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
};
