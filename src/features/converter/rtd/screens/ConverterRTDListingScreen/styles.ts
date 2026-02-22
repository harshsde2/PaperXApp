import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    content: {
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[24],
    },
    statsScroll: {
      marginTop: theme.spacing[4],
      paddingBottom: theme.spacing[2],
    },
    statsScrollContent: {
      gap: theme.spacing[3],
      paddingRight: theme.spacing[4],
    },
    statCard: {
      minWidth: 130,
      flex: 1,
      minHeight: 100,
      borderRadius: theme.borderRadius.card.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.surface.primary,
      padding: theme.spacing[4],
      justifyContent: 'space-between',
    },
    statLabel: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[1],
    },
    statValue: {
      fontSize: 24,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
    },
    statSub: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
      marginTop: theme.spacing[1],
      minHeight: 18,
    },
    statSubText: {
      fontSize: 10,
      marginLeft: theme.spacing[1],
      fontWeight: fontWeightForPlatform('700'),
    },
    statSubTextSuccess: {
      color: theme.colors.success.DEFAULT,
    },
    statSubTextMuted: {
      color: theme.colors.text.tertiary,
    },
    statSubTextWarning: {
      color: theme.colors.warning.DEFAULT,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing[6],
      marginBottom: theme.spacing[4],
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
    },
    seeAllLink: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
    },
    productCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[4],
      borderRadius: theme.borderRadius.card.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.surface.primary,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[3],
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.card.md,
      backgroundColor: theme.colors.surface.tertiary,
    },
    productImagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.card.md,
      backgroundColor: theme.colors.surface.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    productBody: {
      flex: 1,
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[1],
    },
    productName: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[0],
      borderRadius: theme.borderRadius.badge,
    },
    statusBadgeLive: {
      backgroundColor: theme.colors.success.light,
    },
    statusBadgePaused: {
      backgroundColor: theme.colors.surface.tertiary,
    },
    statusBadgePending: {
      backgroundColor: theme.colors.warning.light,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('800'),
      textTransform: 'uppercase',
    },
    statusBadgeTextLive: {
      color: theme.colors.success.dark,
    },
    statusBadgeTextPaused: {
      color: theme.colors.text.tertiary,
    },
    statusBadgeTextPending: {
      color: theme.colors.warning.dark,
    },
    productMoq: {
      fontSize: 11,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[1],
    },
    productPriceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: theme.spacing[1],
    },
    productPrice: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('800'),
      color: theme.colors.text.primary,
    },
    productPriceUnit: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.tertiary,
    },
  });
