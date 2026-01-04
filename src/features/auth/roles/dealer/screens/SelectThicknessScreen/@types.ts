import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type SelectThicknessScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'SelectThickness'
>;

export type ThicknessUnit = 'GSM' | 'MM' | 'MICRON';

