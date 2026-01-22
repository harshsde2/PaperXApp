/**
 * SessionDashboardScreen Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },

    // Header
    header: {
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    headerIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text.primary,
      letterSpacing: -0.3,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // List
    listContent: {
      padding: theme.spacing[4],
      paddingBottom: theme.spacing[8],
    },
    sessionCard: {
      marginBottom: theme.spacing[4],
    },

    // Empty State
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[6],
      paddingVertical: theme.spacing[12],
    },
    emptyIconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 20,
    },
    emptyButton: {
      marginTop: theme.spacing[5],
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[6],
      borderRadius: theme.borderRadius.lg,
    },
    emptyButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },

    // Loading
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // FAB
    fab: {
      position: 'absolute',
      bottom: theme.spacing[6],
      right: theme.spacing[4],
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary.DEFAULT,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
  });
