import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import BootSplash from 'react-native-bootsplash';
import { useTheme } from '@theme';
import { AppIcon } from '@assets/svgs';
import type { AnimatedSplashV2Props } from './@types';
import { createStyles } from './styles';
import {
  BADGE_HEIGHT,
  BADGE_WIDTH,
  BOOT_SPLASH_HIDE_DELAY,
  BRAND_WORD,
  CURSOR_SETTLE_DURATION,
  DOT_FADE_INTO_RADIAL_MS,
  DOT_SCALE_AT_EDGE_MAX,
  DOT_SCALE_AT_EDGE_MIN,
  DOT_SCALE_AT_REST,
  END_CARD_DURATION,
  HOLE_FADE_BEFORE_LETTERS_MS,
  HOLE_TO_DOT_DURATION,
  INTRO_DOT_CENTER_BIAS_X,
  INTRO_DOT_EDGE_INSET_RATIO,
  INTRO_DOT_LEFT,
  INTRO_DOT_SIZE,
  INTRO_DOT_TOP,
  LETTER_STEP_DURATION,
  LOGO_MARK_SIZE,
  LOGO_REVEAL_DURATION,
  MODULE1_DROP_MS,
  MODULE1_DROP_OVERSHOOT_PX,
  MODULE1_DROP_OVERSHOOT_SPLIT,
  MODULE1_SLIDE_MS,
  OUTRO_FADE_DURATION,
  RADIAL_EXPAND_DURATION,
  RADIAL_INITIAL_R_MIN,
  RADIAL_OVERLAP_MS,
  SPLASH_V2_MODULE1_ONLY,
} from './constants';
import LetterReveal from './LetterReveal';

const MODULE1_ONLY_OUTRO_MS = 520;

const getRadialMaxR = (w: number, h: number): number => {
  const cx = w;
  const cy = h / 2;
  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  let maxD = 0;
  for (const [x, y] of corners) {
    const d = Math.hypot(x - cx, y - cy);
    if (d > maxD) maxD = d;
  }
  return maxD + 32;
};

