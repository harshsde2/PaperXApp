import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    bar: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 1000,
      elevation: 1000,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      // Transparent full-width strip — only the pill below is opaque, so form
      // content just above the keyboard stays visible instead of being covered.
      backgroundColor: 'transparent',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
    },
    button: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      backgroundColor: theme.colors.surface.secondary,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.shadows.md,
    },
    text: {
      color: theme.colors.primary.DEFAULT,
    },
  });
