import type { StackScreenProps } from '@react-navigation/stack';
import type { MainStackParamList } from '@navigation/MainNavigator';
import { SCREENS } from '@navigation/constants';

export type BrandRTDMyOrdersScreenProps = StackScreenProps<
  MainStackParamList,
  typeof SCREENS.BRAND_RTD.MY_ORDERS
>;

export type OrderTab = 'active' | 'history';
