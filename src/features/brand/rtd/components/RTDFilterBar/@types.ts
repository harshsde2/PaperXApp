export interface RTDFilterState {
  category: string | null;
  leadTime: string | null;
  moq: string | null;
  price: string | null;
}

export type RTDFilterKey = keyof RTDFilterState;

export interface RTDFilterBarProps {
  filters: RTDFilterState;
  onFilterChange: (filterKey: RTDFilterKey) => void;
}
