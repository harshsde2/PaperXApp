import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[4],
      ...theme.shadows.card,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[4],
    },
    stepRow: {
      flexDirection: 'row',
    },
    stepLeft: {
      alignItems: 'center',
      width: 36,
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
    },
    connector: {
      flex: 1,
      width: 2,
      minHeight: 18,
      backgroundColor: theme.colors.primary[100],
      marginVertical: theme.spacing[1],
    },
    stepBody: {
      flex: 1,
      marginLeft: theme.spacing[3],
      paddingBottom: theme.spacing[4],
    },
    stepBodyLast: {
      paddingBottom: 0,
    },
    stepNumber: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('700'),
      fontSize: 11,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: 2,
    },
    stepTitle: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    stepDescription: {
      fontSize: 12,
      lineHeight: 17,
      color: theme.colors.text.secondary,
    },
  });
