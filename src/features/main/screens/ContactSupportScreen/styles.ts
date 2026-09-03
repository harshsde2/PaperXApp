import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      padding: theme.spacing[5],
      paddingBottom: theme.spacing[8],
    },
    hero: {
      alignItems: 'center',
      marginTop: theme.spacing[2],
      marginBottom: theme.spacing[6],
    },
    heroIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.colors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[4],
    },
    heroGlyph: {
      fontSize: 34,
    },
    title: {
      fontSize: 20,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing[2],
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      paddingHorizontal: theme.spacing[4],
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      marginBottom: theme.spacing[3],
    },
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardGlyph: {
      fontSize: 22,
    },
    cardTextWrap: {
      flex: 1,
      marginLeft: theme.spacing[4],
    },
    cardLabel: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      marginBottom: 2,
    },
    cardValue: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.primary,
    },
    footerNote: {
      fontSize: 12,
      lineHeight: 18,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginTop: theme.spacing[5],
      paddingHorizontal: theme.spacing[4],
    },
  });
