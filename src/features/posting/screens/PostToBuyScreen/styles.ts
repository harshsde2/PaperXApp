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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface.primary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing[3],
      marginBottom: theme.spacing[2],
    },
    searchIcon: {
      marginRight: theme.spacing[2],
    },
    searchInput: {
      flex: 1,
      paddingVertical: theme.spacing[3],
      fontSize: 16,
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.regular,
    },
    materialsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
    },
    materialsListContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface.primary,
      marginTop: theme.spacing[2],
    },
    selectedCountContainer: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      backgroundColor: theme.colors.primary.light || theme.colors.primary.DEFAULT + '20',
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing[2],
      alignItems: 'center',
    },
    doneButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
    },
    doneButtonText: {
      color: theme.colors.text.inverse,
    },
    materialsListContent: {
      paddingVertical: theme.spacing[2],
    },
    materialItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.secondary,
    },
    materialItemContent: {
      flex: 1,
    },
    materialItemName: {
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    materialItemCategory: {
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
      padding: theme.spacing[2],
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
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
    buttonText: {
      color: theme.colors.text.inverse,
    },
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
  });
