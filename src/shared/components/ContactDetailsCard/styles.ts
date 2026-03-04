import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      padding: theme.spacing[4],
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[3],
    },
    header: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('700'),
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[3],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
    },
    lastRow: {
      marginBottom: 0,
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.surface.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconText: {
      fontSize: 16,
    },
    infoBlock: {
      flex: 1,
      marginLeft: theme.spacing[3],
    },
    infoLabel: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
      marginBottom: 2,
    },
    infoValue: {
      fontWeight: fontWeightForPlatform('600'),
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.text.primary,
    },
    tappableValue: {
      fontWeight: fontWeightForPlatform('600'),
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.primary.DEFAULT,
    },
  });
