import { Platform } from 'react-native';

/**
 * Shared tuning for the frosted-glass chrome (dashboard header, bottom tab bar,
 * GlassyWrapper). Kept in one place so iOS and Android stay visually in step.
 *
 * iOS uses UIVisualEffectView; Android uses Dimezis BlurView. The props below
 * marked "Android only" are ignored by iOS and vice versa.
 */

/** Props forwarded to BlurView that only affect Android (Dimezis BlurView). */
export const ANDROID_BLUR = {
  /**
   * Android blur radius. Independent of `blurAmount` (which Android clamps to
   * 32). Higher = softer, but costs more per frame since the underlying view
   * tree is redrawn into a bitmap.
   */
  blurRadius: 12,
  /**
   * Downscale factor applied before blurring. Higher = cheaper and softer.
   * 4 keeps mid-range devices smooth while still reading as glass.
   */
  downsampleFactor: 4,
  /**
   * CRITICAL on Android: Dimezis BlurView paints an opaque overlay derived from
   * `blurType` unless this is transparent, which flattens the blur into a solid
   * wash. iOS ignores this prop entirely.
   */
  overlayColor: 'transparent',
} as const;

/**
 * White tint layered on top of the blur, as a 0-100 opacity.
 *
 * Android's blur reads less "vibrant" than iOS's UIVisualEffectView, so it
 * needs a slightly heavier tint to keep foreground text legible against busy
 * content scrolling underneath.
 */
export const GLASS_TINT_OPACITY = Platform.OS === 'android' ? 20 : 4;
