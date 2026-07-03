import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      backgroundColor: theme.colors.surface.primary,
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
    },
    listContent: {
      padding: theme.spacing[4],
      paddingBottom: theme.spacing[8],
    },
    emptyWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[8],
      gap: theme.spacing[2],
    },
    emptyTitle: {
      color: theme.colors.text.primary,
      fontWeight: fontWeightForPlatform('700'),
      textAlign: 'center',
    },
    emptySubtitle: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    footerLoading: {
      paddingVertical: theme.spacing[3],
      alignItems: 'center',
    },
    backButton: {
      padding: theme.spacing[1],
      marginRight: theme.spacing[2],
    },
    markAllButton: {
      minWidth: 140,
    },
  });

