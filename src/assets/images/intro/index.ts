import type { ImageSourcePropType } from 'react-native';

/**
 * App-intro carousel artwork (Zupply brand series, portrait 3:4).
 * Bundled via require() so slides are cached and decode without a runtime stall.
 * Order defines the carousel narrative: problem → define needs → verify partner → join.
 */
export const INTRO_SLIDES: ImageSourcePropType[] = [
  require('./intro-1-vendor.jpg'),
  require('./intro-2-requirement.jpg'),
  require('./intro-3-capability.jpg'),
  require('./intro-4-partner.jpg'),
];
