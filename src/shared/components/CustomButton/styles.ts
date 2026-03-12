import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fullWidth: {
      alignSelf: 'stretch',
    },
    disabled: {
      opacity: 0.75,
    },

    // Variants
    variantPrimary: {
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    variantSecondary: {
      backgroundColor: theme.colors.surface.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    variantOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    variantGhost: {
      backgroundColor: 'transparent',
    },
    variantDanger: {
      backgroundColor: theme.colors.error.DEFAULT,
    },
    variantSuccess: {
      backgroundColor: theme.colors.success.DEFAULT,
    },
    variantGradient: {
      backgroundColor: 'transparent',
    },

    // Variant text colors (for shared Text component)
    textPrimary: {
      color: theme.colors.text.inverse,
    },
    textSecondary: {
      color: theme.colors.text.primary,
    },
    textOutline: {
      color: theme.colors.text.primary,
    },
    textGhost: {
      color: theme.colors.text.primary,
    },
    textDanger: {
      color: theme.colors.text.inverse,
    },
    textSuccess: {
      color: theme.colors.text.inverse,
    },
    textGradient: {
      color: theme.colors.text.inverse,
    },
    textDisabled: {
      color: theme.colors.text.disabled,
    },

    // Sizes
    sizeSm: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      borderRadius: theme.borderRadius.button.sm,
      minHeight: 36,
    },
    sizeMd: {
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.borderRadius.button.md,
      minHeight: 44,
    },
    sizeLg: {
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[5],
      borderRadius: theme.borderRadius.button.lg,
      minHeight: 52,
    },

    iconGap: {
      gap: theme.spacing[2],
    },
    loadingSpinner: {
      marginRight: theme.spacing[2],
    },

    gradientWrapper: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
    },
    rippleCircle: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.white,
      left: '50%',
      top: '50%',
      marginLeft: -60,
      marginTop: -60,
    },
  });
