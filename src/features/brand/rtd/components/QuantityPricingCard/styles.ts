import { Platform, StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) => {
  const h4 = theme.typography.heading.h4;
  /** Match ± buttons */
  const quantityInputHeight = 40;
  /** Shorter than outer so the field can vertically center inside the pill (Android expands TextInput otherwise). */
  const quantityInputInnerHeight =
    typeof h4.fontSize === 'number' ? Math.ceil(h4.fontSize * 1.35) : 28;

  return StyleSheet.create({
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
    quantityInputOuter: {
      height: quantityInputHeight,
      minWidth: 64,
      maxWidth: 120,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[2],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.button.md,
      backgroundColor: theme.colors.surface.secondary,
    },
    quantityInput: {
      width: '100%',
      height: quantityInputInnerHeight,
      lineHeight: quantityInputInnerHeight,
      margin: 0,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 0,
      backgroundColor: 'transparent',
      fontSize: h4.fontSize,
      color: theme.colors.text.primary,
      textAlign: 'center',
      fontFamily: theme.fontFamily.bold,
      ...(Platform.OS === 'android'
        ? { textAlignVertical: 'center' as const, includeFontPadding: false }
        : {}),
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
};
