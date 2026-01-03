import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type OTPVerificationScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'OTPVerification'
>;

export type OTPVerificationScreenRouteProp = RouteProp<
  AuthStackParamList,
  'OTPVerification'
>;

