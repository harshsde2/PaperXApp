import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ReactNode } from 'react';

export interface CustomHeaderRightButton {
  icon?: ReactNode;
  onPress: () => void;
}

export interface CustomHeaderProps {
  route?: RouteProp<any>;
  navigation: StackNavigationProp<any>;
  title?: string;
  showBackButton?: boolean;
  rightButton?: CustomHeaderRightButton;
}

