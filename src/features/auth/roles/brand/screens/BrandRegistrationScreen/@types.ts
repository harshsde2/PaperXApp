import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type BrandRegistrationScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'BrandRegistration'
>;

export interface BrandTypeOption {
  id: string;
  label: string;
  category: string;
}

export interface BrandTypeCategory {
  id: string;
  title: string;
  options: BrandTypeOption[];
}

export interface BrandRegistrationFormData {
  companyName: string;
  brandName: string;
  brandTypes: string[];
  contactPersonName: string;
  mobile: string;
  email: string;
  gstNumber?: string;
  state: string;
  city: string;
  address?: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

