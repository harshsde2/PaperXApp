import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/index';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -8,
      marginRight: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    listContent: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[2],
      paddingBottom: theme.spacing[6],
    },
    centered: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[6],
    },

    // Chat row
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      gap: theme.spacing[3],
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary[100],
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
    },
    rowContent: {
      flex: 1,
      gap: 2,
    },
    rowTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    nameText: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.primary,
      flex: 1,
      marginRight: theme.spacing[2],
    },
    timeText: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
      flexShrink: 0,
    },
    rowMid: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      marginTop: 1,
    },
    inquiryLabel: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      flex: 1,
    },
    roleBadge: {
      backgroundColor: theme.colors.surface.tertiary,
      borderRadius: theme.borderRadius.badge,
      paddingHorizontal: 6,
      paddingVertical: 2,
      flexShrink: 0,
    },
    roleBadgeText: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.secondary,
    },
    rowBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 2,
    },
    previewText: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
      flex: 1,
      marginRight: theme.spacing[2],
    },
    unreadBadge: {
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
      flexShrink: 0,
    },
    unreadText: {
      fontSize: 11,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.white,
    },

    // Skeleton
    skeletonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing[4],
      gap: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    skeletonBody: {
      flex: 1,
      gap: 6,
    },

    // Empty
    emptyContainer: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing[6],
      gap: theme.spacing[3],
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.primary,
      marginTop: theme.spacing[2],
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
