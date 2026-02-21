import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
    },
    cell: {
      width: '48%',
      backgroundColor: theme.colors.surface.secondary,
      borderRadius: theme.borderRadius.card.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      padding: theme.spacing[3],
      gap: theme.spacing[1],
    },
    label: {
      color: theme.colors.text.secondary,
      fontWeight: fontWeightForPlatform('600'),
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    value: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
    },
  });
