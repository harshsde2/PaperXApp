/**
 * SessionDetailsScreen Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },

    // Header
    header: {
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text.primary,
      flex: 1,
      textAlign: 'center',
    },
    filterButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Requirement Summary Card
    summaryCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      margin: theme.spacing[4],
      marginBottom: theme.spacing[2],
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryContent: {
      flexDirection: 'row',
      padding: theme.spacing[4],
      gap: theme.spacing[4],
    },
    summaryImage: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.secondary,
    },
    summaryImagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    summaryDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    summaryLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.primary.DEFAULT,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[1],
    },
    summaryTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    summarySubtitle: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
    },

    // Timer in Summary
    summaryTimer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    timerLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginBottom: theme.spacing[2],
    },
    timerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing[3],
    },
    timerBlock: {
      alignItems: 'center',
      gap: 4,
    },
    timerValue: {
      width: 48,
      height: 40,
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timerValueText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary.DEFAULT,
    },
    timerUnit: {
      fontSize: 9,
      fontWeight: '700',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
    },

    // Section Header
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    sectionCount: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.primary.DEFAULT,
      backgroundColor: theme.colors.primary.light,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.full,
    },

    // Filter Chips
    filterChipsContainer: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    filterChipsScroll: {
      flexDirection: 'row',
      gap: theme.spacing[2],
    },
    filterChip: {
      height: 32,
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primary.DEFAULT,
      borderColor: theme.colors.primary.DEFAULT,
    },
    filterChipText: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.text.primary,
    },
    filterChipTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },

    // Response List
    responseList: {
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[8],
    },
    responseCard: {
      marginBottom: theme.spacing[4],
    },

    // Empty State
    emptyContainer: {
      paddingVertical: theme.spacing[12],
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },

    // Loading
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Receiver view
    posterLine: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[2],
      paddingBottom: theme.spacing[1],
    },
    posterLineText: {
      fontSize: 13,
      color: theme.colors.text.tertiary,
    },
    receiverActionSection: {
      padding: theme.spacing[4],
      paddingTop: theme.spacing[2],
    },
    receiverActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2],
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
    },
    receiverActionButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    receiverStatus: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[2],
    },
    receiverStatusText: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    receiverLockedText: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
      textAlign: 'center',
      fontSize: 14,
      color: theme.colors.text.tertiary,
    },
  });
