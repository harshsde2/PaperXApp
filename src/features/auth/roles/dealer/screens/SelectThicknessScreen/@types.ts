import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type SelectThicknessScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'SelectThickness'
>;

// Use string to support all units returned by API (e.g. GSM, BF, MICRON, OUNCE, etc.)
export type ThicknessUnit = string;

