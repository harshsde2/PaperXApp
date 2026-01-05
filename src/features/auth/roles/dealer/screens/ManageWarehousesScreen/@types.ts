import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type ManageWarehousesScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ManageWarehouses'
>;

export interface WarehouseLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary: boolean;
  latitude: number;
  longitude: number;
}

