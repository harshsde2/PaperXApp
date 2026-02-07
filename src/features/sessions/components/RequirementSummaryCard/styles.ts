import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      margin: theme.spacing[4],
      marginBottom: theme.spacing[2],
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    content: {
      flexDirection: 'row',
      padding: theme.spacing[4],
      gap: theme.spacing[4],
    },
    imagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    details: {
      flex: 1,
      justifyContent: 'center',
    },
    label: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.primary.DEFAULT,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[1],
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
    },
    timer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    timerLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginBottom: theme.spacing[2],
    },
    timerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing[3],
    },
    timerBlock: {
      alignItems: 'center',
      gap: 4,
    },
    timerValue: {
      width: 48,
      height: 40,
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timerValueText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary.DEFAULT,
    },
    timerUnit: {
      fontSize: 9,
      fontWeight: '700',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
    },
  });
