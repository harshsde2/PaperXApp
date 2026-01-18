/**
 * WalletBadge Component Types
 */

import { StyleProp, ViewStyle } from 'react-native';

export interface WalletBadgeProps {
  /** Callback when the badge is pressed */
  onPress?: () => void;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Whether to show loading state */
  showLoading?: boolean;
  /** Test ID for testing */
  testID?: string;
}
