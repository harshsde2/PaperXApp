import { StyleProp, TextStyle } from 'react-native';

export interface SectionHeaderProps {
  title?: string;
  actionText?: string;
  titleStyle?: StyleProp<TextStyle>;
  onActionPress?: () => void;
}

