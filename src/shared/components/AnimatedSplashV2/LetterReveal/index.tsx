import React, { memo } from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Text } from '@shared/components/Text';
import type { LetterRevealProps } from './@types';
import { styles } from './styles';

const LetterReveal = memo(({ index, progress, color, children }: LetterRevealProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const p = progress.value;
    const t0 = index;
    const t1 = index + 0.92;
    const opacity = interpolate(p, [t0, t0 + 0.12, t1], [0, 1, 1], Extrapolation.CLAMP);
    const scaleX = interpolate(p, [t0, t1], [0.04, 1], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ scaleX }],
      transformOrigin: ['0%', '50%', 0] as const,
    };
  });

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <Text size={36} fontWeight="semibold" color={color} useThemeColor={false}>
        {children}
      </Text>
    </Animated.View>
  );
});

export default LetterReveal;
