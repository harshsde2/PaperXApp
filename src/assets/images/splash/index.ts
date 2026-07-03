import type { ImageSourcePropType } from 'react-native';

/**
 * Full-HD background photos for the welcome/splash slideshow.
 * Bundled via require() so they are cached and decode without a runtime stall.
 */
export const SPLASH_IMAGES: ImageSourcePropType[] = [
  require('./pexels-fauxels-3183172.jpg'),
  require('./pexels-gustavo-fring-7446584.jpg'),
  require('./pexels-mikhail-nilov-8729937.jpg'),
  require('./pexels-shkrabaanthony-5583976.jpg'),
];
