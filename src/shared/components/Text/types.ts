import { StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'captionLarge'
  | 'captionMedium'
  | 'captionSmall'
  | 'buttonLarge'
  | 'buttonMedium'
  | 'buttonSmall'
  | 'overline';

export interface TextProps extends RNTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
  fontWeight?: FontWeight;
  color?: string;
  size?: number;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  fontFamily?: string;
  useThemeColor?: boolean;
}

