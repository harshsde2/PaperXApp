import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type CustomButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'gradient';

/** Normalized 0–1 gradient points */
export interface GradientPoint {
  x: number;
  y: number;
}

export type CustomButtonSize = 'sm' | 'md' | 'lg';

export interface CustomButtonProps {
  /** Button label text */
  title: string;
  /** Press handler */
  onPress: () => void;
  /** Visual style variant */
  variant?: CustomButtonVariant;
  /** Size (affects padding and text size) */
  size?: CustomButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state: shows ActivityIndicator and disables press */
  loading?: boolean;
  /** Stretch to full width of container */
  fullWidth?: boolean;
  /** Icon or element before the label */
  leftIcon?: React.ReactNode;
  /** Icon or element after the label */
  rightIcon?: React.ReactNode;
  /** Override container style */
  style?: StyleProp<ViewStyle>;
  /** Override label text style */
  textStyle?: StyleProp<TextStyle>;
  /** TouchableOpacity activeOpacity (default 0.7) */
  activeOpacity?: number;
  /** Gradient: use with variant="gradient" or override colors. When set, background is gradient. */
  gradientColors?: string[];
  /** Gradient start (default top-left). Normalized 0–1. */
  gradientStart?: GradientPoint;
  /** Gradient end (default bottom-right). Normalized 0–1. */
  gradientEnd?: GradientPoint;
  /** Press animation: "water" = scale dip + ripple, "none" = no animation (default "water") */
  pressAnimation?: 'water' | 'none';
}
