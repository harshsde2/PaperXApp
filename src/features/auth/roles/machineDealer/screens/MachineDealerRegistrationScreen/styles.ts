import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: theme.spacing[6],
    },
    container: {
      flex: 1,
      padding: theme.spacing[3],
      gap: theme.spacing[3],
    },
    card: {
      marginBottom: theme.spacing[3],
      padding: theme.spacing[4],
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
      gap: theme.spacing[2],
    },
    sectionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary[50],
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionTitle: {
      flex: 1,
      color: theme.colors.text.primary,
    },
    formGroup: {
      marginBottom: theme.spacing[4],
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[1],
    },
    label: {
      color: theme.colors.text.primary,
    },
    optionalLabel: {
      color: theme.colors.text.tertiary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      fontSize: 16,
      backgroundColor: theme.colors.surface.primary,
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.regular,
    },
    textArea: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      fontSize: 16,
      backgroundColor: theme.colors.surface.primary,
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.regular,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    addressContainer: {
      marginTop: theme.spacing[2],
    },
    addressPreview: {
      marginTop: theme.spacing[2],
      padding: theme.spacing[3],
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    addressPreviewText: {
      color: theme.colors.text.secondary,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.primary[50],
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
      gap: theme.spacing[2],
    },
    infoIcon: {
      fontSize: 16,
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      color: theme.colors.primary[900],
      lineHeight: 18,
    },
    button: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing[2],
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[6],
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: theme.colors.text.inverse,
    },
    securityFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },
    lockIcon: {
      fontSize: 14,
    },
    securityText: {
      color: theme.colors.text.tertiary,
      letterSpacing: 0.5,
    },
  });
