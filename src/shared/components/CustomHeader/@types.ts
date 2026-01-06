import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

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
  titleStyle?: StyleProp<TextStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  leftButtonStyle?: StyleProp<ViewStyle>;
}

