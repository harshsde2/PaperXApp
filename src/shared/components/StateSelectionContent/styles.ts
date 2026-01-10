import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[4],
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
    emptyContainer: {
      padding: 20,
      alignItems: 'center',
    },
    emptyText: {
      color: theme.colors.text.tertiary,
    },
  });
