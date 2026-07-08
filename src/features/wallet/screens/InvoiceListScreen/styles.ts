import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    listContent: {
      padding: theme.spacing[4],
      gap: theme.spacing[3],
      flexGrow: 1,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      padding: theme.spacing[4],
      ...theme.shadows.card,
    },
    iconCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: theme.colors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[3],
    },
    cardBody: {
      flex: 1,
      marginRight: theme.spacing[2],
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.primary,
    },
    cardInvoiceNo: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    cardDate: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    cardRight: {
      alignItems: 'flex-end',
      gap: theme.spacing[1],
    },
    cardAmount: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    paidChip: {
      backgroundColor: '#DCFCE7',
      borderRadius: theme.borderRadius.badge,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: 2,
    },
    paidChipText: {
      fontSize: 9,
      fontWeight: fontWeightForPlatform('700'),
      color: '#15803D',
      letterSpacing: 0.5,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[3],
      paddingHorizontal: theme.spacing[8],
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.secondary,
    },
    emptySubtitle: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[3],
      paddingHorizontal: theme.spacing[8],
    },
    retryButton: {
      minWidth: 160,
      marginTop: theme.spacing[2],
    },
    footerLoader: {
      paddingVertical: theme.spacing[4],
    },
    skeletonContainer: {
      padding: theme.spacing[4],
    },
  });
