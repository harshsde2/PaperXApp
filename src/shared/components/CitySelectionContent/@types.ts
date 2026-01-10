import { ICity } from 'country-state-city';
import { Theme } from '@theme/types';

export type CitySelectionContentProps = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedCity: string;
  selectedStateName: string;
  cities: ICity[];
  onSelect: (name: string) => void;
  theme: Theme;
};
