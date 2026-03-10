import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[4],
      ...theme.shadows.card,
    },
    quantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[4],
      marginBottom: theme.spacing[4],
    },
    quantityButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.button.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.surface.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityButtonText: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('600'),
    },
    quantityValue: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
      minWidth: 48,
      textAlign: 'center',
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.divider.primary,
      marginBottom: theme.spacing[3],
    },
    pricingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    pricingLabel: {
      color: theme.colors.text.secondary,
    },
    pricingValue: {
      color: theme.colors.text.primary,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing[2],
      paddingTop: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    totalLabel: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
    },
    totalValue: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('800'),
    },
    escrowBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      backgroundColor: theme.colors.primary[50],
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.card.sm,
      marginTop: theme.spacing[4],
    },
    escrowIcon: {
      width: 20,
      height: 20,
      borderRadius: theme.borderRadius.badge,
      backgroundColor: theme.colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    escrowText: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: fontWeightForPlatform('600'),
      flex: 1,
    },
    facilitatorText: {
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[3],
      lineHeight: 16,
      fontSize: 11,
    },
  });
