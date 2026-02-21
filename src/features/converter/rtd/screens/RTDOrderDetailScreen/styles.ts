import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
      padding: theme.spacing[4],
      paddingBottom: theme.spacing[8],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[6],
    },
    errorText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing[3],
    },

    // Status header
    statusHeader: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
    },
    statusHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    statusTitle: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: 18,
      color: theme.colors.text.primary,
    },
    statusDescription: {
      fontFamily: theme.fontFamily.regular,
      fontSize: 13,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },

    // Countdown
    countdownContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.warning.DEFAULT + '15',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[3],
      marginTop: theme.spacing[3],
    },
    countdownIcon: {
      marginRight: theme.spacing[2],
    },
    countdownTextContainer: {
      flex: 1,
    },
    countdownLabel: {
      fontFamily: theme.fontFamily.regular,
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    countdownValue: {
      fontFamily: theme.fontFamily.bold,
      fontSize: 16,
      color: theme.colors.warning.DEFAULT,
      marginTop: 2,
    },
    countdownExpired: {
      fontFamily: theme.fontFamily.bold,
      fontSize: 14,
      color: theme.colors.error.DEFAULT,
      marginTop: 2,
    },

    // Payout section
    payoutCard: {
      backgroundColor: theme.colors.success.DEFAULT + '10',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.success.DEFAULT + '30',
    },
    payoutTitle: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: 15,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    payoutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    payoutAmount: {
      fontFamily: theme.fontFamily.bold,
      fontSize: 20,
      color: theme.colors.success.DEFAULT,
    },
    payoutStatus: {
      fontFamily: theme.fontFamily.medium,
      fontSize: 12,
      color: theme.colors.success.DEFAULT,
      backgroundColor: theme.colors.success.DEFAULT + '20',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
    },

    // Dispute / Cancelled banner
    bannerCard: {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
      borderWidth: 1,
    },
    bannerTitle: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: 15,
      marginBottom: theme.spacing[1],
    },
    bannerText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: 13,
      lineHeight: 18,
    },

    // Tracking info
    trackingCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
    },
    trackingTitle: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: 15,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    trackingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    trackingLabel: {
      fontFamily: theme.fontFamily.regular,
      fontSize: 13,
      color: theme.colors.text.secondary,
    },
    trackingValue: {
      fontFamily: theme.fontFamily.medium,
      fontSize: 13,
      color: theme.colors.text.primary,
    },

    // Section
    sectionContainer: {
      marginBottom: theme.spacing[4],
    },
    sectionTitle: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: 16,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
    },

    // Action buttons area
    actionContainer: {
      marginTop: theme.spacing[4],
      paddingTop: theme.spacing[4],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.DEFAULT,
    },
  });
