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
      backgroundColor: theme.colors.surface.secondary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
    },
    button: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
    },
    text: {
      color: theme.colors.primary.DEFAULT,
    },
  });
