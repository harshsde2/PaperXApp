import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, TextInput } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import type { PriceRangeSliderProps } from './@types';
import { createStyles } from './styles';
import {
  SLIDER_HEIGHT,
  SLIDER_THUMB_RADIUS,
  SLIDER_THUMB_HIT_SIZE,
  SLIDER_TRACK_HEIGHT,
} from './styles';

const RANGE_MIN = 0;
const RANGE_MAX = 1000;
const SPRING_CONFIG = { damping: 18, stiffness: 150 };

function clamp(value: number, low: number, high: number): number {
  'worklet';
  return Math.min(Math.max(value, low), high);
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  rangeMin = RANGE_MIN,
  rangeMax = RANGE_MAX,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const trackWidth = useSharedValue(0);
  const minVal = useSharedValue(rangeMin);
  const maxVal = useSharedValue(rangeMax);

  const parseMin = useMemo(
    () => (): number => {
      const n = parseFloat(minPrice);
      return Number.isFinite(n) ? clamp(n, rangeMin, rangeMax) : rangeMin;
    },
    [minPrice, rangeMin, rangeMax],
  );
  const parseMax = useMemo(
    () => (): number => {
      const n = parseFloat(maxPrice);
      return Number.isFinite(n) ? clamp(n, rangeMin, rangeMax) : rangeMax;
    },
    [maxPrice, rangeMin, rangeMax],
  );

  useEffect(() => {
    minVal.value = withSpring(parseMin(), SPRING_CONFIG);
    maxVal.value = withSpring(parseMax(), SPRING_CONFIG);
  }, [minPrice, maxPrice, parseMin, parseMax, minVal, maxVal]);

  const onLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number } } }) => {
      const w = e.nativeEvent.layout.width;
      if (w > 0) {
        setLayoutWidth(w);
        trackWidth.value = w;
      }
    },
    [trackWidth],
  );

  const startMin = useSharedValue(rangeMin);
  const startMax = useSharedValue(rangeMax);

  const panMin = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startMin.value = minVal.value;
        })
        .onUpdate((e) => {
          const w = trackWidth.value;
          if (w <= 0) return;
          const range = rangeMax - rangeMin;
          const newVal = startMin.value + (e.translationX / w) * range;
          const clamped = clamp(newVal, rangeMin, maxVal.value - 1);
          minVal.value = clamped;
          runOnJS(onMinChange)(String(Math.round(clamped)));
        }),
    [trackWidth, minVal, maxVal, startMin, rangeMin, rangeMax, onMinChange],
  );

  const panMax = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startMax.value = maxVal.value;
        })
        .onUpdate((e) => {
          const w = trackWidth.value;
          if (w <= 0) return;
          const range = rangeMax - rangeMin;
          const newVal = startMax.value + (e.translationX / w) * range;
          const clamped = clamp(newVal, minVal.value + 1, rangeMax);
          maxVal.value = clamped;
          runOnJS(onMaxChange)(String(Math.round(clamped)));
        }),
    [trackWidth, minVal, maxVal, startMax, rangeMin, rangeMax, onMaxChange],
  );

  const range = rangeMax - rangeMin;
  const thumbMinStyle = useAnimatedStyle(() => {
    const w = trackWidth.value;
    if (w <= 0) return { left: 0 };
    const centerX = (minVal.value / range) * w;
    return { left: centerX - SLIDER_THUMB_HIT_SIZE / 2 };
  });

  const thumbMaxStyle = useAnimatedStyle(() => {
    const w = trackWidth.value;
    if (w <= 0) return { left: 0 };
    const centerX = (maxVal.value / range) * w;
    return { left: centerX - SLIDER_THUMB_HIT_SIZE / 2 };
  });

  const activeSegmentStyle = useAnimatedStyle(() => {
    const w = trackWidth.value;
    if (w <= 0) return { left: 0, width: 0 };
    const minX = (minVal.value / range) * w;
    const maxX = (maxVal.value / range) * w;
    return {
      left: minX,
      width: maxX - minX,
    };
  });

  const trackBg = theme.colors.border.primary;
  const trackActive = theme.colors.primary[300];
  const minThumbColor = theme.colors.primary[600];
  const maxThumbColor = theme.colors.primary[600];
  const thumbBorderColor = theme.colors.secondary[300];

  const canvasWidth = Math.max(layoutWidth, 1);

  return (
    <View style={styles.container}>
      <View style={styles.sliderRow}>
        <View style={styles.trackWrapper} collapsable={false} onLayout={onLayout}>
          {layoutWidth > 0 && (
            <Canvas
              style={{ width: layoutWidth, height: SLIDER_HEIGHT }}
            >
              <RoundedRect
                x={0}
                y={(SLIDER_HEIGHT - SLIDER_TRACK_HEIGHT) / 2}
                width={canvasWidth}
                height={SLIDER_TRACK_HEIGHT}
                r={SLIDER_TRACK_HEIGHT / 2}
                color={trackBg}
              />
            </Canvas>
          )}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                top: (SLIDER_HEIGHT - SLIDER_TRACK_HEIGHT) / 2,
                height: SLIDER_TRACK_HEIGHT,
                borderRadius: SLIDER_TRACK_HEIGHT / 2,
                backgroundColor: trackActive,
              },
              activeSegmentStyle,
            ]}
          />
          {/* Max thumb first (below), then min thumb on top so both are easy to grab */}
          <GestureDetector gesture={panMax}>
            <Animated.View style={[styles.thumbHitArea, thumbMaxStyle]}>
              <View
                style={[
                  styles.thumb,
                  {
                    backgroundColor: maxThumbColor,
                    borderWidth: 3,
                    borderColor: thumbBorderColor,
                  },
                ]}
              />
            </Animated.View>
          </GestureDetector>
          <GestureDetector gesture={panMin}>
            <Animated.View style={[styles.thumbHitArea, thumbMinStyle]}>
              <View
                style={[
                  styles.thumb,
                  {
                    backgroundColor: minThumbColor,
                    borderWidth: 3,
                    borderColor: thumbBorderColor,
                  },
                ]}
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
      <View style={styles.inputsRow}>
        <View style={styles.inputGroup}>
          <Text variant="captionSmall" style={styles.inputLabel}>
            Min
          </Text>
          <TextInput
            style={styles.rangeInput}
            placeholder={String(rangeMin)}
            placeholderTextColor={theme.colors.text.tertiary}
            value={minPrice}
            onChangeText={onMinChange}
            keyboardType="numeric"
          />
        </View>
        <Text variant="bodyMedium" style={styles.rangeSeparator}>
          to
        </Text>
        <View style={styles.inputGroup}>
          <Text variant="captionSmall" style={styles.inputLabel}>
            Max
          </Text>
          <TextInput
            style={styles.rangeInput}
            placeholder={String(rangeMax)}
            placeholderTextColor={theme.colors.text.tertiary}
            value={maxPrice}
            onChangeText={onMaxChange}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
};
