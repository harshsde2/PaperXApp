import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[6],
      width: '85%',
      maxWidth: 360,
    },
    iconContainer: {
      alignSelf: 'center',
      marginBottom: theme.spacing[4],
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing[2],
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: theme.spacing[6],
      color: theme.colors.text.secondary,
    },
    buttonsContainer: {
      gap: theme.spacing[3],
    },
    buttonSpacing: {
      marginTop: theme.spacing[3],
    },
  });
