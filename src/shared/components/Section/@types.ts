import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface SectionProps {
  title?: string;
  actionText?: string;
  titleStyle?: StyleProp<TextStyle>;
  onActionPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

