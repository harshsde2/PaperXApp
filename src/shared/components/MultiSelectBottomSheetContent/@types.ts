import type { Theme } from '@theme/types';

export interface MultiSelectBottomSheetContentProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  items: Array<{ id: number; name: string }>;
  selectedIds: number[];
  onSelect: (id: number) => void;
  onDeselect: (id: number) => void;
  theme: Theme;
  placeholder?: string;
}
