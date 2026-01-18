/**
 * CreditPackCard Component Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      borderWidth: 2,
      borderColor: theme.colors.border.DEFAULT,
      position: 'relative',
      overflow: 'hidden',
    },
    containerSelected: {
      borderColor: theme.colors.primary.DEFAULT,
      backgroundColor: theme.colors.primary.light,
    },
    containerDisabled: {
      opacity: 0.6,
    },
    bestValueBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: theme.colors.success.DEFAULT,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderBottomLeftRadius: theme.borderRadius.md,
    },
    bestValueText: {
      color: theme.colors.white,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[3],
    },
    nameContainer: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    description: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      lineHeight: 16,
    },
    creditsContainer: {
      alignItems: 'flex-end',
    },
    creditsValue: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.colors.primary.DEFAULT,
    },
    creditsLabel: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      fontWeight: '500',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border.light,
      marginVertical: theme.spacing[3],
    },
    priceSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceBreakdown: {
      flex: 1,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[1],
    },
    priceLabel: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
    },
    priceValue: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing[1],
      paddingTop: theme.spacing[2],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    totalValue: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary.DEFAULT,
    },
    validityBadge: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing[2],
      alignSelf: 'flex-start',
    },
    validityText: {
      fontSize: 10,
      color: theme.colors.text.tertiary,
      fontWeight: '500',
    },
    selectedIndicator: {
      position: 'absolute',
      top: theme.spacing[3],
      left: theme.spacing[3],
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary.DEFAULT,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkmark: {
      color: theme.colors.white,
      fontSize: 14,
      fontWeight: '700',
    },
  });
