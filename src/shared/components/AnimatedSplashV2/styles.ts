import { StyleSheet } from 'react-native';
import type { Theme } from '../../../theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 9999,
      elevation: 9999,
      overflow: 'hidden',
    },
    disk: {
      position: 'absolute',
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    holeLayer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hole: {
      backgroundColor: theme.colors.background.primary,
    },
    lettersRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    morphShell: {
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    morphContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
