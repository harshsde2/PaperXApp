import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type MaterialSpecsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'MaterialSpecs'
>;

export interface SpecOption {
  id: string;
  label: string;
}

export interface SpecSection {
  id: string;
  title: string;
  options: SpecOption[];
}

