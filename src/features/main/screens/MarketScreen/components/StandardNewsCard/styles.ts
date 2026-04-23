import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[3],
      paddingVertical: theme.spacing[1],
    },
    imageWrapper: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.card.sm,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    fallbackCenter: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    details: {
      flex: 1,
      gap: theme.spacing[1],
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('600'),
      lineHeight: 20,
    },
    source: {
      color: theme.colors.text.secondary,
    },
    date: {
      color: theme.colors.text.tertiary,
    },
    trailingAction: {
      width: 28,
      height: 28,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    separator: {
      marginTop: theme.spacing[3],
      height: 1,
      backgroundColor: theme.colors.divider.secondary,
    },
  });
