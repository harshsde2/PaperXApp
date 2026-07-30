import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ANDROID_BLUR } from '@shared/constants/glass';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@theme/index';
import { getColorWithOpacity } from '@theme/utils/themeHelpers';
import type { IGlassyWrapperProps } from './@types';
import { createStyles } from './styles';

const GlassyWrapper: React.FC<IGlassyWrapperProps> = ({
  children,
  style,
  borderRadius = 20,
  blurAmount = 25,
  blurType = 'light',
  overlayOpacity = 0.12,
  borderWidth = 1,
  borderColor: borderColorProp,
  borderStyle,
  padding = 0,
  showGlossyHighlight = true,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  contentContainerStyle,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const borderColor =
    borderColorProp ?? getColorWithOpacity(theme.colors.white, 60);

  const overlayBackgroundColor = getColorWithOpacity(
    theme.colors.white,
    Math.round(Math.min(1, Math.max(0, overlayOpacity)) * 100),
  );

  const reducedTransparencyFallback = getColorWithOpacity(
    theme.colors.white,
    40,
  );

  const hasBaseGradient =
    Array.isArray(gradientColors) && gradientColors.length >= 2;

  const glossyColors = useMemo(
    () => [
      getColorWithOpacity(theme.colors.white, 50),
      getColorWithOpacity(theme.colors.white, 25),
      getColorWithOpacity(theme.colors.white, 8),
      'transparent',
    ],
    [theme.colors.white],
  );

  const containerStyle = [
    styles.container,
    {
      borderRadius,
      borderWidth,
      borderColor,
      ...(borderStyle ? { borderStyle } : {}),
    },
    style,
  ];

  const contentPaddingStyle = padding > 0 ? { padding } : undefined;

  const blurFillStyle = [StyleSheet.absoluteFill, { borderRadius }];

  const overlayStyle = [styles.overlay, { borderRadius }, { backgroundColor: overlayBackgroundColor }];

  const highlightStyle = [styles.glossyHighlight, { borderRadius }];

  return (
    <View style={containerStyle}>
      <View style={styles.backdrop} pointerEvents="none">
        {hasBaseGradient && (
          <LinearGradient
            colors={gradientColors!}
            start={gradientStart}
            end={gradientEnd}
            style={blurFillStyle}
            pointerEvents="none"
          />
        )}
        <BlurView
          style={blurFillStyle}
          blurType={blurType}
          blurAmount={blurAmount}
          blurRadius={ANDROID_BLUR.blurRadius}
          downsampleFactor={ANDROID_BLUR.downsampleFactor}
          overlayColor={ANDROID_BLUR.overlayColor}
          reducedTransparencyFallbackColor={reducedTransparencyFallback}
        />

        <View style={overlayStyle} pointerEvents="none" />

        {showGlossyHighlight && (
          <LinearGradient
            colors={glossyColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={highlightStyle}
            pointerEvents="none"
          />
        )}
      </View>

      <View
        style={[
          styles.contentWrapper,
          contentPaddingStyle,
          contentContainerStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

export default GlassyWrapper;
