/**
 * CreditPackCard Component Types
 */

import { StyleProp, ViewStyle } from 'react-native';
import { CreditPack } from '@services/api';

export interface CreditPackCardProps {
  /** Credit pack data */
  pack: CreditPack;
  /** Whether this pack is currently selected */
  isSelected?: boolean;
  /** Callback when the card is pressed */
  onPress?: (pack: CreditPack) => void;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Whether the card is in loading/disabled state */
  disabled?: boolean;
  /** Test ID for testing */
  testID?: string;
}
