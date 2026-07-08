import { ViewStyle, ScrollViewProps } from 'react-native';
import { ReactNode } from 'react';

export type GradientType = 'linear' | 'radial' | 'none';

export interface IPaddingObject {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  horizontal?: number;
  vertical?: number;
}

export interface IGradientPoint {
  x: number;
  y: number;
}

export interface IScreenWrapperProps {
  children?: ReactNode;
  
  safeArea?: boolean;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
  
  gradient?: GradientType;
  gradientColors?: string[];
  gradientStart?: IGradientPoint;
  gradientEnd?: IGradientPoint;
  gradientCenter?: IGradientPoint;
  gradientRadius?: number;
  
  padding?: number | IPaddingObject;
  paddingHorizontal?: number;
  paddingVertical?: number;
  
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
  contentContainerStyle?: ViewStyle;
  
  backgroundColor?: string;
  backgroundElement?: ReactNode;
  
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  statusBarHidden?: boolean;
  
  contentStyle?: ViewStyle;
  flex?: number;
  
  loading?: boolean;
  loadingComponent?: ReactNode;

  /** When true, shows a cross-platform "Done" bar above the keyboard while it's open. */
  keyboardDoneBar?: boolean;

  /** When true, wraps content in a KeyboardAvoidingView (padding behavior on iOS). */
  keyboardAvoiding?: boolean;

  /** Offset passed to the KeyboardAvoidingView (e.g. header height). Only used when keyboardAvoiding is true. */
  keyboardVerticalOffset?: number;

  style?: ViewStyle;
}
