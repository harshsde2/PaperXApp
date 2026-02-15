/**
 * ElapsedTimer Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[3],
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeSegment: {
      minWidth: 32,
      alignItems: 'center',
    },
    timeValue: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.colors.primary.DEFAULT,
      letterSpacing: 0.5,
    },
    timeSeparator: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text.tertiary,
      marginHorizontal: 4,
      opacity: 0.7,
    },
    timerRow: {
      flexDirection: 'row',
      gap: theme.spacing[2],
    },
    timerBlock: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing[2],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    timerValue: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    timerUnit: {
      fontSize: 9,
      fontWeight: '700',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      marginTop: 2,
    },
    compactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    compactText: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.primary.DEFAULT,
    },
  });
