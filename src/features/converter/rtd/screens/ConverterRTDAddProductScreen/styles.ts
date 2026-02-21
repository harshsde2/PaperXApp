import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
      padding: theme.spacing[4],
      paddingBottom: theme.spacing[12],
    },
    sectionContainer: {
      marginBottom: theme.spacing[6],
    },
    sectionTitle: {
      marginBottom: theme.spacing[4],
    },
    fieldContainer: {
      marginBottom: theme.spacing[4],
    },
    label: {
      marginBottom: theme.spacing[1],
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.input.md,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      fontSize: theme.typography.body.medium.fontSize,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.primary,
      fontFamily: theme.fontFamily.regular,
    },
    inputError: {
      borderColor: theme.colors.border.error,
    },
    inputReadOnly: {
      backgroundColor: theme.colors.surface.secondary,
      color: theme.colors.text.tertiary,
    },
    errorText: {
      marginTop: theme.spacing[1],
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[4],
    },
    switchLabel: {
      flex: 1,
    },
    leadTimeChipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },
    leadTimeChip: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.button.full,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    leadTimeChipActive: {
      borderColor: theme.colors.primary.DEFAULT,
      backgroundColor: theme.colors.primary[50],
    },
    leadTimeChipText: {
      color: theme.colors.text.secondary,
    },
    leadTimeChipTextActive: {
      color: theme.colors.primary.DEFAULT,
    },
    submitButtonContainer: {
      marginTop: theme.spacing[6],
    },
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[3],
      paddingVertical: theme.spacing[4],
    },
    loadingText: {
      color: theme.colors.text.secondary,
    },
  });
