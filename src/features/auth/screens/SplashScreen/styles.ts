import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary[50],
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[6],
    },
    header: {
      alignItems: 'center',
      paddingTop: theme.spacing[4],
    },
    visualContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -theme.spacing[8],
    },
    bottomSection: {
      width: '100%',
      alignItems: 'center',
      gap: theme.spacing[6],
      marginBottom: theme.spacing[4],
    },
    headline: {
      fontFamily: theme.fontFamily.bold,
      fontSize: 28,
      lineHeight: 36,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    subheadline: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.typography.body.small.fontSize,
      color: theme.colors.primary.DEFAULT,
      textAlign: 'center',
      paddingHorizontal: theme.spacing[2],
      lineHeight: 22,
    },
  });
