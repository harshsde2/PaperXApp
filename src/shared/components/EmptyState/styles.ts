import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[6],
      alignItems: 'center',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.colors.border.primary,
    },
    minimal: {
      alignItems: 'center',
      paddingVertical: theme.spacing[8],
      paddingHorizontal: theme.spacing[4],
    },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[3],
    },
    title: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing[4],
    },
    descriptionNoAction: {
      marginBottom: 0,
    },
    actionWrap: {
      marginTop: theme.spacing[2],
      alignSelf: 'center',
    },
  });
