import React, { useEffect, useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  Canvas,
  Group,
  Rect,
  Path as SkiaPath,
  Skia,
} from '@shopify/react-native-skia';
import BootSplash from 'react-native-bootsplash';
import { AppIcon } from '@assets/svgs';
import type { AnimatedSplashProps, ParticleData } from './@types';
import { styles } from './styles';
import {
  BOOTSPLASH_BACKGROUND,
  BOOT_SPLASH_HIDE_DELAY,
  PARTICLE_START_DELAY,
  PARTICLE_DURATION,
  LOGO_REVEAL_DELAY,
  LOGO_REVEAL_DURATION,
  FADE_OUT_DURATION,
  FADE_OUT_START,
  TEXT_REVEAL_DELAY,
  TEXT_REVEAL_DURATION,
  PARTICLE_COUNT,
  PARTICLE_MIN_DISTANCE,
  PARTICLE_MAX_DISTANCE,
  PARTICLE_MIN_SPIRAL_TURNS,
  PARTICLE_MAX_SPIRAL_TURNS,
  PARTICLE_MIN_RADIUS,
  PARTICLE_MAX_RADIUS,
  PARTICLE_COLORS,
  LOGO_SIZE,
  LOGO_REVEAL_STROKE_WIDTH,
  LOGO_REVEAL_ROWS,
} from './constants';
import Particle from './Particle';

const generateParticles = (): ParticleData[] => {
  const result: ParticleData[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const startAngle = Math.random() * Math.PI * 2;
    const startDistance =
      PARTICLE_MIN_DISTANCE +
      Math.random() * (PARTICLE_MAX_DISTANCE - PARTICLE_MIN_DISTANCE);
    const spiralTurns =
      PARTICLE_MIN_SPIRAL_TURNS +
      Math.random() * (PARTICLE_MAX_SPIRAL_TURNS - PARTICLE_MIN_SPIRAL_TURNS);
    result.push({
      startAngle,
      startDistance,
      spiralTurns,
      radius:
        PARTICLE_MIN_RADIUS +
        Math.random() * (PARTICLE_MAX_RADIUS - PARTICLE_MIN_RADIUS),
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    });
  }
  return result;
};

const buildSerpentinePath = () => {
  const path = Skia.Path.Make();
  const rowHeight = LOGO_SIZE / LOGO_REVEAL_ROWS;

  for (let row = 0; row < LOGO_REVEAL_ROWS; row++) {
    const y = rowHeight * row + rowHeight / 2;
    const isEvenRow = row % 2 === 0;

    if (row === 0) {
      path.moveTo(isEvenRow ? 0 : LOGO_SIZE, y);
    } else {
      path.lineTo(isEvenRow ? 0 : LOGO_SIZE, y);
    }
    path.lineTo(isEvenRow ? LOGO_SIZE : 0, y);
  }

  return path;
};

const AnimatedSplash = ({ onAnimationEnd }: AnimatedSplashProps) => {
  const { width, height } = useWindowDimensions();
  const centerX = width / 2;
  const centerY = height / 2;

  const particleProgress = useSharedValue(0);
  const revealProgress = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(0);

  const particles = useMemo(generateParticles, []);
  const serpentinePath = useMemo(buildSerpentinePath, []);

  const revealEnd = useDerivedValue(() => revealProgress.value);

  useEffect(() => {
    const bootSplashTimer = setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, BOOT_SPLASH_HIDE_DELAY);

    // Safety net: force-dismiss splash after max duration in case worklet callback never fires
    const fallbackTimer = setTimeout(() => {
      onAnimationEnd();
    }, FADE_OUT_START + FADE_OUT_DURATION + 800);

    particleProgress.value = withDelay(
      PARTICLE_START_DELAY,
      withTiming(1, {
        duration: PARTICLE_DURATION,
        easing: Easing.inOut(Easing.cubic),
      }),
    );

    revealProgress.value = withDelay(
      LOGO_REVEAL_DELAY,
      withTiming(1, {
        duration: LOGO_REVEAL_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );

    textOpacity.value = withDelay(
      TEXT_REVEAL_DELAY,
      withTiming(1, {
        duration: TEXT_REVEAL_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );

    overlayOpacity.value = withDelay(
      FADE_OUT_START,
      withTiming(
        0,
        { duration: FADE_OUT_DURATION, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(onAnimationEnd)();
          }
        },
      ),
    );

    return () => {
      clearTimeout(bootSplashTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, overlayAnimatedStyle]}>
      {particles.map((particle, index) => (
        <Particle
          key={index}
          progress={particleProgress}
          data={particle}
          centerX={centerX}
          centerY={centerY}
        />
      ))}

      <View style={styles.logoRevealClip}>
        <AppIcon.ZupplyLogo width={LOGO_SIZE} height={LOGO_SIZE} />
        <Canvas style={styles.skiaLogoCanvas}>
          <Group layer>
            <Rect
              x={0}
              y={0}
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              color={BOOTSPLASH_BACKGROUND}
            />
            <SkiaPath
              path={serpentinePath}
              style="stroke"
              strokeWidth={LOGO_REVEAL_STROKE_WIDTH}
              strokeCap="round"
              strokeJoin="round"
              blendMode="clear"
              color="white"
              start={0}
              end={revealEnd}
            />
          </Group>
        </Canvas>
      </View>

      <Animated.Text style={[styles.poweredBy, textAnimatedStyle]}>
        Powered by SPNP Paper and Pack
      </Animated.Text>
    </Animated.View>
  );
};

export default AnimatedSplash;
