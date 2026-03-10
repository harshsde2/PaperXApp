import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      paddingBottom: theme.spacing[8],
    },

    // Status header
    statusHeader: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[5],
      backgroundColor: theme.colors.surface.primary,
    },
    statusBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[2],
    },
    statusBadge: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: 100,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('700'),
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: '#fff',
    },
    progressHint: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
    },
    progressBarTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.surface.tertiary,
      overflow: 'hidden',
      marginTop: theme.spacing[2],
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: theme.colors.primary.DEFAULT,
    },
    statusTitle: {
      fontSize: 22,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginTop: theme.spacing[3],
    },
    statusDescription: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
      lineHeight: 20,
    },

    // Sections
    section: {
      marginTop: theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[4],
    },

    // Countdown wrapper
    countdownWrapper: {
      alignItems: 'center',
      paddingVertical: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
    },
    countdownHint: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[2],
    },

    // Pricing breakdown
    pricingCard: {
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[2],
      padding: theme.spacing[5],
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    pricingHeader: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('700'),
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[4],
    },
    pricingProductName: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    pricingRef: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    pricingProductPrice: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.primary,
    },
    pricingProductRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingBottom: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      marginBottom: theme.spacing[3],
    },
    pricingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing[1],
    },
    pricingLabel: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    pricingValue: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.primary,
    },
    pricingDivider: {
      height: 1,
      backgroundColor: theme.colors.border.primary,
      marginVertical: theme.spacing[3],
    },
    pricingTotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pricingTotalLabel: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    pricingTotalValue: {
      fontSize: 22,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
    },

    // Facilitator note
    facilitatorNote: {
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[2],
      padding: theme.spacing[3],
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.card.md,
    },
    facilitatorText: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      lineHeight: 18,
    },

    // Dispatched info
    dispatchedCard: {
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[2],
      padding: theme.spacing[5],
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    dispatchedBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: 100,
      backgroundColor: theme.colors.primary[50],
      marginBottom: theme.spacing[3],
    },
    dispatchedBadgeText: {
      fontSize: 11,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    dispatchedTitle: {
      fontSize: 22,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    dispatchedDescription: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
      lineHeight: 20,
    },

    // Completed hero
    completedHero: {
      alignItems: 'center',
      paddingVertical: theme.spacing[6],
      backgroundColor: theme.colors.surface.primary,
    },
    completedIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[3],
    },
    completedIconText: {
      fontSize: 32,
      color: '#fff',
    },
    completedBadge: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: 100,
      backgroundColor: theme.colors.primary[50],
      marginBottom: theme.spacing[2],
    },
    completedBadgeText: {
      fontSize: 11,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.primary.DEFAULT,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    completedTitle: {
      fontSize: 22,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    completedSubtitle: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[1],
    },

    // Expired / Cancelled banner
    expiredBanner: {
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[4],
      padding: theme.spacing[5],
      borderRadius: theme.borderRadius.card.lg,
      backgroundColor: theme.colors.surface.tertiary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    expiredBadgeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
    },
    expiredBadge: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: 100,
      backgroundColor: theme.colors.surface.tertiary,
    },
    expiredBadgeText: {
      fontSize: 10,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.secondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    expiredDateText: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
    },
    expiredBody: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    expiredBodyText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },

    // Dispute card
    disputeCard: {
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[4],
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.card.lg,
      backgroundColor: theme.colors.primary[50],
      borderWidth: 1,
      borderColor: theme.colors.primary[100],
    },
    disputeHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[3],
      marginBottom: theme.spacing[3],
    },
    disputeTitle: {
      fontSize: 16,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    disputeDescription: {
      fontSize: 13,
      color: theme.colors.text.secondary,
      lineHeight: 18,
      marginBottom: theme.spacing[4],
    },
    disputeFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    disputeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.button.sm,
      backgroundColor: theme.colors.surface.primary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    disputeButtonText: {
      fontSize: 13,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.error.DEFAULT,
    },

    // Info note
    infoNote: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing[3],
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[3],
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.card.lg,
      backgroundColor: theme.colors.primary[50],
    },
    infoNoteText: {
      flex: 1,
      fontSize: 12,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },

    // Footer
    footer: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[3],
      paddingBottom: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    footerGap: {
      height: theme.spacing[3],
    },
    outlineButton: {
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.card.lg,
    },
    outlineButtonText: {
      fontSize: 15,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.secondary,
    },
    dangerOutlineButton: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2],
      borderWidth: 1,
      borderColor: 'rgba(239,68,68,0.2)',
      borderRadius: theme.borderRadius.card.lg,
    },
    dangerOutlineButtonText: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.error.DEFAULT,
    },
    footerHint: {
      fontSize: 10,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginTop: theme.spacing[3],
    },

    // Expired price strike
    priceStrikethrough: {
      fontSize: 14,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.tertiary,
      textDecorationLine: 'line-through',
    },
  });
