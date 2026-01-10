import { IState } from 'country-state-city';
import { Theme } from '@theme/types';

export type StateItemProps = {
  item: IState;
  isSelected: boolean;
  onSelect: (name: string) => void;
  theme: Theme;
};
