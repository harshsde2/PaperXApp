import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.card.md,
      padding: theme.spacing[4],
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      alignItems: 'flex-end',
      marginBottom: theme.spacing[3],
    },
    inputContainer: {
      flex: 1,
    },
    inputLabel: {
      marginBottom: theme.spacing[1],
      color: theme.colors.text.secondary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.input.md,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      fontSize: theme.typography.body.small.fontSize,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.primary,
      fontFamily: theme.fontFamily.regular,
    },
    deleteButton: {
      padding: theme.spacing[2],
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 40,
    },
    errorsContainer: {
      marginTop: theme.spacing[2],
    },
    errorText: {
      color: theme.colors.error.DEFAULT,
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.typography.caption.small.fontSize,
      marginTop: theme.spacing[1],
    },
    addButton: {
      marginTop: theme.spacing[3],
    },
  });
