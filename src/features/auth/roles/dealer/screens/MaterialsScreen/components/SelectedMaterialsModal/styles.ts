import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      alignItems: 'stretch',
    },
    modalContent: {
      backgroundColor: theme.colors.surface.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      width: '100%',
      flexDirection: 'column',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    modalTitle: {
      color: theme.colors.text.primary,
    },
    closeButton: {
      padding: theme.spacing[2],
    },
    scrollContent: {
      flex: 1,
      minHeight: 0,
    },
    scrollContentContainer: {
      paddingBottom: theme.spacing[6],
    },
    materialCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    materialCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[3],
    },
    materialCardTitle: {
      color: theme.colors.text.primary,
      flex: 1,
    },
    removeButton: {
      padding: theme.spacing[1],
    },
    detailRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing[2],
      gap: theme.spacing[2],
    },
    detailLabel: {
      color: theme.colors.text.tertiary,
      minWidth: 100,
    },
    detailValue: {
      color: theme.colors.text.primary,
      flex: 1,
    },
  });
