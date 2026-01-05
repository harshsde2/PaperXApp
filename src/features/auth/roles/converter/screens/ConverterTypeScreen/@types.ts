import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type ConverterTypeScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ConverterType'
>;

export interface ConverterTypeOption {
  id: string;
  label: string;
}

export interface ConverterTypeSection {
  id: string;
  title: string;
  options: ConverterTypeOption[];
}

