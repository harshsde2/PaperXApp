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
    warningText: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing[3],
    },
    termsBox: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.input.md,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[4],
    },
    termsText: {
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    label: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
      marginTop: theme.spacing[2],
    },
    requiredHint: {
      color: theme.colors.status.error,
    },
    scrollContent: {
      paddingBottom: theme.spacing[10],
    },
    inputContainer: {
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[4],
    },
    placeholder: {
      color: theme.colors.text.placeholder,
      flex: 1,
    },
    inputValue: {
      color: theme.colors.text.primary,
      flex: 1,
    },
    pickerList: {
      maxHeight: 200,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.input.md,
      marginBottom: theme.spacing[2],
      backgroundColor: theme.colors.background.primary,
      zIndex: 10,
      elevation: 10,
    },
    pickerOption: {
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    pickerOptionPressed: {
      backgroundColor: theme.colors.background.secondary,
    },
    dropdownTrigger: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.input.md,
      padding: theme.spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.input.md,
      padding: theme.spacing[4],
      color: theme.colors.text.primary,
      fontSize: 16,
      marginBottom: theme.spacing[2],
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
    sheetHeader: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[2],
    },
    sheetTitle: {
      color: theme.colors.text.primary,
    },
    sheetOption: {
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    sheetOptionSelected: {
      backgroundColor: theme.colors.background.secondary,
    },
  });
