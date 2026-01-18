import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type MachineDealerRegistrationScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'MachineDealerRegistration'
>;

export type MachineDealerRegistrationFormData = {
  contactPersonName: string;
  email: string;
  city: string;
  location: string;
  latitude?: number;
  longitude?: number;
  businessDescription: string;
};
