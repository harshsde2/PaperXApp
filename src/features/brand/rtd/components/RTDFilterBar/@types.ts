export interface RTDFilterState {
  category: string | null;
  leadTime: string | null;
  moq: string | null;
  price: string | null;
  filter: string | null;
}

export type RTDFilterKey = keyof RTDFilterState;

export interface IconProps {
  width: number;
  height: number;
  color: string;
}

export interface RTDFilterConfig {
  key: RTDFilterKey;
  label: string;
  icon: React.FC<IconProps>;
}

export interface RTDFilterBarProps {
  filters: RTDFilterState;
  onFilterChange: (filterKey: RTDFilterKey) => void;
}
