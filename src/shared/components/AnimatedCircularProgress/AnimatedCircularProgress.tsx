import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Canvas,
  Circle,
  Path,
  Skia,
  Group,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { Text } from '../Text';
import type { AnimatedCircularProgressProps } from './@types';

// Color stops for smooth gradient
const COLOR_STOPS = {
  RED: '#F44336',
  ORANGE: '#FF9800',
  YELLOW: '#FFC107',
  LIGHT_GREEN: '#8BC34A',
  GREEN: '#4CAF50',
};

const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  duration = 350,
  backgroundColor = '#E0E0E0',
  showPercentage = true,
  percentagePosition = 'bottom',
  startPosition = '6',
  children,
  style,
  progressColor,
  textColor,
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

  // Calculate rotation based on start position
  const getRotationAngle = (): number => {
    switch (startPosition) {
      case '12': return -90;  // Top
      case '3': return 0;     // Right (default SVG)
      case '6': return 90;    // Bottom
      case '9': return 180;   // Left
      default: return 90;     // Default to 6 o'clock
    }
  };

  const rotationAngle = getRotationAngle();

  // Create circular path for progress
  const path = useMemo(() => {
    const p = Skia.Path.Make();
    p.addCircle(center, center, radius);
    return p;
  }, [center, radius]);

  // Smooth color interpolation based on percentage (worklet for Skia)
  const getInterpolatedColor = (percent: number): string => {
    'worklet';
    if (progressColor) return progressColor;
    
    // Clamp percentage between 0 and 100
    const p = Math.max(0, Math.min(100, percent));
    
    // Interpolate between color stops smoothly
    // 0-25: Red to Orange
    // 25-50: Orange to Yellow
    // 50-75: Yellow to Light Green
    // 75-100: Light Green to Green
    
    if (p <= 25) {
      const t = p / 25;
      return interpolateColor(t, [0, 1], [COLOR_STOPS.RED, COLOR_STOPS.ORANGE]) as string;
    } else if (p <= 50) {
      const t = (p - 25) / 25;
      return interpolateColor(t, [0, 1], [COLOR_STOPS.ORANGE, COLOR_STOPS.YELLOW]) as string;
    } else if (p <= 75) {
      const t = (p - 50) / 25;
      return interpolateColor(t, [0, 1], [COLOR_STOPS.YELLOW, COLOR_STOPS.LIGHT_GREEN]) as string;
    } else {
      const t = (p - 75) / 25;
      return interpolateColor(t, [0, 1], [COLOR_STOPS.LIGHT_GREEN, COLOR_STOPS.GREEN]) as string;
    }
  };

  // Animated progress end value (0 to 1)
  const progressEnd = useDerivedValue(() => {
    return progress.value / 100;
  });

  // Animated color with smooth interpolation
  const animatedColor = useDerivedValue(() => {
    'worklet';
    const colorString = getInterpolatedColor(animatedPercentage.value);
    return Skia.Color(colorString);
  });

  // Get current percentage and color for display (React state for text)
  const [displayPercentage, setDisplayPercentage] = React.useState(0);
  const [displayColor, setDisplayColor] = React.useState(COLOR_STOPS.RED);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayPercentage;
    const endValue = percentage;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progressRatio;
      const roundedValue = Math.round(currentValue);
      
      setDisplayPercentage(roundedValue);
      setDisplayColor(getInterpolatedColorJS(currentValue));
      
      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [percentage, duration]);

  // JavaScript version of color interpolation for React components
  const getInterpolatedColorJS = (percent: number): string => {
    if (textColor) return textColor;
    if (progressColor) return progressColor;
    
    const p = Math.max(0, Math.min(100, percent));
    
    // Helper to interpolate between two hex colors
    const lerpColor = (color1: string, color2: string, t: number): string => {
      const r1 = parseInt(color1.slice(1, 3), 16);
      const g1 = parseInt(color1.slice(3, 5), 16);
      const b1 = parseInt(color1.slice(5, 7), 16);
      
      const r2 = parseInt(color2.slice(1, 3), 16);
      const g2 = parseInt(color2.slice(3, 5), 16);
      const b2 = parseInt(color2.slice(5, 7), 16);
      
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };
    
    if (p <= 25) {
      return lerpColor(COLOR_STOPS.RED, COLOR_STOPS.ORANGE, p / 25);
    } else if (p <= 50) {
      return lerpColor(COLOR_STOPS.ORANGE, COLOR_STOPS.YELLOW, (p - 25) / 25);
    } else if (p <= 75) {
      return lerpColor(COLOR_STOPS.YELLOW, COLOR_STOPS.LIGHT_GREEN, (p - 50) / 25);
    } else {
      return lerpColor(COLOR_STOPS.LIGHT_GREEN, COLOR_STOPS.GREEN, (p - 75) / 25);
    }
  };

  // Calculate inner content size (for avatar/children)
  const innerSize = size - strokeWidth * 2 - 8; // Leave some padding

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.container, { width: size, height: size }]}>
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

          {/* Animated progress circle with rotation */}
          <Group
            transform={[
              { translateX: center },
              { translateY: center },
              { rotate: (rotationAngle * Math.PI) / 180 },
              { translateX: -center },
              { translateY: -center },
            ]}
          >
            <Path
              path={path}
              color={animatedColor}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
              start={0}
              end={progressEnd}
            />
          </Group>
        </Canvas>

        {/* Center content (avatar/children) */}
        {children && (
          <View style={[styles.centerContent, { width: innerSize, height: innerSize }]}>
            {children}
          </View>
        )}

        {/* Percentage text in center (if position is center and no children) */}
        {showPercentage && percentagePosition === 'center' && !children && (
          <View style={styles.centerText}>
            <Text
              fontWeight="bold"
              size={size * 0.2}
              color={displayColor}
            >
              {displayPercentage}%
            </Text>
          </View>
        )}
      </View>

      {/* Percentage text below circle */}
      {showPercentage && percentagePosition === 'bottom' && (
        <View style={styles.bottomText}>
          <Text
            fontWeight="bold"
            size={size * 0.15}
            color={displayColor}
          >
            {displayPercentage}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    overflow: 'hidden',
  },
  centerText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    marginTop: 8,
    alignItems: 'center',
  },
});

export default AnimatedCircularProgress;
