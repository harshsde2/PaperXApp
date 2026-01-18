/**
 * WalletScreen Styles - Premium Design
 */

import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '@theme/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    scrollContent: {
      paddingBottom: theme.spacing[8],
    },

    // ==========================================
    // PREMIUM BALANCE CARD
    // ==========================================
    balanceCardWrapper: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[2],
      marginBottom: 10,
    },
    balanceCard: {
      borderRadius: theme.borderRadius['2xl'],
      overflow: 'hidden',
      position: 'relative',
    },
    balanceCardGradient: {
      padding: theme.spacing[6],
      paddingTop: theme.spacing[5],
      paddingBottom: theme.spacing[8],
    },
    balanceCardPattern: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 200,
      height: 200,
      opacity: 0.1,
    },
    balanceCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[4],
    },
    balanceCardTitleSection: {
      flex: 1,
    },
    balanceCardIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    balanceLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.7)',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: theme.spacing[1],
    },
    balanceValue: {
      fontSize: 44,
      fontWeight: '800',
      color: theme.colors.white,
      letterSpacing: -1,
    },
    balanceUnit: {
      fontSize: 18,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.8)',
      marginLeft: theme.spacing[2],
    },
    balanceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing[4],
      paddingTop: theme.spacing[4],
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.15)',
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#4ADE80',
      marginRight: theme.spacing[2],
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.8)',
      letterSpacing: 0.5,
    },
    walletIdText: {
      fontSize: 11,
      color: 'rgba(255, 255, 255, 0.5)',
      marginLeft: 'auto',
    },

    // ==========================================
    // QUICK ACTIONS - Floating Cards
    // ==========================================
    quickActionsContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing[4],
      marginTop: theme.spacing[2],
      gap: theme.spacing[3],
    },
    quickActionCard: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    quickActionIconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
    },
    quickActionIconBuy: {
      backgroundColor: '#ECFDF5',
    },
    quickActionIconHistory: {
      backgroundColor: '#EFF6FF',
    },
    quickActionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    quickActionSubtitle: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },

    // ==========================================
    // STATS CARDS
    // ==========================================
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing[4],
      marginTop: theme.spacing[5],
      gap: theme.spacing[3],
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    statIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    statIconWrapper: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[2],
    },
    statIconCredit: {
      backgroundColor: '#DCFCE7',
    },
    statIconDebit: {
      backgroundColor: '#FEE2E2',
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      fontWeight: '500',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    statValueCredit: {
      color: '#16A34A',
    },
    statValueDebit: {
      color: '#DC2626',
    },

    // ==========================================
    // SECTION
    // ==========================================
    section: {
      marginTop: theme.spacing[6],
      paddingHorizontal: theme.spacing[4],
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionIcon: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[2],
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing[1],
      paddingHorizontal: theme.spacing[2],
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary.DEFAULT,
      marginRight: theme.spacing[1],
    },

    // ==========================================
    // TRANSACTIONS LIST
    // ==========================================
    transactionsCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    transactionDivider: {
      height: 1,
      backgroundColor: theme.colors.border.primary,
      marginHorizontal: theme.spacing[4],
    },

    // Empty State
    emptyContainer: {
      padding: theme.spacing[8],
      alignItems: 'center',
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
      fontSize: 17,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: theme.spacing[4],
    },
    emptyButton: {
      marginTop: theme.spacing[4],
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[6],
      borderRadius: theme.borderRadius.lg,
    },
    emptyButtonText: {
      color: theme.colors.white,
      fontSize: 14,
      fontWeight: '600',
    },

    // ==========================================
    // LOADING & ERROR STATES
    // ==========================================
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
    },
    loadingCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[8],
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 5,
    },
    loadingText: {
      marginTop: theme.spacing[4],
      fontSize: 15,
      fontWeight: '500',
      color: theme.colors.text.secondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[6],
      backgroundColor: theme.colors.background.secondary,
    },
    errorCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[6],
      alignItems: 'center',
      width: '100%',
      maxWidth: 320,
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
    errorTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
      textAlign: 'center',
    },
    errorText: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing[5],
      lineHeight: 20,
    },
    retryButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[8],
      borderRadius: theme.borderRadius.lg,
    },
    retryButtonText: {
      color: theme.colors.white,
      fontSize: 15,
      fontWeight: '600',
    },
  });
