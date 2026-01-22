/**
 * PaymentConfirmationScreen Styles
 */

import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '@theme/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = 160;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    scrollContent: {
      paddingBottom: theme.spacing[8],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[3],
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
      flex: 1,
    },

    // ==========================================
    // SECTION STYLES
    // ==========================================
    section: {
      paddingHorizontal: theme.spacing[4],
      marginTop: theme.spacing[5],
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[3],
    },

    // ==========================================
    // LISTING DETAILS CARD
    // ==========================================
    listingCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    listingImage: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.secondary,
      marginRight: theme.spacing[4],
    },
    listingImagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[4],
    },
    listingContent: {
      flex: 1,
    },
    listingTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    listingSubtitle: {
      fontSize: 13,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
    },
    tag: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary.light,
    },
    tagUrgent: {
      backgroundColor: '#F3E8FF',
    },
    tagText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.primary.DEFAULT,
    },
    tagTextUrgent: {
      color: '#9333EA',
    },

    // ==========================================
    // WALLET CARD WITH GRADIENT
    // ==========================================
    walletCardWrapper: {
      paddingHorizontal: theme.spacing[4],
      marginTop: theme.spacing[5],
    },
    walletCard: {
      borderRadius: theme.borderRadius['2xl'],
      overflow: 'hidden',
      position: 'relative',
    },
    walletCardGradient: {
      padding: theme.spacing[5],
    },
    walletHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
    },
    walletIconWrapper: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[2],
    },
    walletLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    balanceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
    },
    balanceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    balanceValue: {
      fontSize: 36,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: -1,
    },
    balanceUnit: {
      fontSize: 16,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.8)',
      marginLeft: theme.spacing[2],
    },
    buyCreditsButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    buyCreditsText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    walletInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing[4],
      paddingTop: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.15)',
    },
    walletInfoIcon: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[2],
    },
    walletInfoText: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.7)',
    },

    // ==========================================
    // COST BREAKDOWN CARD
    // ==========================================
    costCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    costRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing[3],
    },
    costRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      borderStyle: 'dashed',
    },
    costLabel: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    costValue: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.primary,
    },
    totalRow: {
      marginTop: theme.spacing[2],
      paddingTop: theme.spacing[3],
      borderTopWidth: 2,
      borderTopColor: theme.colors.border.primary,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.primary.DEFAULT,
    },

    // ==========================================
    // BOTTOM BUTTONS
    // ==========================================
    bottomContainer: {
      padding: theme.spacing[4],
      backgroundColor: theme.colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    payButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[5],
      shadowColor: theme.colors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    payButtonDisabled: {
      backgroundColor: theme.colors.text.tertiary,
      shadowOpacity: 0,
    },
    payButtonText: {
      fontSize: 17,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    payButtonBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.lg,
    },
    payButtonBadgeText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    cancelButton: {
      paddingVertical: theme.spacing[3],
      alignItems: 'center',
      marginTop: theme.spacing[2],
    },
    cancelButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
    },

    // ==========================================
    // LOADING STATE
    // ==========================================
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
    loadingCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[6],
      alignItems: 'center',
      width: SCREEN_WIDTH * 0.8,
      maxWidth: 300,
    },
    loadingText: {
      marginTop: theme.spacing[4],
      fontSize: 15,
      fontWeight: '500',
      color: theme.colors.text.secondary,
    },
  });
