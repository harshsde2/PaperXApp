import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.primary[50],
      borderWidth: 1,
      borderColor: theme.colors.primary[100],
      borderRadius: theme.borderRadius.card.md,
      padding: theme.spacing[4],
      gap: theme.spacing[3],
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.badge,
      backgroundColor: theme.colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      flex: 1,
      gap: theme.spacing[1],
    },
    title: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('700'),
    },
    description: {
      color: theme.colors.text.secondary,
    },
  });
