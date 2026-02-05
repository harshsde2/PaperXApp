import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
    },
    title: { marginBottom: theme.spacing[2] },
    description: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[4],
    },
    formContainer: { gap: theme.spacing[4] },
    formGroup: { marginBottom: theme.spacing[4] },
    row: { flexDirection: 'row', gap: theme.spacing[2] },
    label: {
      marginBottom: theme.spacing[2],
      color: theme.colors.text.primary,
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
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.surface.secondary,
      paddingVertical: theme.spacing[1],
      paddingHorizontal: theme.spacing[2],
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing[1],
      marginBottom: theme.spacing[1],
    },
  });
