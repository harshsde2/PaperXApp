import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.surface.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[3],
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Tab bar
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: theme.colors.primary.DEFAULT,
    },
    tabText: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.tertiary,
    },
    tabTextActive: {
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.primary.DEFAULT,
    },

    // Search
    searchContainer: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface.tertiary,
      borderRadius: theme.borderRadius.card.lg,
      paddingHorizontal: theme.spacing[3],
    },
    searchIcon: {
      marginRight: theme.spacing[2],
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text.primary,
      paddingVertical: theme.spacing[3],
    },

    // List
    listContent: {
      padding: theme.spacing[4],
      paddingBottom: theme.spacing[24],
      gap: theme.spacing[4],
    },

    // Product card
    card: {
      borderRadius: theme.borderRadius.card.lg,
      backgroundColor: theme.colors.surface.primary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      overflow: 'hidden',
    },
    cardBody: {
      flexDirection: 'row',
      padding: theme.spacing[4],
      gap: theme.spacing[4],
    },
    cardImage: {
      width: 96,
      height: 96,
      borderRadius: theme.borderRadius.card.md,
      backgroundColor: theme.colors.surface.tertiary,
    },
    cardImagePlaceholder: {
      width: 96,
      height: 96,
      borderRadius: theme.borderRadius.card.md,
      backgroundColor: theme.colors.surface.tertiary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    cardNameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: theme.spacing[2],
    },
    cardName: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      flex: 1,
      lineHeight: 20,
    },
    leadTimeBadge: {
      backgroundColor: theme.colors.primary.light ?? `${theme.colors.primary.DEFAULT}15`,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: 2,
      borderRadius: 100,
    },
    leadTimeBadgeText: {
      fontSize: 9,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    cardSku: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[1],
    },
    cardMoq: {
      fontSize: 11,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      marginTop: theme.spacing[2],
    },
    cardPriceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: theme.spacing[1],
      marginTop: theme.spacing[1],
    },
    cardPrice: {
      fontSize: 18,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
    },
    cardPriceUnit: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
    },

    // Card footer
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.surface.secondary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    buyNowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    buyNowLabel: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.secondary,
    },
    footerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    pauseButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.card.md,
      borderWidth: 1,
      borderColor: theme.colors.border.secondary,
    },
    pauseButtonText: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.primary,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.card.md,
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: fontWeightForPlatform('600'),
      color: '#FFFFFF',
    },

    // Empty state
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing[16],
      gap: theme.spacing[3],
    },
    emptyText: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.secondary,
    },
    emptySubText: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      paddingHorizontal: theme.spacing[8],
    },
  });