const AnimatedSplashV2 = ({ onAnimationEnd }: AnimatedSplashV2Props) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width, height } = useWindowDimensions();
  const centerX = width / 2;
  const centerY = height / 2;
  const Rmax = useMemo(() => getRadialMaxR(width, height), [width, height]);

  const module1Layout = useMemo(() => {
    const dotScaleAtEdge = Math.min(
      DOT_SCALE_AT_EDGE_MAX,
      Math.max(DOT_SCALE_AT_EDGE_MIN, height / (5.8 * INTRO_DOT_SIZE)),
    );
    const centerDotX = centerX - INTRO_DOT_SIZE / 2 + INTRO_DOT_CENTER_BIAS_X;
    const centerDotY = centerY - INTRO_DOT_SIZE / 2;
    const endDotLeft = Math.max(
      0,
      width - INTRO_DOT_SIZE * dotScaleAtEdge * INTRO_DOT_EDGE_INSET_RATIO,
    );
    const radialHandoffR = Math.max(
      RADIAL_INITIAL_R_MIN,
      (INTRO_DOT_SIZE * dotScaleAtEdge) / 2 * 0.55,
    );
    return {
      centerDotX,
      centerDotY,
      endDotLeft,
      dotScaleAtEdge,
      radialHandoffR,
    };
  }, [width, height, centerX, centerY]);
  const holeBase = Math.max(width, height) * 0.95;
  const letters = useMemo(() => [...BRAND_WORD], []);
  const primaryHex = theme.colors.primary.DEFAULT;

  const dotX = useSharedValue(INTRO_DOT_LEFT);
  const dotY = useSharedValue(INTRO_DOT_TOP);
  const introDotOpacity = useSharedValue(1);
  const radialR = useSharedValue(0);
  const radialDiskOpacity = useSharedValue(1);
  const shellOpacity = useSharedValue(0);
  const whiteBaseOpacity = useSharedValue(1);
  const holeScale = useSharedValue(1);
  const holeLayerOpacity = useSharedValue(1);
  const letterProgress = useSharedValue(0);
  const logoProgress = useSharedValue(0);
  const collapseProgress = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);
  const letterInk = theme.colors.text.inverse;
  const idleBg = theme.colors.background.primary;
  const endSurfaceBg = theme.colors.surface.primary;

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, BOOT_SPLASH_HIDE_DELAY);

    const t0 = BOOT_SPLASH_HIDE_DELAY;
    const dropSplit = MODULE1_DROP_MS * MODULE1_DROP_OVERSHOOT_SPLIT;
    const dropSettle = MODULE1_DROP_MS - dropSplit;

    const { centerDotX, centerDotY, endDotLeft, radialHandoffR } = module1Layout;
    const overshootY = centerDotY + MODULE1_DROP_OVERSHOOT_PX;

    const radialStart = Math.max(
      0,
      t0 + MODULE1_DROP_MS + MODULE1_SLIDE_MS - RADIAL_OVERLAP_MS,
    );

    dotX.value = withDelay(
      t0,
      withSequence(
        withTiming(centerDotX, {
          duration: MODULE1_DROP_MS,
          easing: Easing.bezier(0.34, 0.02, 0.64, 1),
        }),
        withTiming(endDotLeft, {
          duration: MODULE1_SLIDE_MS,
          easing: Easing.inOut(Easing.cubic),
        }),
      ),
    );
    dotY.value = withDelay(
      t0,
      withSequence(
        withTiming(overshootY, {
          duration: dropSplit,
          easing: Easing.bezier(0.55, 0, 0.9, 0.45),
        }),
        withTiming(centerDotY, {
          duration: dropSettle,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(centerDotY, {
          duration: MODULE1_SLIDE_MS,
          easing: Easing.linear,
        }),
      ),
    );

    introDotOpacity.value = withDelay(
      radialStart,
      withTiming(0, {
        duration: DOT_FADE_INTO_RADIAL_MS,
        easing: Easing.out(Easing.quad),
      }),
    );

    const radialEaseInMs = Math.min(120, Math.round(RADIAL_EXPAND_DURATION * 0.14));
    const radialGrowMs = RADIAL_EXPAND_DURATION - radialEaseInMs;
    radialR.value = withDelay(
      radialStart,
      withSequence(
        withTiming(radialHandoffR, {
          duration: radialEaseInMs,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(Rmax, {
          duration: radialGrowMs,
          easing: Easing.bezier(0.45, 0, 0.15, 1),
        }),
      ),
    );

    if (SPLASH_V2_MODULE1_ONLY) {
      const fadeOutAt = radialStart + RADIAL_EXPAND_DURATION + 280;
      overlayOpacity.value = withDelay(
        fadeOutAt,
        withTiming(
          0,
          {
            duration: MODULE1_ONLY_OUTRO_MS,
            easing: Easing.in(Easing.cubic),
          },
          (finished) => {
            if (finished) {
              runOnJS(onAnimationEnd)();
            }
          },
        ),
      );
      return () => clearTimeout(bootTimer);
    }

    const holeStart = radialStart + RADIAL_EXPAND_DURATION;
    const letterStart =
      holeStart + 40 + HOLE_TO_DOT_DURATION + CURSOR_SETTLE_DURATION;
    const letterDuration = BRAND_WORD.length * LETTER_STEP_DURATION;
    const logoStart = letterStart + letterDuration * 0.45;
    const collapseStart = letterStart + letterDuration + 240;
    const fadeStart = collapseStart + END_CARD_DURATION;

    radialDiskOpacity.value = withDelay(
      holeStart,
      withTiming(0, { duration: 50, easing: Easing.linear }),
    );
    shellOpacity.value = withDelay(
      holeStart,
      withTiming(1, { duration: 50, easing: Easing.linear }),
    );
    whiteBaseOpacity.value = withDelay(
      holeStart,
      withTiming(0, { duration: 50, easing: Easing.linear }),
    );

    holeScale.value = withDelay(
      holeStart + 60,
      withTiming(0.05, {
        duration: HOLE_TO_DOT_DURATION,
        easing: Easing.inOut(Easing.cubic),
      }),
    );

    holeLayerOpacity.value = withDelay(
      Math.max(0, letterStart - HOLE_FADE_BEFORE_LETTERS_MS),
      withTiming(0, { duration: 160, easing: Easing.out(Easing.quad) }),
    );

    letterProgress.value = withDelay(
      letterStart,
      withTiming(BRAND_WORD.length, {
        duration: letterDuration,
        easing: Easing.linear,
      }),
    );

    logoProgress.value = withDelay(
      logoStart,
      withTiming(1, {
        duration: LOGO_REVEAL_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );

    collapseProgress.value = withDelay(
      collapseStart,
      withTiming(1, {
        duration: END_CARD_DURATION,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    );

    overlayOpacity.value = withDelay(
      fadeStart,
      withTiming(
        0,
        {
          duration: OUTRO_FADE_DURATION,
          easing: Easing.in(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(onAnimationEnd)();
          }
        },
      ),
    );

    return () => clearTimeout(bootTimer);
  }, [Rmax, module1Layout, onAnimationEnd]);

  const whiteBaseStyle = useAnimatedStyle(() => ({
    opacity: whiteBaseOpacity.value,
  }));

  const morphShellStyle = useAnimatedStyle(() => {
    'worklet';
    const p = collapseProgress.value;
    const bx = (width - BADGE_WIDTH) / 2;
    const by = (height - BADGE_HEIGHT) / 2;
    return {
      position: 'absolute',
      left: interpolate(p, [0, 1], [0, bx], Extrapolation.CLAMP),
      top: interpolate(p, [0, 1], [0, by], Extrapolation.CLAMP),
      width: interpolate(p, [0, 1], [width, BADGE_WIDTH], Extrapolation.CLAMP),
      height: interpolate(p, [0, 1], [height, BADGE_HEIGHT], Extrapolation.CLAMP),
      borderRadius: interpolate(p, [0, 1], [0, 16], Extrapolation.CLAMP),
      backgroundColor: primaryHex,
      opacity: shellOpacity.value,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    };
  });

  const radialStyle = useAnimatedStyle(() => {
    const r = radialR.value;
    return {
      width: r * 2,
      height: r * 2,
      borderRadius: r,
      left: width - r * 2,
      top: centerY - r,
      opacity: radialDiskOpacity.value,
    };
  });

  const introDotWrapperStyle = useAnimatedStyle(() => ({
    left: dotX.value,
    top: dotY.value,
    opacity: introDotOpacity.value,
  }));

  const { centerDotX, endDotLeft, dotScaleAtEdge } = module1Layout;

  const introDotInnerStyle = useAnimatedStyle(() => {
    'worklet';
    const half = INTRO_DOT_SIZE / 2;
    const x = dotX.value;
    const span = endDotLeft - centerDotX;
    let s = DOT_SCALE_AT_REST;
    if (span > 0.5 && x >= centerDotX - 0.001) {
      const t = (x - centerDotX) / span;
      s = interpolate(
        t,
        [0, 1],
        [DOT_SCALE_AT_REST, dotScaleAtEdge],
        Extrapolation.CLAMP,
      );
    }
    return {
      transform: [
        { translateX: half },
        { translateY: half },
        { scale: s },
        { translateX: -half },
        { translateY: -half },
      ],
    };
  }, [centerDotX, endDotLeft, dotScaleAtEdge]);

  const holeStyle = useAnimatedStyle(() => ({
    width: holeBase,
    height: holeBase,
    borderRadius: holeBase / 2,
    transform: [{ scale: holeScale.value }],
  }));

  const holeLayerStyle = useAnimatedStyle(() => ({
    opacity: holeLayerOpacity.value,
  }));

  const brandClusterStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      letterProgress.value,
      [0, 0.008],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const logoMarkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      logoProgress.value,
      [0, 0.35, 1],
      [0, 0.95, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          logoProgress.value,
          [0, 1],
          [8, 0],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          logoProgress.value,
          [0, 1],
          [0.94, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const rootBgStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      backgroundColor: interpolateColor(
        collapseProgress.value,
        [0, 0.2, 1],
        [idleBg, endSurfaceBg, endSurfaceBg],
      ),
    };
  });

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <Animated.View style={[styles.root, rootBgStyle, overlayStyle]}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: theme.colors.background.primary },
          whiteBaseStyle,
        ]}
      />
      {!SPLASH_V2_MODULE1_ONLY && (
        <Animated.View style={[styles.morphShell, morphShellStyle]}>
          <Animated.View style={[styles.morphContent, brandClusterStyle]}>
            <View style={styles.logoRow}>
              <Animated.View style={logoMarkStyle}>
                <AppIcon.ZupplyLogo width={LOGO_MARK_SIZE} height={LOGO_MARK_SIZE} />
              </Animated.View>
              <View style={styles.lettersRow}>
                {letters.map((ch, i) => (
                  <LetterReveal
                    key={`${ch}-${i}`}
                    index={i}
                    progress={letterProgress}
                    color={letterInk}
                  >
                    {ch}
                  </LetterReveal>
                ))}
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      )}
      <Animated.View style={[styles.disk, radialStyle]} />
      {!SPLASH_V2_MODULE1_ONLY && (
        <Animated.View style={[styles.holeLayer, holeLayerStyle]} pointerEvents="none">
          <Animated.View style={[styles.hole, holeStyle]} />
        </Animated.View>
      )}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: INTRO_DOT_SIZE,
            height: INTRO_DOT_SIZE,
            justifyContent: 'center',
            alignItems: 'center',
          },
          introDotWrapperStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: INTRO_DOT_SIZE,
              height: INTRO_DOT_SIZE,
              borderRadius: INTRO_DOT_SIZE / 2,
              backgroundColor: theme.colors.primary.DEFAULT,
            },
            introDotInnerStyle,
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedSplashV2;
