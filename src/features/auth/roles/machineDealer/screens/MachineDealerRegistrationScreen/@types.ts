import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { PlaceDetails } from '@shared/location/types';

export type MachineDealerRegistrationScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'MachineDealerRegistration'
>;

export type MachineDealerRegistrationFormData = {
  contactPersonName: string;
  email: string;
  businessAddress: string;
  businessDescription: string;
};

export type SelectedLocation = {
  placeDetails: PlaceDetails;
  addressString: string;
};
