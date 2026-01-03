import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

