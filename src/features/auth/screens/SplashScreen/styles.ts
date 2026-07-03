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
      paddingTop: 60,
      paddingBottom: 40,
    },
    logoWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      color: theme.colors.white,
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.45)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 8,
    },
    subheadline: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.typography.body.small.fontSize,
      color: 'rgba(255,255,255,0.92)',
      textAlign: 'center',
      paddingHorizontal: theme.spacing[2],
      lineHeight: 22,
      textShadowColor: 'rgba(0,0,0,0.4)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 6,
    },
  });
