import { StyleSheet, Dimensions } from 'react-native';
import type { Theme } from '@theme/types';
import { WithSpringConfig } from 'react-native-reanimated';
import { baseColors } from '@theme/tokens/base';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BOTTOM_SHEET_CONSTANTS = {
  SCREEN_HEIGHT,
  VELOCITY_THRESHOLD: 500,
  ANIMATION_CONFIG: {
    damping: 20,
    stiffness: 90,
    mass: 0.5,
  } as WithSpringConfig,
};

export const createBottomSheetStyles = (theme: Theme) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: baseColors.black,
      zIndex: theme.zIndex.overlay,
    },
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface.primary,
      borderTopLeftRadius: theme.borderRadius['2xl'],
      borderTopRightRadius: theme.borderRadius['2xl'],
      ...theme.shadows['2xl'],
      zIndex: theme.zIndex.modal,
    },
    handleContainer: {
      alignItems: 'center',
      paddingTop: theme.spacing[3],
      paddingBottom: theme.spacing[3],
      // Larger touch area for better dragging UX
      minHeight: 32,
    },
    handleIndicator: {
      width: 40,
      height: 4,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.border.primary,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[4],
    },
  });

