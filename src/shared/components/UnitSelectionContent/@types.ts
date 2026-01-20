import type { Theme } from '@theme/types';

export interface UnitSelectionContentProps {
  units: string[];
  selectedUnit: string;
  onSelect: (unit: string) => void;
  theme: Theme;
  title?: string;
}
