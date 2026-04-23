import React, { useEffect, useMemo, useRef } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  Line,
  Path,
  RoundedRect,
  Skia,
  Text as SkiaText,
  matchFont,
  rect,
  rrect,
  vec,
} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { SplashScreenAnimationProps } from './@types';
import { createStyles } from './styles';
import {
  BASE_H,
  BASE_W,
  BASKET,
  BRAND_WORD,
  CARD,
  CHECK_PATH,
  CIRCLE_A,
  CIRCLE_B,
  CIRCLE_C,
  COLORS,
  PHASE_DELAYS,
  PHONE_RIM,
  PHONE_SCREEN,
  PHONE_SHELL,
  TEAL_DOT,
} from './constants';

const BASKET_APEX_OFFSET = 133.588;

const SplashScreenAnimation = ({ onFinish }: SplashScreenAnimationProps) => {
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => createStyles(), []);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sx = width / BASE_W;
  const sy = height / BASE_H;
  const sMin = Math.min(sx, sy);

  const tealDotY = useSharedValue(TEAL_DOT.startY);
  const tealDotScaleY = useSharedValue(1);
  const tealDotOpacity = useSharedValue(1);

  const circleACX = useSharedValue(CIRCLE_A.initCX);
  const circleARadius = useSharedValue(CIRCLE_A.initR);
  const circleAOpacity = useSharedValue(1);

  const circleBCX = useSharedValue(CIRCLE_B.initCX);
  const circleBCY = useSharedValue(CIRCLE_B.initCY);
  const circleBRadius = useSharedValue(CIRCLE_B.initR);
  const circleBOpacity = useSharedValue(0);

  const basketX = useSharedValue(BASKET.initX);
  const basketOpacity = useSharedValue(1);

  const trimProgress = useSharedValue(0);

  const circleCRadius = useSharedValue(CIRCLE_C.initR);
  const circleCScaleY = useSharedValue(1);
  const circleCOpacity = useSharedValue(0);

  const cardOpacity = useSharedValue(0);

  const shellX = (BASE_W - PHONE_SHELL.width) / 2;
  const shellY = (BASE_H - PHONE_SHELL.height) / 2;
  const rimX = (BASE_W - PHONE_RIM.width) / 2;
  const rimY = (BASE_H - PHONE_RIM.height) / 2;
  const screenBoxX = (BASE_W - PHONE_SCREEN.width) / 2;
  const screenBoxY = (BASE_H - PHONE_SCREEN.height) / 2;

  const clipRRect = useMemo(
    () =>
      rrect(
        rect(
          screenBoxX * sx,
          screenBoxY * sy,
          PHONE_SCREEN.width * sx,
          PHONE_SCREEN.height * sy,
        ),
        PHONE_SCREEN.radius * sMin,
        PHONE_SCREEN.radius * sMin,
      ),
    [sx, sy, sMin, screenBoxX, screenBoxY],
  );

  const dotRectX = useDerivedValue(
    () => (TEAL_DOT.startX - TEAL_DOT.size / 2) * sx,
  );
  const dotRectY = useDerivedValue(() => {
    const scaledH = TEAL_DOT.size * sMin * tealDotScaleY.value;
    return tealDotY.value * sy - scaledH / 2;
  });
  const dotRectWidth = useDerivedValue(() => TEAL_DOT.size * sMin);
  const dotRectHeight = useDerivedValue(
    () => TEAL_DOT.size * sMin * tealDotScaleY.value,
  );
  const dotRectRadius = useDerivedValue(() => TEAL_DOT.radius * sMin);
  const dotOpacity = useDerivedValue(() => tealDotOpacity.value);

  const circleACXScaled = useDerivedValue(() => circleACX.value * sx);
  const circleACYScaled = useDerivedValue(() => CIRCLE_A.initCY * sy);
  const circleARScaled = useDerivedValue(() => circleARadius.value * sMin);
  const circleAOpacityD = useDerivedValue(() => circleAOpacity.value);

  const circleBCXScaled = useDerivedValue(() => circleBCX.value * sx);
  const circleBCYScaled = useDerivedValue(() => circleBCY.value * sy);
  const circleBRScaled = useDerivedValue(() => circleBRadius.value * sMin);
  const circleBOpacityD = useDerivedValue(() => circleBOpacity.value);

  const circleCCXScaled = useDerivedValue(() => CIRCLE_C.cx * sx);
  const circleCCYScaled = useDerivedValue(() => CIRCLE_C.cy * sy);
  const circleCRScaled = useDerivedValue(() => circleCRadius.value * sMin);
  const circleCOpacityD = useDerivedValue(() => circleCOpacity.value);

  const circleCTransform = useDerivedValue(() => [
    { translateX: CIRCLE_C.cx * sx },
    { translateY: CIRCLE_C.cy * sy },
    { scaleY: circleCScaleY.value },
    { translateX: -CIRCLE_C.cx * sx },
    { translateY: -CIRCLE_C.cy * sy },
  ]);

  const basketApex = useDerivedValue(
    () => (basketX.value + BASKET_APEX_OFFSET) * sx,
  );
  const basketCY = BASKET.cy * sy;
  const basketTopY = (BASKET.cy - 28) * sy;
  const basketBottomY = (BASKET.cy + 28) * sy;

  const basketLeftPoleP1 = useDerivedValue(() =>
    vec(
      (basketX.value + BASKET_APEX_OFFSET - 14) * sx,
      basketTopY,
    ),
  );
  const basketLeftPoleP2 = useDerivedValue(() =>
    vec(basketApex.value, basketCY),
  );
  const basketRightPoleP1 = useDerivedValue(() =>
    vec(
      (basketX.value + BASKET_APEX_OFFSET + 14) * sx,
      basketTopY,
    ),
  );
  const basketRightPoleP2 = useDerivedValue(() =>
    vec(basketApex.value, basketCY),
  );
  const basketNetP1 = useDerivedValue(() =>
    vec(basketApex.value, basketCY),
  );
  const basketNetP2 = useDerivedValue(() =>
    vec(basketApex.value, basketBottomY),
  );

  const netDiag1P1 = useDerivedValue(() =>
    vec(
      (basketX.value + BASKET_APEX_OFFSET - 6) * sx,
      (BASKET.cy + 6) * sy,
    ),
  );
  const netDiag1P2 = useDerivedValue(() =>
    vec(
      (basketX.value + BASKET_APEX_OFFSET + 6) * sx,
      (BASKET.cy + 12) * sy,
    ),
  );
  const netDiag2P1 = useDerivedValue(() =>
    vec(
      (basketX.value + BASKET_APEX_OFFSET - 5) * sx,
      (BASKET.cy + 14) * sy,
    ),
  );
  const netDiag2P2 = useDerivedValue(() =>
    vec(
      (basketX.value + BASKET_APEX_OFFSET + 5) * sx,
      (BASKET.cy + 20) * sy,
    ),
  );
  const netDiag3P1 = useDerivedValue(() =>
    vec(
      (basketX.value + BASKET_APEX_OFFSET - 4) * sx,
      (BASKET.cy + 22) * sy,
    ),
  );
  const netDiag3P2 = useDerivedValue(() =>
    vec(
      (basketX.value + BASKET_APEX_OFFSET + 4) * sx,
      (BASKET.cy + 27) * sy,
    ),
  );
  const basketOpacityD = useDerivedValue(() => basketOpacity.value);

  const checkPath = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(CHECK_PATH.seg1Start.x * sx, CHECK_PATH.seg1Start.y * sy);
    p.lineTo(CHECK_PATH.midPoint.x * sx, CHECK_PATH.midPoint.y * sy);
    p.moveTo(CHECK_PATH.seg2Start.x * sx, CHECK_PATH.seg2Start.y * sy);
    p.lineTo(CHECK_PATH.midPoint.x * sx, CHECK_PATH.midPoint.y * sy);
    p.lineTo(CHECK_PATH.tailEnd.x * sx, CHECK_PATH.tailEnd.y * sy);
    return p;
  }, [sx, sy]);

  const checkEnd = useDerivedValue(() => trimProgress.value);

  const cardX = (CARD.centerX - CARD.width / 2) * sx;
  const cardY = (CARD.centerY - CARD.height / 2) * sy;
  const cardOpacityD = useDerivedValue(() => cardOpacity.value);

  const brandFont = useMemo(() => {
    const fontFamily = Platform.select({
      ios: 'Helvetica',
      default: 'sans-serif',
    }) as string;
    return matchFont({
      fontFamily,
      fontSize: 22 * sMin,
      fontStyle: 'normal',
      fontWeight: 'bold',
    });
  }, [sMin]);

  const brandTextWidth = useMemo(
    () => (brandFont ? brandFont.measureText(BRAND_WORD).width : 0),
    [brandFont],
  );
  const brandTextFontSize = 22 * sMin;
  const brandTextX = CARD.centerX * sx - brandTextWidth / 2;
  const brandTextY = CARD.centerY * sy + brandTextFontSize / 3;

  useEffect(() => {
    tealDotY.value = withDelay(
      PHASE_DELAYS.P1_DROP,
      withTiming(TEAL_DOT.landY, {
        duration: PHASE_DELAYS.P1_DURATION,
        easing: Easing.in(Easing.quad),
      }),
    );

    tealDotScaleY.value = withDelay(
      PHASE_DELAYS.P2_BOUNCE,
      withSequence(
        withTiming(0.75, { duration: 0 }),
        withSpring(1, { damping: 10, stiffness: 250 }),
      ),
    );

    circleACX.value = withDelay(
      PHASE_DELAYS.P3A_EXPLODE,
      withSequence(
        withTiming(CIRCLE_A.phase3aTargetCX, {
          duration: PHASE_DELAYS.P3A_DURATION,
          easing: Easing.bezier(0.728, 0, 0.299, 0),
        }),
        withTiming(CIRCLE_A.phase3bTargetCX, {
          duration: PHASE_DELAYS.P3B_DURATION,
          easing: Easing.bezier(0.667, 1, 0.333, 0),
        }),
      ),
    );
    circleARadius.value = withDelay(
      PHASE_DELAYS.P3A_EXPLODE,
      withSequence(
        withTiming(CIRCLE_A.phase3aTargetR, {
          duration: PHASE_DELAYS.P3A_DURATION,
          easing: Easing.bezier(0.728, 0, 0.299, 0),
        }),
        withTiming(CIRCLE_A.phase3bTargetR, {
          duration: PHASE_DELAYS.P3B_DURATION,
          easing: Easing.bezier(0.667, 1, 0.333, 0),
        }),
      ),
    );
    circleAOpacity.value = withDelay(
      PHASE_DELAYS.P3A_HIDE,
      withTiming(0, { duration: 0 }),
    );
    tealDotOpacity.value = withDelay(
      PHASE_DELAYS.P3A_EXPLODE,
      withTiming(0, { duration: 0 }),
    );

    const bOpacityHoldMs =
      PHASE_DELAYS.P8_FADE_START -
      PHASE_DELAYS.CIRCLE_B_OPACITY_START -
      PHASE_DELAYS.CIRCLE_B_OPACITY_DURATION;

    circleBOpacity.value = withDelay(
      PHASE_DELAYS.CIRCLE_B_OPACITY_START,
      withSequence(
        withTiming(1, { duration: PHASE_DELAYS.CIRCLE_B_OPACITY_DURATION }),
        withTiming(1, { duration: bOpacityHoldMs }),
        withTiming(0, { duration: PHASE_DELAYS.P8_FADE_DURATION }),
      ),
    );

    circleBCX.value = withDelay(
      PHASE_DELAYS.P4_BALL_ARRIVES,
      withSequence(
        withTiming(CIRCLE_B.phase4TargetCX, {
          duration: PHASE_DELAYS.P4_DURATION,
          easing: Easing.bezier(0.667, 1, 0.333, 0),
        }),
        withTiming(CIRCLE_B.phase5TargetCX, {
          duration: PHASE_DELAYS.P5_DURATION,
          easing: Easing.bezier(0.667, 1, 0.333, 0),
        }),
        withTiming(CIRCLE_B.phase5TargetCX, {
          duration: PHASE_DELAYS.P5_HOLD_DURATION,
        }),
        withTiming(CIRCLE_B.phase7TargetCX, {
          duration: PHASE_DELAYS.P7_DURATION,
          easing: Easing.bezier(0.833, 0.833, 0.167, 0.167),
        }),
        withTiming(CIRCLE_B.phase8TargetCX, {
          duration: PHASE_DELAYS.P8_DURATION,
          easing: Easing.bezier(1, 1, 0.577, 0),
        }),
      ),
    );

    circleBRadius.value = withDelay(
      PHASE_DELAYS.P4_BALL_ARRIVES,
      withTiming(CIRCLE_B.phase4TargetR, {
        duration: PHASE_DELAYS.P4_DURATION,
        easing: Easing.bezier(0.667, 1, 0.333, 0),
      }),
    );

    basketX.value = withDelay(
      PHASE_DELAYS.P6_BASKET,
      withTiming(BASKET.targetX, {
        duration: PHASE_DELAYS.P6_DURATION,
        easing: Easing.out(Easing.quad),
      }),
    );

    trimProgress.value = withDelay(
      PHASE_DELAYS.P9_CHECK,
      withTiming(1, {
        duration: PHASE_DELAYS.P9_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );

    circleCOpacity.value = withDelay(
      PHASE_DELAYS.P10_SHRINK,
      withTiming(1, { duration: 0 }),
    );
    circleCRadius.value = withDelay(
      PHASE_DELAYS.P10_SHRINK,
      withTiming(CIRCLE_C.finalR, {
        duration: PHASE_DELAYS.P10_DURATION,
        easing: Easing.inOut(Easing.cubic),
      }),
    );
    circleCScaleY.value = withDelay(
      PHASE_DELAYS.P10_SQUEEZE_START,
      withSequence(
        withTiming(0.843, { duration: PHASE_DELAYS.P10_SQUEEZE_DURATION }),
        withTiming(1, { duration: PHASE_DELAYS.P10_SQUEEZE_DURATION }),
      ),
    );

    cardOpacity.value = withDelay(
      PHASE_DELAYS.P11_CARD,
      withTiming(1, { duration: PHASE_DELAYS.P11_DURATION }),
    );
    basketOpacity.value = withDelay(
      PHASE_DELAYS.P11_CARD,
      withTiming(0, { duration: 0 }),
    );

    finishTimerRef.current = setTimeout(() => {
      onFinish?.();
    }, PHASE_DELAYS.TOTAL_DURATION);

    return () => {
      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
      }
    };
  }, [
    basketOpacity,
    basketX,
    cardOpacity,
    circleACX,
    circleAOpacity,
    circleARadius,
    circleBCX,
    circleBOpacity,
    circleBRadius,
    circleCOpacity,
    circleCRadius,
    circleCScaleY,
    onFinish,
    tealDotOpacity,
    tealDotScaleY,
    tealDotY,
    trimProgress,
  ]);

  return (
    <View style={styles.root} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <RoundedRect
          x={0}
          y={0}
          width={width}
          height={height}
          r={0}
          color={COLORS.MED_GREY}
        />

        <RoundedRect
          x={shellX * sx}
          y={shellY * sy}
          width={PHONE_SHELL.width * sx}
          height={PHONE_SHELL.height * sy}
          r={PHONE_SHELL.radius * sMin}
          color={COLORS.DARK_GREY}
        />

        <RoundedRect
          x={rimX * sx}
          y={rimY * sy}
          width={PHONE_RIM.width * sx}
          height={PHONE_RIM.height * sy}
          r={PHONE_RIM.radius * sMin}
          color={COLORS.STEEL_BLUE}
        />

        <RoundedRect
          x={screenBoxX * sx}
          y={screenBoxY * sy}
          width={PHONE_SCREEN.width * sx}
          height={PHONE_SCREEN.height * sy}
          r={PHONE_SCREEN.radius * sMin}
          color={COLORS.LIGHT_GREY}
        />

        <Group clip={clipRRect}>
          <Group opacity={dotOpacity}>
            <RoundedRect
              x={dotRectX}
              y={dotRectY}
              width={dotRectWidth}
              height={dotRectHeight}
              r={dotRectRadius}
              color={COLORS.TEAL}
            />
          </Group>

          <Group opacity={circleAOpacityD}>
            <Circle
              cx={circleACXScaled}
              cy={circleACYScaled}
              r={circleARScaled}
              color={COLORS.TEAL}
            />
          </Group>

          <Group opacity={circleCOpacityD} transform={circleCTransform}>
            <Circle
              cx={circleCCXScaled}
              cy={circleCCYScaled}
              r={circleCRScaled}
              color={COLORS.TEAL}
            />
          </Group>

          <Group opacity={basketOpacityD}>
            <Line
              p1={basketNetP1}
              p2={basketNetP2}
              color={COLORS.OFF_WHITE}
              strokeWidth={5 * sMin}
              strokeCap="round"
              style="stroke"
            />
            <Line
              p1={netDiag1P1}
              p2={netDiag1P2}
              color={COLORS.OFF_WHITE}
              strokeWidth={2 * sMin}
              style="stroke"
            />
            <Line
              p1={netDiag2P1}
              p2={netDiag2P2}
              color={COLORS.OFF_WHITE}
              strokeWidth={2 * sMin}
              style="stroke"
            />
            <Line
              p1={netDiag3P1}
              p2={netDiag3P2}
              color={COLORS.OFF_WHITE}
              strokeWidth={2 * sMin}
              style="stroke"
            />
          </Group>

          <Group opacity={circleBOpacityD}>
            <Circle
              cx={circleBCXScaled}
              cy={circleBCYScaled}
              r={circleBRScaled}
              color={COLORS.LIGHT_GREY}
            />
          </Group>

          <Group opacity={basketOpacityD}>
            <Line
              p1={basketLeftPoleP1}
              p2={basketLeftPoleP2}
              color={COLORS.OFF_WHITE}
              strokeWidth={5 * sMin}
              strokeCap="round"
              style="stroke"
            />
            <Line
              p1={basketRightPoleP1}
              p2={basketRightPoleP2}
              color={COLORS.OFF_WHITE}
              strokeWidth={5 * sMin}
              strokeCap="round"
              style="stroke"
            />
          </Group>

          <Path
            path={checkPath}
            color={COLORS.OFF_WHITE}
            style="stroke"
            strokeWidth={CHECK_PATH.strokeWidth * sMin}
            strokeCap="round"
            strokeJoin="round"
            start={0}
            end={checkEnd}
          />

          <Group opacity={cardOpacityD}>
            <RoundedRect
              x={cardX}
              y={cardY}
              width={CARD.width * sx}
              height={CARD.height * sy}
              r={CARD.radius * sMin}
              color={COLORS.TEAL}
            />
            {brandFont && (
              <SkiaText
                x={brandTextX}
                y={brandTextY}
                text={BRAND_WORD}
                font={brandFont}
                color={COLORS.OFF_WHITE}
              />
            )}
          </Group>
        </Group>
      </Canvas>
    </View>
  );
};

export default SplashScreenAnimation;
