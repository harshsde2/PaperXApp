import { FlatListProps } from 'react-native';
import { ICity } from 'country-state-city';
import { Theme } from '@theme/types';

export type CitySelectionContentProps = {
  selectedCity: string;
  selectedStateName: string;
  cities: ICity[];
  onSelect: (name: string) => void;
  theme: Theme;
  ListComponent?: React.ComponentType<FlatListProps<ICity>>;
};
