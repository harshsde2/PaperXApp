import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    listContent: {
      flex: 1,
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[24],
      paddingTop: theme.spacing[4],
      gap: theme.spacing[4],
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[16],
      gap: theme.spacing[3],
    },
    skeletonContainer: {
      width: '100%',
      gap: theme.spacing[4],
      paddingBottom: theme.spacing[8],
    },
    skeletonCard: {
      width: '100%',
      borderRadius: theme.borderRadius.lg,
      backgroundColor:
        theme.mode === 'dark' ? theme.colors.surface.secondary : theme.colors.surface.primary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      padding: theme.spacing[3],
      gap: theme.spacing[3],
    },
    skeletonBody: {
      gap: theme.spacing[2],
    },
    skeletonTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    skeletonFooterRow: {
      marginTop: theme.spacing[1],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    filterIconWrapper: {
      position: 'relative',
    },
    filterBadge: {
      position: 'absolute',
      top: -6,
      right: -8,
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 3,
    },
    filterBadgeText: {
      color: theme.colors.surface.primary,
      fontWeight: fontWeightForPlatform('700'),
      fontSize: 9,
      lineHeight: 12,
    },
    sheetBackground: {
      backgroundColor: theme.colors.surface.primary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
    },
    sheetHandle: {
      backgroundColor: theme.colors.border.primary,
      width: 40,
    },
  });
