/**
 * TransactionItem Component Types
 */

import { StyleProp, ViewStyle } from 'react-native';
import { WalletTransaction } from '@services/api';

export interface TransactionItemProps {
  /** Transaction data */
  transaction: WalletTransaction;
  /** Callback when the item is pressed */
  onPress?: (transaction: WalletTransaction) => void;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}
