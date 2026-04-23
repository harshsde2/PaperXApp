import React, { memo } from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { ParticleProps } from './@types';

const TWO_PI = Math.PI * 2;

const Particle = memo(({ progress, data, centerX, centerY }: ParticleProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const p = progress.value;

    const currentAngle =
      data.startAngle + data.spiralTurns * TWO_PI * p;
    const currentDistance = data.startDistance * (1 - p);

    const x = Math.cos(currentAngle) * currentDistance;
    const y = Math.sin(currentAngle) * currentDistance;

    const opacity = interpolate(
      p,
      [0, 0.2, 0.75, 1],
      [0.5, 0.8, 0.4, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      p,
      [0, 0.6, 1],
      [1, 0.7, 0.15],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateX: x }, { translateY: y }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: centerX - data.radius,
          top: centerY - data.radius,
          width: data.radius * 2,
          height: data.radius * 2,
          borderRadius: data.radius,
          backgroundColor: data.color,
        },
        animatedStyle,
      ]}
    />
  );
});

export default Particle;
