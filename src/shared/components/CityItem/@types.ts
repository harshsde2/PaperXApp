import { ICity } from 'country-state-city';
import { Theme } from '@theme/types';

export type CityItemProps = {
  item: ICity;
  isSelected: boolean;
  onSelect: (name: string) => void;
  theme: Theme;
};
