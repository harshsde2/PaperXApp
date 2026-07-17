import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from '@theme/index';
import type { PaginationDotProps } from './@types';
import { ACTIVE_DOT_WIDTH, DOT_SIZE, createStyles } from './styles';

/**
 * One page-indicator dot: widens into a pill and brightens as its slide
 * becomes active, tracking the carousel scroll offset continuously.
 */
export const PaginationDot: React.FC<PaginationDotProps> = ({ index, scrollX }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const styles = createStyles(theme);

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(
        scrollX.value,
        inputRange,
        [DOT_SIZE, ACTIVE_DOT_WIDTH, DOT_SIZE],
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export default PaginationDot;
