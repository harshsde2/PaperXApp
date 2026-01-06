import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type VerificationStatusScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'VerificationStatus'
>;

export type VerificationStatusScreenRouteProp = StackScreenProps<
  AuthStackParamList,
  'VerificationStatus'
>['route'];

