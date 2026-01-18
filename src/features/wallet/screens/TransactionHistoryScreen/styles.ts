/**
 * TransactionHistoryScreen Styles - Premium Design
 */

import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '@theme/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BALANCE_CARD_HEIGHT = 90;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },

    // ==========================================
    // HEADER
    // ==========================================
    header: {
      backgroundColor: theme.colors.background.primary,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[4],
      borderBottomLeftRadius: theme.borderRadius['2xl'],
      borderBottomRightRadius: theme.borderRadius['2xl'],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },

    // ==========================================
    // GRADIENT BALANCE CARD
    // ==========================================
    balanceCardWrapper: {
      marginBottom: theme.spacing[4],
    },
    balanceCard: {
      height: BALANCE_CARD_HEIGHT,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      position: 'relative',
    },
    balanceCardGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: SCREEN_WIDTH - 32,
      height: BALANCE_CARD_HEIGHT,
    },
    balanceCardContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
    },
    balanceIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[3],
    },
    balanceContent: {
      flex: 1,
    },
    balanceLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    balanceValue: {
      fontSize: 32,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: -0.5,
    },
    creditsUnitContainer: {
      alignItems: 'flex-end',
    },
    creditsUnit: {
      fontSize: 14,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: theme.spacing[2],
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#4ADE80',
      marginRight: theme.spacing[1],
      position: 'absolute',
      bottom: 2,
      right: 52,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.6)',
      letterSpacing: 0.5,
    },
    walletId: {
      fontSize: 10,
      color: 'rgba(255, 255, 255, 0.5)',
      marginTop: 2,
    },

    // ==========================================
    // FILTER TABS
    // ==========================================
    filterContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[1],
    },
    filterTab: {
      flex: 1,
      paddingVertical: theme.spacing[2] + 2,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    filterTabActive: {
      backgroundColor: theme.colors.primary.DEFAULT,
      shadowColor: theme.colors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    filterTabText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    filterTabTextActive: {
      color: theme.colors.white,
    },

    // ==========================================
    // LIST
    // ==========================================
    listContainer: {
      flex: 1,
    },
    listContent: {
      paddingTop: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[6],
      backgroundColor: theme.colors.background.primary,
      marginHorizontal: 0,
      borderRadius: theme.borderRadius.xl,
    },
    transactionsCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    transactionDivider: {
      height: 1,
      backgroundColor: theme.colors.border.light,
      marginHorizontal: theme.spacing[4],
    },

    // Section Header (for grouped by date)
    sectionHeader: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      backgroundColor: theme.colors.background.secondary,
    },
    sectionHeaderText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // ==========================================
    // EMPTY STATE
    // ==========================================
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[6],
    },
    emptyCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[8],
      alignItems: 'center',
      width: '100%',
    },
    emptyIconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 20,
    },

    // ==========================================
    // LOADING & ERROR
    // ==========================================
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: theme.spacing[3],
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    loadingMore: {
      paddingVertical: theme.spacing[4],
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[6],
    },
    errorCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[6],
      alignItems: 'center',
      width: '100%',
    },
    errorIconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#FEE2E2',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.error.DEFAULT,
      textAlign: 'center',
      marginBottom: theme.spacing[4],
    },
    retryButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[6],
      borderRadius: theme.borderRadius.lg,
    },
    retryButtonText: {
      color: theme.colors.white,
      fontSize: 14,
      fontWeight: '600',
    },
  });
