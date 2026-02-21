import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface.primary,
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
      gap: theme.spacing[3],
    },

    // Order card
    card: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      overflow: 'hidden',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[2],
    },
    orderId: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.tertiary,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: 2,
      borderRadius: 100,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('700'),
      color: '#fff',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    cardBody: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      gap: theme.spacing[3],
    },
    productThumb: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.card.md,
      backgroundColor: theme.colors.surface.tertiary,
    },
    productThumbImage: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.card.md,
    },
    cardInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.primary,
    },
    quantityText: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    amountText: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      backgroundColor: theme.colors.surface.secondary,
    },
    footerLabel: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
    },
    countdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    countdownText: {
      fontSize: 13,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
    },
    chevronIcon: {
      marginLeft: 'auto',
    },

    // Empty
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[8],
    },
    emptyText: {
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[3],
      textAlign: 'center',
    },
    emptySubText: {
      color: theme.colors.text.tertiary,
      fontSize: 13,
      marginTop: theme.spacing[1],
      textAlign: 'center',
    },
    footerLoader: {
      padding: theme.spacing[4],
      alignItems: 'center',
    },
  });
