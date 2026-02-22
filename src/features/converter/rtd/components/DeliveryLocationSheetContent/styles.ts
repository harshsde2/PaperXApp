import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    listContent: {
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[4],
    },
    sectionLabel: {
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      marginBottom: theme.spacing[2],
    },
    locationOption: {
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.secondary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    locationOptionSelected: {
      backgroundColor: (theme.colors.primary as Record<string, string>).light ?? theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing[1],
      borderBottomWidth: 0,
    },
    locationOptionContent: {
      flex: 1,
    },
    locationOptionTitle: {
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    locationOptionSubtitle: {
      color: theme.colors.text.tertiary,
    },
    addLocationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface.secondary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[3],
      marginTop: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary,
    },
    addLocationText: {
      flex: 1,
      marginLeft: theme.spacing[2],
    },
    emptyMessage: {
      paddingVertical: theme.spacing[4],
      alignItems: 'center',
    },
    emptyMessageText: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
  });
