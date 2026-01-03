import { ReactNode } from 'react';
import { StyleProp, ViewStyle, ScrollViewProps, StatusBarStyle } from 'react-native';

export type PaddingValue = number | {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  horizontal?: number;
  vertical?: number;
};

export interface ScreenWrapperProps {
  children?: ReactNode;
  safeArea?: boolean;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
  padding?: PaddingValue;
  paddingHorizontal?: number;
  paddingVertical?: number;
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
  contentContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  backgroundElement?: ReactNode;
  statusBarStyle?: StatusBarStyle;
  statusBarHidden?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  flex?: number;
  loading?: boolean;
  loadingComponent?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

