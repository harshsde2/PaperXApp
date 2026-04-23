import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@theme/index';
import type { SkeletonProps } from './@types';
import { createStyles } from './styles';

const LIGHT_BONE_COLOR = '#E1E9EE';
const LIGHT_HIGHLIGHT_COLOR = '#F2F8FC';
const DARK_BONE_COLOR = '#2A2A2A';
const DARK_HIGHLIGHT_COLOR = '#3A3A3A';
const DEFAULT_SHIMMER_WIDTH = 120;

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  style,
  children,
  testID,
}) => {
  const theme = useTheme();
  const [measuredWidth, setMeasuredWidth] = useState<number>(typeof width === 'number' ? width : 0);

  const effectiveRadius = borderRadius ?? theme.borderRadius.md;
  const boneColor = theme.mode === 'dark' ? DARK_BONE_COLOR : LIGHT_BONE_COLOR;
  const highlightColor = theme.mode === 'dark' ? DARK_HIGHLIGHT_COLOR : LIGHT_HIGHLIGHT_COLOR;
  const shimmerWidth = Math.max(DEFAULT_SHIMMER_WIDTH, measuredWidth * 0.45 || DEFAULT_SHIMMER_WIDTH);
  const animationTravel = measuredWidth + shimmerWidth;

  const styles = createStyles({
    theme,
    height,
    width,
    borderRadius: effectiveRadius,
    boneColor,
    shimmerColor: highlightColor,
    shimmerWidth,
  });

  const translateX = useSharedValue(-shimmerWidth);

  useEffect(() => {
    if (animationTravel <= 0) {
      return;
    }

    translateX.value = -shimmerWidth;
    translateX.value = withRepeat(
      withTiming(animationTravel, {
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, [animationTravel, shimmerWidth, translateX]);

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const linearColors = useMemo(
    () => ['transparent', highlightColor, 'transparent'],
    [highlightColor]
  );

  return (
    <View
      testID={testID}
      style={[styles.container, style]}
      onLayout={typeof width === 'string' ? (event) => setMeasuredWidth(event.nativeEvent.layout.width) : undefined}
      accessibilityLabel="Loading content"
      accessibilityRole="progressbar"
    >
      <View style={styles.placeholderOverlay} />
      <Animated.View style={[styles.shimmerTrack, shimmerAnimatedStyle]}>
        <LinearGradient
          colors={linearColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
      {children ? <View style={styles.childContainer}>{children}</View> : null}
    </View>
  );
};

export default Skeleton;
