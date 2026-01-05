import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type MachineryScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Machinery'
>;

export interface MachineryOption {
  id: string;
  label: string;
}

export interface MachinerySection {
  id: string;
  title: string;
  options: MachineryOption[];
}

