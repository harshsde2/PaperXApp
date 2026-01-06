import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type RoleSelectionScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RoleSelection'
>;

export type RoleSelectionScreenRouteProp = StackScreenProps<
  AuthStackParamList,
  'RoleSelection'
>['route'];

