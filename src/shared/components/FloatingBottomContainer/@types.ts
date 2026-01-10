import { ReactNode, StyleProp, ViewStyle } from 'react-native';

export interface FloatingBottomContainerProps {
  /**
   * Content to render inside the floating container
   */
  children: ReactNode;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Background color (defaults to theme background)
   */
  backgroundColor?: string;

  /**
   * Padding horizontal (defaults to theme spacing[4])
   */
  paddingHorizontal?: number;

  /**
   * Padding vertical (defaults to theme spacing[4])
   */
  paddingVertical?: number;

  /**
   * Padding top (defaults to paddingVertical)
   */
  paddingTop?: number;

  /**
   * Padding bottom (defaults to paddingVertical, includes safe area inset)
   */
  paddingBottom?: number;

  /**
   * Whether to include safe area insets (default: true)
   */
  safeArea?: boolean;

  /**
   * Shadow/elevation for the container (default: true)
   */
  shadow?: boolean;

  /**
   * Border radius for top corners (default: 0)
   */
  borderRadius?: number;
}

