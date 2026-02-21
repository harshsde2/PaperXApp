import type { StackScreenProps } from '@react-navigation/stack';
import type { MainStackParamList } from '@navigation/MainNavigator';
import { SCREENS } from '@navigation/constants';

export type BrandRTDOrderDetailScreenProps = StackScreenProps<
  MainStackParamList,
  typeof SCREENS.BRAND_RTD.ORDER_DETAIL
>;
