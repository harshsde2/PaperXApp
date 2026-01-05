import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type RawMaterialsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RawMaterials'
>;

export interface RawMaterialOption {
  id: string;
  label: string;
}

export interface RawMaterialSection {
  id: string;
  title: string;
  options: RawMaterialOption[];
}

