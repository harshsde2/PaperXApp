/**
 * WalletScreen Types
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type WalletScreenProps = NativeStackScreenProps<any, 'WalletMain'>;

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}
