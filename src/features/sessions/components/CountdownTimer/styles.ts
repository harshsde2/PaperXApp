/**
 * CountdownTimer Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[2],
    },
    timerRow: {
      flexDirection: 'row',
      gap: theme.spacing[2],
    },
    timerBlock: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing[2],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
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
    // Compact styles
    compactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    compactText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.text.primary,
      fontStyle: 'italic',
    },
    searchingText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.text.primary,
      fontStyle: 'italic',
    },
  });
