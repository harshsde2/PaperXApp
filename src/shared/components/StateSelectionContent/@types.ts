import { Theme } from '@theme/types';

export type StateSelectionContentProps = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedState: string;
  onSelect: (name: string) => void;
  theme: Theme;
};
