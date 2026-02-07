/**
 * SessionCard Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      overflow: 'hidden',
    },
    cardLocked: {
      opacity: 0.9,
    },

    // Header Section
    header: {
      padding: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.secondary,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerContent: {
      flex: 1,
      marginRight: theme.spacing[3],
    },
    urgentBadge: {
      backgroundColor: '#FEE2E2',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing[2],
      alignSelf: 'flex-start',
    },
    postBuyBadge: {
      backgroundColor: '#D1FAE5',
    },
    postSellBadge: {
      backgroundColor: '#DBEAFE',
    },
    urgentText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#DC2626',
      textTransform: 'uppercase',
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
    },

    // Status Badges
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.lg,
      gap: 4,
    },
    statusBadgeActive: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    statusBadgeFinding: {
      backgroundColor: '#FEF3C7',
    },
    statusBadgeLocked: {
      backgroundColor: theme.colors.background.secondary,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    statusTextActive: {
      color: theme.colors.primary.DEFAULT,
    },
    statusTextFinding: {
      color: '#D97706',
    },
    statusTextLocked: {
      color: theme.colors.text.tertiary,
    },

    // Timer Section
    timerSection: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },

    // Progress Section
    progressSection: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    progressLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.text.primary,
    },
    progressValue: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.primary.DEFAULT,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.full,
    },
    progressFillFinding: {
      backgroundColor: '#F59E0B',
    },

    // Finding Matches Section (compact)
    findingSection: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.background.secondary,
    },
    findingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    findingLeft: {
      flex: 1,
    },
    findingLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    findingText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.text.primary,
      fontStyle: 'italic',
    },

    // Locked Info Section
    lockedSection: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.background.secondary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    lockedText: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      flex: 1,
    },

    // Action Section
    actionSection: {
      padding: theme.spacing[4],
      paddingTop: 0,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.lg,
      height: 48,
      gap: theme.spacing[2],
    },
    actionButtonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary.DEFAULT,
    },
    actionButtonLocked: {
      backgroundColor: theme.colors.background.secondary,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    actionButtonTextOutline: {
      color: theme.colors.primary.DEFAULT,
    },
    actionButtonTextLocked: {
      color: theme.colors.text.secondary,
    },
  });
