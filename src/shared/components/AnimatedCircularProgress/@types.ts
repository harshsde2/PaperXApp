import { ViewStyle } from 'react-native';

export interface AnimatedCircularProgressProps {
  /**
   * Percentage value (0-100)
   */
  percentage: number;
  
  /**
   * Size of the circular progress (width and height)
   * @default 120
   */
  size?: number;
  
  /**
   * Width of the stroke
   * @default 8
   */
  strokeWidth?: number;
  
  /**
   * Animation duration in milliseconds
   * @default 350
   */
  duration?: number;
  
  /**
   * Background color of the circle
   * @default '#E0E0E0'
   */
  backgroundColor?: string;
  
  /**
   * Whether to show percentage text
   * @default true
   */
  showPercentage?: boolean;
  
  /**
   * Additional style for the container
   */
  style?: ViewStyle;
}

