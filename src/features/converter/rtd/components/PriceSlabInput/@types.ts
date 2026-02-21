export interface PriceSlabRow {
  min_qty: string;
  max_qty: string;
  price_per_unit: string;
}

export interface PriceSlabInputProps {
  slabs: PriceSlabRow[];
  onSlabsChange: (slabs: PriceSlabRow[]) => void;
  errors?: string[];
}
