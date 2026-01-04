import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type MillBrandDetailsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'MillBrandDetails'
>;

export type MillRelationship = 'authorized-agent' | 'independent-dealer';

