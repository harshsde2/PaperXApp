import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface IDashboardCardWrapperProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Defaults to theme spacing token for 80px when omitted (tab bar clearance). */
  marginBottom?: number;
}
