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
  poweredBy: {
    // Absolute so it sits just below the (perfectly centered) logo without
    // pushing it off-center. top:50% is the vertical middle; margin drops it
    // below the logo.
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    marginTop: LOGO_SIZE / 2 + 20,
    paddingHorizontal: 24,
    textAlign: 'center',
    fontSize: 13,
    letterSpacing: 0.6,
    fontFamily: 'Montserrat-Medium',
    color: '#64748b',
  },
});
