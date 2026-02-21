import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[3],
    },
    box: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary[50],
      borderWidth: 1.5,
      borderColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[5],
      minWidth: 88,
    },
    value: {
      fontSize: 32,
      fontWeight: fontWeightForPlatform('800'),
      fontFamily: theme.fontFamily.extrabold,
      color: theme.colors.primary.DEFAULT,
      lineHeight: 38,
    },
    label: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: theme.spacing[1],
    },
    separator: {
      fontSize: 28,
      fontWeight: fontWeightForPlatform('700'),
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.primary.DEFAULT,
      lineHeight: 34,
      marginBottom: theme.spacing[3],
    },
  });
