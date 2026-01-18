/**
 * WalletBadge Component Styles - Premium Gradient Design
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

// Badge dimensions
export const BADGE_WIDTH = 110;
export const BADGE_HEIGHT = 44;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: BADGE_WIDTH,
      height: BADGE_HEIGHT,
      borderRadius: 22,
      overflow: 'hidden',
      position: 'relative',
      // Subtle shadow for depth
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    gradientCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: BADGE_WIDTH,
      height: BADGE_HEIGHT,
    },
    contentContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: theme.spacing[2],
      paddingRight: theme.spacing[3],
    },
    iconContainer: {
      width: 30,
      height: 30,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[2],
    },
    textContainer: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    label: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    balance: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '800',
      letterSpacing: -0.3,
    },
    loadingContainer: {
      width: 50,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
