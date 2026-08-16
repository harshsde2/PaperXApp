import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    list: {
      flex: 1,
    },
    skipButton: {
      position: 'absolute',
      right: theme.spacing[4],
      zIndex: 10,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
    skipText: {
      fontFamily: theme.fontFamily.semibold,
      fontSize: theme.typography.body.small.fontSize,
      color: theme.colors.primary.DEFAULT,
    },
    controls: {
      width: '100%',
      paddingHorizontal: theme.spacing[6],
      paddingTop: theme.spacing[4],
      gap: theme.spacing[5],
    },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
