import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    filterContainer: {
      paddingHorizontal: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    filterHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    myOrdersLink: {
      paddingLeft: theme.spacing[3],
      paddingVertical: theme.spacing[2],
    },
    myOrdersLinkText: {
      fontSize: 13,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
    },
    listContent: {
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[24],
      paddingTop: theme.spacing[4],
      gap: theme.spacing[4],
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[16],
      gap: theme.spacing[3],
    },
    emptyText: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.secondary,
    },
    emptySubText: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      paddingHorizontal: theme.spacing[8],
    },
    footerLoader: {
      paddingVertical: theme.spacing[4],
    },
  });
