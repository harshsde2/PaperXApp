import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.background.overlay,
      justifyContent: 'flex-end',
    },
    card: {
      backgroundColor: theme.colors.background.primary,
      borderTopLeftRadius: theme.borderRadius.modal,
      borderTopRightRadius: theme.borderRadius.modal,
      padding: theme.spacing[6],
      paddingBottom: theme.spacing[10],
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[6],
    },
    title: {
      color: theme.colors.text.primary,
      flex: 1,
    },
    closeButton: {
      padding: theme.spacing[2],
      marginRight: -theme.spacing[2],
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[3],
      marginBottom: theme.spacing[2],
      borderRadius: theme.borderRadius.input.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.border.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[3],
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    optionLabel: {
      color: theme.colors.text.primary,
      flex: 1,
    },
    inputContainer: {
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[4],
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.input.md,
      padding: theme.spacing[4],
      color: theme.colors.text.primary,
      fontSize: 16,
    },
    filePickerContainer: {
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[4],
    },
    fileNameText: {
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
    },
    submitButton: {
      marginTop: theme.spacing[6],
    },
    disabledButton: {
      opacity: 0.5,
    },
  });
