import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[3],
      ...theme.shadows.card,
    },
    unreadContainer: {
      borderColor: theme.colors.primary.light,
      backgroundColor: theme.colors.surface.secondary,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[2],
      gap: theme.spacing[2],
    },
    title: {
      flex: 1,
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    body: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[3],
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    meta: {
      color: theme.colors.text.tertiary,
      textTransform: 'capitalize',
    },
    time: {
      color: theme.colors.text.tertiary,
    },
  });

