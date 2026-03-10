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
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[3],
    },
    image: {
      width: 64,
      height: 64,
      borderRadius: theme.borderRadius.image.sm,
      backgroundColor: theme.colors.surface.tertiary,
    },
    placeholderImage: {
      width: 64,
      height: 64,
      borderRadius: theme.borderRadius.image.sm,
      backgroundColor: theme.colors.surface.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    productInfo: {
      flex: 1,
      marginLeft: theme.spacing[3],
    },
    productName: {
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    category: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },
    quantity: {
      color: theme.colors.text.secondary,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing[2],
      gap: theme.spacing[2],
    },
    logoImage: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.image.xs,
      backgroundColor: theme.colors.surface.secondary,
    },
    logoLabel: {
      color: theme.colors.text.secondary,
    },
    financials: {
      marginTop: theme.spacing[2],
      paddingTop: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    rowItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    label: {
      color: theme.colors.text.secondary,
    },
    value: {
      color: theme.colors.text.primary,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing[2],
      paddingTop: theme.spacing[2],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    totalLabel: {
      color: theme.colors.text.primary,
      fontWeight: theme.typography.button.medium.fontWeight,
    },
    totalValue: {
      color: theme.colors.text.primary,
      fontWeight: theme.typography.button.medium.fontWeight,
    },
  });
