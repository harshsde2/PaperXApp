import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Canvas,
  Circle,
  Path,
  Skia,
  useFont,
  Text as SkiaText,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import type { AnimatedCircularProgressProps } from './@types';

const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  duration = 350,
  backgroundColor = '#E0E0E0',
  showPercentage = true,
  style,
}) => {
  const progress = useSharedValue(0);
  const animatedPercentage = useSharedValue(0);

  // Animate progress from 0 to target percentage
  useEffect(() => {
    progress.value = withTiming(percentage, { duration });
    animatedPercentage.value = withTiming(percentage, { duration });
  }, [percentage, duration]);

  // Calculate dimensions
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

  // Create circular path for progress
  const path = useMemo(() => {
    const p = Skia.Path.Make();
    p.addCircle(center, center, radius);
    return p;
  }, [center, radius]);

  // Interpolate color based on percentage
  // Green for 100%, transitioning through yellow/orange to red for lower percentages
  // Marked as worklet to run on UI thread
  const getColor = (percent: number): string => {
    'worklet';
    if (percent >= 100) return '#4CAF50'; // Green
    if (percent >= 75) return '#8BC34A'; // Light green
    if (percent >= 50) return '#FFC107'; // Yellow
    if (percent >= 25) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  // Animated progress end value (0 to 1) - needs to be a Reanimated value for Skia
  const progressEnd = useDerivedValue(() => {
    return progress.value / 100;
  });

  // Animated color - convert to Skia Color
  const animatedColor = useDerivedValue(() => {
    'worklet';
    return Skia.Color(getColor(animatedPercentage.value));
  });

  // Animated percentage text
  const percentageText = useDerivedValue(() => {
    'worklet';
    return `${Math.round(animatedPercentage.value)}%`;
  });

  // Calculate text x position for centering (approximate)
  const textX = useDerivedValue(() => {
    'worklet';
    // For "100%" the text is about 36px wide, so we center it
    // This is a rough approximation - for better centering, we'd need to measure text
    return center - 18; // Approximate center for 3-4 character text
  });

  // Try to load font, fallback to system font
  const font = useFont(
    require('@assets/fonts/Montserrat-Bold.ttf'),
    24
  );

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Canvas style={{ width: size, height: size }}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          color={backgroundColor}
          style="stroke"
          strokeWidth={strokeWidth}
        />

        {/* Animated progress circle */}
        <Path
          path={path}
          color={animatedColor}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          start={0}
          end={progressEnd}
        />

        {/* Percentage text - centered */}
        {showPercentage && font && (
          <SkiaText
            x={textX}
            y={center + 8}
            text={percentageText}
            font={font}
            color={animatedColor}
          />
        )}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedCircularProgress;

