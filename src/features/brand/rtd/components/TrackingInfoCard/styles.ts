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
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('700'),
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[4],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
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
      fontWeight: fontWeightForPlatform('700'),
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text.primary,
    },
    trackingValue: {
      fontWeight: fontWeightForPlatform('700'),
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text.primary,
      letterSpacing: -0.25,
    },
    copyButton: {
      padding: theme.spacing[2],
      marginLeft: theme.spacing[2],
    },
    copyIcon: {
      fontSize: 16,
      color: theme.colors.primary.DEFAULT,
    },
    placeholderContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing[4],
    },
    placeholderText: {
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[2],
    },
  });
