import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type CompanyDetailsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'CompanyDetails'
>;

export type CompanyDetailsFormData = {
  companyName: string;
  gstin: string;
  state: string;
  city: string;
  udyamCertificateNumber?: string;
};

export type SelectedFile = {
  uri: string;
  name: string;
  type: string;
  size: number;
  base64: string;
};
