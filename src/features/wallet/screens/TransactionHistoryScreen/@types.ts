/**
 * TransactionHistoryScreen Types
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransactionDirection } from '@services/api';

export type TransactionHistoryScreenProps = NativeStackScreenProps<
  any,
  'TransactionHistory'
>;

export interface FilterOption {
  label: string;
  value: TransactionDirection;
}
