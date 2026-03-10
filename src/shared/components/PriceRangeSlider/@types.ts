export interface PriceRangeSliderProps {
  minPrice: string;
  maxPrice: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  rangeMin?: number;
  rangeMax?: number;
}
