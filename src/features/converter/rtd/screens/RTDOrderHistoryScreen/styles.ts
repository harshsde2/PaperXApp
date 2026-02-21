import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    tabBar: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing[4],
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary.DEFAULT,
    },
    tabText: {
      color: theme.colors.text.secondary,
    },
    activeTabText: {
      color: theme.colors.primary.DEFAULT,
    },
    listContent: {
      padding: theme.spacing[4],
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[6],
    },
    emptyText: {
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[3],
    },
    footerLoader: {
      padding: theme.spacing[4],
      alignItems: 'center',
    },
  });
