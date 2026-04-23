import { StyleSheet } from 'react-native';
import { BOOTSPLASH_BACKGROUND, LOGO_SIZE } from './constants';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BOOTSPLASH_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  logoRevealClip: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  skiaLogoCanvas: {
    ...StyleSheet.absoluteFillObject,
  },
});
