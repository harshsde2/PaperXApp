import type { ReactNode } from 'react';
import type { BlurViewProps } from '@react-native-community/blur';
import type { StyleProp, ViewStyle } from 'react-native';

export type GlassyWrapperBlurType = NonNullable<BlurViewProps['blurType']>;

export interface IGlassyWrapperProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  blurAmount?: number;
  blurType?: GlassyWrapperBlurType;
  /** 0–1; multiplied with theme white for the frosted tint. */
  overlayOpacity?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  padding?: number;
  showGlossyHighlight?: boolean;
  /** Optional bottom layer gradient (shown under blur/frost). At least two colors. */
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  /** Overrides alignment and layout of the inner content area (e.g. top-aligned forms). */
  contentContainerStyle?: StyleProp<ViewStyle>;
}
