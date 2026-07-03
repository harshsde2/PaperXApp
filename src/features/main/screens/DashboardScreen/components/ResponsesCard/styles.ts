import { Platform, StyleSheet } from 'react-native';
import type { Theme } from '@theme/index';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.card?.lg ?? 16,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[2],
      // Align with the dashboard's inset sections (which use spacing[5]).
      marginHorizontal: theme.spacing[5],
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[2],
      borderWidth: 1,
      borderColor: theme.colors.border.secondary ?? theme.colors.border.primary,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[2],
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    countBadge: {
      marginLeft: theme.spacing[2],
      minWidth: 22,
      height: 22,
      paddingHorizontal: 7,
      borderRadius: 11,
      backgroundColor: theme.colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary ?? theme.colors.border.primary,
    },
    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.colors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[3],
    },
    rowContent: {
      flex: 1,
    },
    rowSubtitle: {
      marginTop: 2,
    },
  });
