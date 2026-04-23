import { StyleSheet } from 'react-native';
import type { DimensionValue } from 'react-native';
import type { Theme } from '@theme/types';

interface CreateStylesParams {
  theme: Theme;
  height: number;
  width: DimensionValue;
  borderRadius: number;
  boneColor: string;
  shimmerColor: string;
  shimmerWidth: number;
}

export const createStyles = ({
  theme,
  height,
  width,
  borderRadius,
  boneColor,
  shimmerColor,
  shimmerWidth,
}: CreateStylesParams) =>
  StyleSheet.create({
    container: {
      width,
      height,
      borderRadius,
      overflow: 'hidden',
      backgroundColor: boneColor,
    },
    shimmerTrack: {
      ...StyleSheet.absoluteFillObject,
      width: shimmerWidth,
      height,
    },
    shimmerGradient: {
      width: shimmerWidth,
      height,
    },
    childContainer: {
      ...StyleSheet.absoluteFillObject,
      opacity: theme.mode === 'dark' ? 0.92 : 0.96,
    },
    hiddenChildren: {
      opacity: 0,
    },
    noOverflow: {
      overflow: 'visible',
      backgroundColor: 'transparent',
    },
    placeholderOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: shimmerColor,
      opacity: 0.04,
      borderRadius,
    },
  });
