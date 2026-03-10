import React, { memo, useState, useCallback } from 'react';
import {
  Pressable,
  View,
  ActivityIndicator,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type {
  CustomButtonProps,
  CustomButtonVariant,
  CustomButtonSize,
} from './@types';
import { createStyles } from './styles';

const SIZE_TO_TEXT_VARIANT: Record<
  CustomButtonSize,
  'buttonSmall' | 'buttonMedium' | 'buttonLarge'
> = {
  sm: 'buttonSmall',
  md: 'buttonMedium',
  lg: 'buttonLarge',
};

const VARIANT_STYLE_KEY: Record<
  CustomButtonVariant,
  keyof ReturnType<typeof createStyles>
> = {
  primary: 'variantPrimary',
  secondary: 'variantSecondary',
  outline: 'variantOutline',
  ghost: 'variantGhost',
  danger: 'variantDanger',
  success: 'variantSuccess',
  gradient: 'variantGradient',
};

const VARIANT_TEXT_STYLE_KEY: Record<
  CustomButtonVariant,
  keyof ReturnType<typeof createStyles>
> = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  outline: 'textOutline',
  ghost: 'textGhost',
  danger: 'textDanger',
  success: 'textSuccess',
  gradient: 'textGradient',
};

const RIPPLE_DURATION = 450;

export const CustomButton = memo<CustomButtonProps>(function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  activeOpacity = 0.7,
  gradientColors,
  gradientStart,
  gradientEnd,
  pressAnimation = 'water',
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const rippleProgress = useSharedValue(0);

  const isDisabled = disabled || loading;
  const useGradient =
    variant === 'gradient' ||
    (gradientColors != null && gradientColors.length > 0);

  const resolvedGradientColors =
    gradientColors ??
    (variant === 'gradient'
      ? [
          theme.colors.primary[400] as string,
          theme.colors.primary.DEFAULT as string,
        ]
      : null);

  const startX = gradientStart?.x ?? 0;
  const startY = gradientStart?.y ?? 0;
  const endX = gradientEnd?.x ?? 1;
  const endY = gradientEnd?.y ?? 1;

  const variantStyle = useGradient
    ? styles.variantGradient
    : styles[VARIANT_STYLE_KEY[variant]];
  const sizeStyle =
    size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;
  const textColorStyle = isDisabled
    ? styles.textDisabled
    : useGradient
      ? styles.textGradient
      : styles[VARIANT_TEXT_STYLE_KEY[variant]];

  const borderRadius =
    size === 'sm'
      ? theme.borderRadius.button.sm
      : size === 'lg'
        ? theme.borderRadius.button.lg
        : theme.borderRadius.button.md;

  const spinnerColor =
    variant === 'primary' ||
    variant === 'danger' ||
    variant === 'success' ||
    variant === 'gradient'
      ? theme.colors.text.inverse
      : theme.colors.primary.DEFAULT;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout((prev) =>
      prev.width !== width || prev.height !== height ? { width, height } : prev
    );
  }, []);

  const runRipple = useCallback(() => {
    rippleProgress.value = 0;
    rippleProgress.value = withTiming(1, { duration: RIPPLE_DURATION });
  }, [rippleProgress]);

  const handlePressIn = useCallback(() => {
    if (isDisabled || pressAnimation === 'none') return;
    if (pressAnimation === 'water') runRipple();
  }, [isDisabled, pressAnimation, runRipple]);

  const handlePressOut = useCallback(() => {
    // No-op: scaling removed
  }, []);

  const rippleAnimatedStyle = useAnimatedStyle(() => {
    const progress = rippleProgress.value;
    return {
      transform: [{ scale: progress * 2.2 }],
      opacity: 0.35 * (1 - progress),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[styles.fullWidth && fullWidth && styles.fullWidth, style]}
    >
      <Animated.View
        onLayout={handleLayout}
        style={[
          styles.container,
          variantStyle,
          sizeStyle,
          styles.iconGap,
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          { overflow: 'hidden' },
        ]}
      >
        {useGradient && resolvedGradientColors && layout.width > 0 && layout.height > 0 && (
          <View style={[styles.gradientWrapper, { borderRadius }]}>
            <Canvas
              style={[
                StyleSheet.absoluteFill,
                { width: layout.width, height: layout.height },
              ]}
            >
              <RoundedRect
                x={0}
                y={0}
                width={layout.width}
                height={layout.height}
                r={borderRadius}
              >
                <LinearGradient
                  start={vec(layout.width * startX, layout.height * startY)}
                  end={vec(layout.width * endX, layout.height * endY)}
                  colors={resolvedGradientColors}
                />
              </RoundedRect>
            </Canvas>
          </View>
        )}

        {pressAnimation === 'water' && !isDisabled && (
          <Animated.View
            style={[styles.rippleCircle, rippleAnimatedStyle]}
            pointerEvents="none"
          />
        )}

        {loading ? (
          <ActivityIndicator
            size="small"
            color={spinnerColor}
            style={styles.loadingSpinner}
          />
        ) : (
          leftIcon
        )}
        <Text
          variant={SIZE_TO_TEXT_VARIANT[size]}
          style={[textColorStyle, textStyle]}
        >
          {title}
        </Text>
        {!loading && rightIcon}
      </Animated.View>
    </Pressable>
  );
});
