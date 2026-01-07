import { ViewStyle } from 'react-native';
import { ReactNode } from 'react';

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
   * Position of percentage text
   * 'center' - inside the circle (default old behavior)
   * 'bottom' - below the circle
   * @default 'bottom'
   */
  percentagePosition?: 'center' | 'bottom';
  
  /**
   * Starting angle in clock positions
   * '3' - starts from right (3 o'clock) - default SVG behavior
   * '6' - starts from bottom (6 o'clock)
   * '9' - starts from left (9 o'clock)
   * '12' - starts from top (12 o'clock)
   * @default '6'
   */
  startPosition?: '3' | '6' | '9' | '12';
  
  /**
   * Content to render in the center of the circle (e.g., avatar, icon)
   */
  children?: ReactNode;
  
  /**
   * Additional style for the container
   */
  style?: ViewStyle;
  
  /**
   * Color of the progress stroke (overrides automatic color based on percentage)
   */
  progressColor?: string;
  
  /**
   * Color of the percentage text
   */
  textColor?: string;
}

