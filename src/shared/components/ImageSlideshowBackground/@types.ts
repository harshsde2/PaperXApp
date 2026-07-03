import type { ImageSourcePropType } from 'react-native';

export interface ImageSlideshowBackgroundProps {
  /** Ordered list of images to cycle through. */
  images: ImageSourcePropType[];
  /** How long each image stays before crossfading to the next (ms). */
  interval?: number;
  /** Crossfade duration between images (ms). */
  fadeDuration?: number;
  /**
   * Overlay gradient colors (top → bottom) drawn over the photos for text
   * legibility. Defaults to a subtle top tint deepening to a dark bottom scrim.
   */
  overlayColors?: string[];
  /** Slow zoom ("Ken Burns") on each slide. Default true. */
  kenBurns?: boolean;
}
