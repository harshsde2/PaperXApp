import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const DOT_SIZE = 8;
export const ACTIVE_DOT_WIDTH = 24;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    dot: {
      height: DOT_SIZE,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary.DEFAULT,
      marginHorizontal: theme.spacing[1],
    },
  });
