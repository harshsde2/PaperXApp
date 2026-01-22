/**
 * SessionTabBar Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    scrollContent: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing[4],
      gap: theme.spacing[6],
    },
    tabItem: {
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[1],
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    tabItemActive: {
      borderBottomColor: theme.colors.primary.DEFAULT,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
    },
    tabTextActive: {
      color: theme.colors.primary.DEFAULT,
      fontWeight: '700',
    },
  });
