import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type FinishedProductsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'FinishedProducts'
>;

export interface FinishedProductOption {
  id: string;
  label: string;
}

export interface FinishedProductSection {
  id: string;
  title: string;
  options: FinishedProductOption[];
}

