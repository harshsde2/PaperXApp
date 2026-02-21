import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.card.md,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing[3],
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[2],
    },
    productName: {
      color: theme.colors.text.primary,
      flex: 1,
    },
    brandName: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[1],
    },
    quantity: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[1],
    },
    totalAmount: {
      color: theme.colors.text.primary,
      fontWeight: theme.typography.button.medium.fontWeight,
    },
    date: {
      color: theme.colors.text.tertiary,
    },
  });
