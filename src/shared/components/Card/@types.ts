import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface CardProps {
  activeOpacity?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'compact';
  onPress?: () => void;
  testID?: string;
}

