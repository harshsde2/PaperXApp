import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      marginTop: theme.spacing[2],
      backgroundColor: theme.colors.background.secondary,
    },
    container: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
    },
    pill: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface.secondary,
      marginRight: theme.spacing[2],
      borderWidth: 1.5,
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    pillActive: {
      backgroundColor: theme.colors.primary[50],
      borderColor: theme.colors.primary.DEFAULT,
    },
    pillText: {
      fontSize: 13,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text.secondary,
    },
    pillTextActive: {
      color: theme.colors.primary.DEFAULT,
      fontFamily: theme.fontFamily.semibold,
    },
  });
