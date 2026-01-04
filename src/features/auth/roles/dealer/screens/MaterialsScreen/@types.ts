import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type MaterialsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Materials'
>;

export interface MaterialItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'paper' | 'machinery';
}

export interface MaterialCategory {
  id: string;
  name: string;
  type: 'paper' | 'machinery';
  items: MaterialItem[];
}

