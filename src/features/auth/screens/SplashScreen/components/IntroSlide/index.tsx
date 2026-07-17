import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from '@theme/index';
import type { IntroSlideProps } from './@types';
import { createStyles } from './styles';

/**
 * One page of the app-intro carousel. The artwork is 3:4 portrait with its own
 * copy, so it renders `contain` (never cropped) with a subtle parallax + fade
 * driven by the shared carousel scroll offset.
 */
export const IntroSlide: React.FC<IntroSlideProps> = ({ source, index, scrollX }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const styles = createStyles(theme, width);

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP),
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            inputRange,
            [width * 0.12, 0, -width * 0.12],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(scrollX.value, inputRange, [0.94, 1, 0.94], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <View style={styles.page}>
      <Animated.Image
        source={source}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

export default IntroSlide;
