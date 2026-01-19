/**
 * PostBrandRequirementScreen Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
    },
    title: {
      marginBottom: theme.spacing[2],
    },
    description: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[4],
    },
    formContainer: {
      gap: theme.spacing[4],
    },
    formGroup: {
      marginBottom: theme.spacing[4],
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing[2],
    },
    label: {
      marginBottom: theme.spacing[2],
      color: theme.colors.text.primary,
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
    },
    dropdownText: {
      color: theme.colors.text.primary,
    },
    dropdownPlaceholder: {
      color: theme.colors.text.tertiary,
    },
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
    },
    mapButton: {
      marginTop: theme.spacing[2],
      padding: theme.spacing[3],
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
    },
    mapButtonText: {
      color: theme.colors.text.inverse,
      fontWeight: '600',
    },
    button: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing[2],
      width: '100%',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: theme.colors.text.inverse,
    },
    errorText: {
      color: theme.colors.error.DEFAULT,
      marginTop: 4,
      fontSize: 12,
    },
    // Modal styles
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      zIndex: 1004,
    },
    modalContent: {
      backgroundColor: theme.colors.background.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      maxHeight: '70%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    modalOption: {
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.secondary,
    },
    modalOptionSelected: {
      backgroundColor: theme.colors.primary.light,
    },
    // Section Header
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
      marginTop: theme.spacing[2],
    },
    sectionIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[2],
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    // Info Card
    infoCard: {
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary.DEFAULT,
    },
    infoText: {
      color: theme.colors.primary.DEFAULT,
      fontSize: 13,
      lineHeight: 20,
    },
  });
