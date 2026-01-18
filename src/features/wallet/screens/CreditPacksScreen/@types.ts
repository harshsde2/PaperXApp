/**
 * CreditPacksScreen Types
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type CreditPacksScreenProps = NativeStackScreenProps<any, 'CreditPacks'>;

export type PaymentMethodOption = {
  id: string;
  name: string;
  icon: string;
  value: 'UPI' | 'NET_BANKING' | 'CARDS';
};
