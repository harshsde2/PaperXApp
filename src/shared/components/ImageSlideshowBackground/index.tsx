import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, AccessibilityInfo } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { styles } from './styles';
import type { ImageSlideshowBackgroundProps } from './@types';

const DEFAULT_OVERLAY = [
  'rgba(8,12,24,0.45)',
  'rgba(8,12,24,0.22)',
  'rgba(8,12,24,0.55)',
  'rgba(8,12,24,0.92)',
];

/**
 * Full-screen background that crossfades through a set of photos with a slow
 * Ken Burns zoom and a legibility overlay. All animations use the native driver
 * (opacity + transform) so it stays smooth even with full-HD images.
 */
export const ImageSlideshowBackground: React.FC<ImageSlideshowBackgroundProps> = ({
  images,
  interval = 2500,
  fadeDuration = 800,
  overlayColors = DEFAULT_OVERLAY,
  kenBurns = true,
}) => {
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  // One opacity + scale animated value per image (stable across renders).
  const opacities = useRef(images.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
  const scales = useRef(images.map(() => new Animated.Value(1))).current;

  // Respect the OS "reduce motion" setting.
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduceMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  // Advance to the next image on an interval; pause when the screen isn't focused.
  useEffect(() => {
    if (!isFocused || images.length <= 1) {
      return;
    }
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [isFocused, images.length, interval]);

  // Crossfade to the active image, and run the Ken Burns zoom on it.
  useEffect(() => {
    Animated.parallel(
      opacities.map((op, i) =>
        Animated.timing(op, {
          toValue: i === index ? 1 : 0,
          duration: fadeDuration,
          useNativeDriver: true,
        }),
      ),
    ).start();

    if (kenBurns && !reduceMotion && scales[index]) {
      scales[index].setValue(1);
      Animated.timing(scales[index], {
        toValue: 1.08,
        duration: interval + fadeDuration,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, reduceMotion]);

  return (
    <View style={styles.container}>
      {images.map((src, i) => (
        <Animated.Image
          key={i}
          source={src}
          resizeMode="cover"
          fadeDuration={0}
          style={[styles.image, { opacity: opacities[i], transform: [{ scale: scales[i] }] }]}
        />
      ))}
      <LinearGradient
        colors={overlayColors}
        style={styles.overlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </View>
  );
};

export default ImageSlideshowBackground;
