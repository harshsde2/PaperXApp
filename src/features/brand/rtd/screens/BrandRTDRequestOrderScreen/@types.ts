import type { StackScreenProps } from '@react-navigation/stack';
import type { MainStackParamList } from '@navigation/MainNavigator';
import { SCREENS } from '@navigation/constants';
import type { PickedImage } from '@shared/utils/imagePicker';

export type BrandRTDRequestOrderScreenProps = StackScreenProps<
  MainStackParamList,
  typeof SCREENS.BRAND_RTD.REQUEST_ORDER
>;

export interface OrderFormState {
  quantity: string;
  logoFile: PickedImage | null;
}
