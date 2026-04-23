import type { SharedValue } from 'react-native-reanimated';

export interface LetterRevealProps {
  index: number;
  progress: SharedValue<number>;
  /** Text color (e.g. theme.colors.text.inverse on primary) */
  color: string;
  children: string;
}
