import type { StackScreenProps } from '@react-navigation/stack';
import type { MainStackParamList } from '@navigation/MainNavigator';
import { SCREENS } from '@navigation/constants';

export type BrandRTDRequestOrderScreenProps = StackScreenProps<
  MainStackParamList,
  typeof SCREENS.BRAND_RTD.REQUEST_ORDER
>;

export interface OrderFormState {
  quantity: string;
  deliveryAddress: string;
  orderNotes: string;
  logoFile: LogoFile | null;
}

export interface LogoFile {
  uri: string;
  name: string;
  type: string;
}
