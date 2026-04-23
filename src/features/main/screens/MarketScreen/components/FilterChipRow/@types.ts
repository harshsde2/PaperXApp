import type { FilterChipItem, FilterChipLabel } from '../../@types';

export interface FilterChipRowProps {
  chips: FilterChipItem[];
  activeFilter: FilterChipLabel;
  onSelectFilter: (filter: FilterChipLabel) => void;
}
