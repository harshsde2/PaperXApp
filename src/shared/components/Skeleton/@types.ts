import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  testID?: string;
}
