import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'compact';
  onPress?: () => void;
  testID?: string;
}

