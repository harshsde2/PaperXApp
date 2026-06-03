import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flexFill: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: theme.spacing[4],
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[4],
    },
    title: {
      color: theme.colors.text.primary,
    },
    formGroup: {
      marginBottom: theme.spacing[4],
    },
    label: {
      marginBottom: theme.spacing[2],
      color: theme.colors.text.primary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      fontSize: 16,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.surface.primary,
      fontFamily: theme.fontFamily.regular,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      marginTop: theme.spacing[6],
    },
    cancelButton: {
      flex: 1,
    },
    submitButton: {
      flex: 2,
    },
  });
