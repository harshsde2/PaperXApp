import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
    },
    title: {
      color: theme.colors.text.primary,
      flex: 1,
    },
    clearButton: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.error?.light || theme.colors.error?.[100] || '#FEE2E2',
    },
    clearButtonText: {
      color: theme.colors.error?.DEFAULT || theme.colors.error?.[500] || '#EF4444',
      fontWeight: '600',
    },
    selectedCountContainer: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      backgroundColor: theme.colors.primary.light || theme.colors.primary.DEFAULT + '20',
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing[3],
      alignItems: 'center',
    },
    selectedCountText: {
      color: theme.colors.text.secondary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface.primary,
      paddingHorizontal: theme.spacing[3],
      marginBottom: theme.spacing[3],
    },
    searchIcon: {
      marginRight: theme.spacing[2],
    },
    searchInput: {
      flex: 1,
      padding: theme.spacing[3],
      fontSize: 16,
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.regular,
    },
    listContent: {
      paddingBottom: theme.spacing[4],
      flexGrow: 1,
    },
    loadingContainer: {
      padding: theme.spacing[8],
      alignItems: 'center',
    },
    emptyContainer: {
      padding: theme.spacing[8],
      alignItems: 'center',
    },
    emptyText: {
      color: theme.colors.text.tertiary,
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
  });
