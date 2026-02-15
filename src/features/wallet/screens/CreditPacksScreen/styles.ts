/**
 * CreditPacksScreen Styles - Luxury Dark Theme with Gradient Cards
 */

import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '@theme/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Luxury Dark Theme Colors
const DARK_THEME = {
  background: '#0A0A0F',
  cardBackground: '#13131A',
  cardBorder: '#1F1F2E',
  surfaceLight: '#1A1A24',
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
  },
  // Pack tier colors
  tiers: {
    starter: {
      primary: '#71717A',
      secondary: '#A1A1AA',
    },
    growth: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
    },
    business: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
    },
    enterprise: {
      primary: '#06B6D4',
      secondary: '#22D3EE',
    },
  },
  accent: {
    gold: '#FFD700',
    success: '#10B981',
  },
};

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: DARK_THEME.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing[10],
    },

    // ==========================================
    // HEADER
    // ==========================================
    headerSection: {
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[1],
      paddingBottom: theme.spacing[2],
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(251, 191, 36, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[3],
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: DARK_THEME.text.primary,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 15,
      color: DARK_THEME.text.secondary,
      lineHeight: 22,
      marginTop: theme.spacing[1],
    },
    headerTitleContainer: {
      marginBottom: theme.spacing[2],
    },
    // ==========================================
    // CURRENT BALANCE - Gradient Card
    // ==========================================
    currentBalanceWrapper: {
      marginTop: theme.spacing[5],
    },
    currentBalanceCard: {
      height: 110,
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative',
    },
    gradientCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: SCREEN_WIDTH - 40,
      height: 110,
    },
    currentBalanceContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[5],
      borderWidth: 1,
      borderColor: 'rgba(255, 215, 0, 0.2)',
      borderRadius: 20,
    },
    currentBalanceIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255, 215, 0, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing[4],
    },
    currentBalanceInfo: {
      flex: 1,
    },
    currentBalanceLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: DARK_THEME.text.muted,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    currentBalanceValue: {
      fontSize: 34,
      fontWeight: '800',
      color: DARK_THEME.accent.gold,
      letterSpacing: -0.5,
    },
    currentBalanceUnit: {
      fontSize: 13,
      fontWeight: '500',
      color: DARK_THEME.text.secondary,
      marginTop: 2,
    },

    // ==========================================
    // PACKS SECTION
    // ==========================================
    packsSection: {
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[6],
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: DARK_THEME.text.muted,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: theme.spacing[4],
    },
    packsList: {
      gap: theme.spacing[4],
    },

    // ==========================================
    // PACK CARD - Gradient Background
    // ==========================================
    packCardWrapper: {
      height: 250,
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    packGradientCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: SCREEN_WIDTH - 40,
      height: 250,
    },
    packBorderOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 24,
      borderWidth: 1,
    },
    packContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: theme.spacing[5],
      justifyContent: 'space-between',
    },
    packContentWithBadge: {
      paddingTop: theme.spacing[5] + 32,
    },

    // Best Value Badge
    bestValueBadge: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 32,
      backgroundColor: DARK_THEME.tiers.growth.primary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    bestValueText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#000000',
      letterSpacing: 1.5,
    },

    // Selected Indicator
    selectedIndicator: {
      position: 'absolute',
      top: theme.spacing[4],
      right: theme.spacing[4],
      zIndex: 10,
    },
    selectedDot: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: DARK_THEME.accent.success,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Pack Top Row
    packTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    packInfoSection: {
      flex: 1,
      marginRight: theme.spacing[4],
    },
    packTierText: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.5,
      marginBottom: theme.spacing[2],
    },
    packTierTextStarter: {
      color: DARK_THEME.tiers.starter.secondary,
    },
    packTierTextGrowth: {
      color: DARK_THEME.tiers.growth.secondary,
    },
    packTierTextBusiness: {
      color: DARK_THEME.tiers.business.secondary,
    },
    packTierTextEnterprise: {
      color: DARK_THEME.tiers.enterprise.secondary,
    },
    packName: {
      fontSize: 26,
      fontWeight: '800',
      color: DARK_THEME.text.primary,
      marginBottom: theme.spacing[1],
      letterSpacing: -0.3,
    },
    packDescription: {
      fontSize: 13,
      color: DARK_THEME.text.secondary,
      lineHeight: 18,
    },

    // Credits Box
    packCreditsBox: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderRadius: 16,
      minWidth: 90,
    },
    packCreditsBoxStarter: {
      backgroundColor: 'rgba(161, 161, 170, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(161, 161, 170, 0.25)',
    },
    packCreditsBoxGrowth: {
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(251, 191, 36, 0.25)',
    },
    packCreditsBoxBusiness: {
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(139, 92, 246, 0.25)',
    },
    packCreditsBoxEnterprise: {
      backgroundColor: 'rgba(34, 211, 238, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(34, 211, 238, 0.25)',
    },
    packCreditsValue: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    packCreditsValueStarter: {
      color: DARK_THEME.tiers.starter.secondary,
    },
    packCreditsValueGrowth: {
      color: DARK_THEME.tiers.growth.secondary,
    },
    packCreditsValueBusiness: {
      color: DARK_THEME.tiers.business.secondary,
    },
    packCreditsValueEnterprise: {
      color: DARK_THEME.tiers.enterprise.secondary,
    },
    packCreditsLabel: {
      fontSize: 9,
      fontWeight: '700',
      color: DARK_THEME.text.muted,
      letterSpacing: 1,
      marginTop: 2,
    },

    // Pack Price Row
    packPriceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    packPriceContainer: {
      flex: 1,
    },
    packPriceMain: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    packPriceCurrency: {
      fontSize: 18,
      fontWeight: '600',
      color: DARK_THEME.text.primary,
      marginRight: 2,
    },
    packPrice: {
      fontSize: 28,
      fontWeight: '800',
      color: DARK_THEME.text.primary,
      letterSpacing: -0.5,
    },
    packGst: {
      fontSize: 11,
      color: DARK_THEME.text.muted,
      marginTop: 2,
    },
    packActions: {
      alignItems: 'flex-end',
    },
    validityTag: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    validityDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: DARK_THEME.accent.success,
      marginRight: theme.spacing[1],
    },
    validityText: {
      fontSize: 11,
      color: DARK_THEME.text.muted,
    },
    packSelectButton: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2] + 2,
      borderRadius: 12,
      borderWidth: 1.5,
    },
    packSelectButtonStarter: {
      backgroundColor: 'transparent',
      borderColor: DARK_THEME.tiers.starter.primary,
    },
    packSelectButtonGrowth: {
      backgroundColor: DARK_THEME.tiers.growth.primary,
      borderColor: DARK_THEME.tiers.growth.primary,
    },
    packSelectButtonBusiness: {
      backgroundColor: 'transparent',
      borderColor: DARK_THEME.tiers.business.primary,
    },
    packSelectButtonEnterprise: {
      backgroundColor: 'transparent',
      borderColor: DARK_THEME.tiers.enterprise.primary,
    },
    packSelectButtonSelected: {
      backgroundColor: DARK_THEME.accent.success,
      borderColor: DARK_THEME.accent.success,
    },
    packSelectButtonText: {
      fontSize: 13,
      fontWeight: '700',
    },
    packSelectButtonTextStarter: {
      color: DARK_THEME.tiers.starter.secondary,
    },
    packSelectButtonTextGrowth: {
      color: '#000000',
    },
    packSelectButtonTextBusiness: {
      color: DARK_THEME.tiers.business.secondary,
    },
    packSelectButtonTextEnterprise: {
      color: DARK_THEME.tiers.enterprise.secondary,
    },
    packSelectButtonTextSelected: {
      color: '#FFFFFF',
    },

    // ==========================================
    // PAYMENT METHOD - Gradient Cards
    // ==========================================
    paymentSection: {
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[8],
    },
    paymentMethodsRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    paymentMethodWrapper: {
      flex: 1,
      height: 100,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
    },
    paymentGradientCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    paymentBorderOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    paymentBorderSelected: {
      borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    paymentMethodContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing[3],
    },
    paymentMethodIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    paymentMethodIconWrapperSelected: {
      backgroundColor: 'rgba(251, 191, 36, 0.15)',
    },
    paymentMethodIcon: {
      fontSize: 22,
    },
    paymentMethodName: {
      fontSize: 12,
      fontWeight: '600',
      color: DARK_THEME.text.secondary,
      textAlign: 'center',
    },
    paymentMethodNameSelected: {
      color: DARK_THEME.tiers.growth.secondary,
    },

    // ==========================================
    // ORDER SUMMARY - Gradient Card
    // ==========================================
    summarySection: {
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[8],
    },
    summaryCardWrapper: {
      height: 300,
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative',
    },
    summaryGradientCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: SCREEN_WIDTH - 40,
      height: 300,
    },
    summaryBorderOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255, 215, 0, 0.15)',
    },
    summaryContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: theme.spacing[5],
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing[3],
    },
    summaryDivider: {
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    },
    summaryLabel: {
      fontSize: 14,
      color: DARK_THEME.text.secondary,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: DARK_THEME.text.primary,
    },
    summaryTotalRow: {
      marginTop: theme.spacing[2],
      paddingTop: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 215, 0, 0.2)',
    },
    summaryTotalLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: DARK_THEME.text.primary,
    },
    summaryTotalValue: {
      fontSize: 26,
      fontWeight: '800',
      color: DARK_THEME.accent.gold,
    },
    creditsYouGet: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing[4],
      paddingTop: theme.spacing[3],
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.06)',
    },
    creditsYouGetText: {
      fontSize: 14,
      color: DARK_THEME.text.secondary,
      marginLeft: theme.spacing[2],
    },
    creditsYouGetValue: {
      fontSize: 20,
      fontWeight: '800',
      color: DARK_THEME.accent.success,
      marginLeft: theme.spacing[2],
    },

    // ==========================================
    // PURCHASE BUTTON
    // ==========================================
    purchaseSection: {
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[8],
    },
    purchaseButton: {
      backgroundColor: DARK_THEME.tiers.growth.primary,
      paddingVertical: theme.spacing[4] + 4,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing[2],
      shadowColor: DARK_THEME.tiers.growth.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    purchaseButtonDisabled: {
      backgroundColor: DARK_THEME.cardBorder,
      shadowOpacity: 0,
      elevation: 0,
    },
    purchaseButtonText: {
      color: '#000000',
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: 0.3,
    },
    secureNote: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing[4],
    },
    secureNoteText: {
      fontSize: 12,
      color: DARK_THEME.text.muted,
      marginLeft: theme.spacing[2],
    },

    // ==========================================
    // LOADING & EMPTY
    // ==========================================
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: DARK_THEME.background,
    },
    loadingText: {
      marginTop: theme.spacing[4],
      fontSize: 15,
      color: DARK_THEME.text.secondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[6],
      backgroundColor: DARK_THEME.background,
    },
    emptyText: {
      fontSize: 16,
      color: DARK_THEME.text.muted,
      textAlign: 'center',
    },
  });

// Export dark theme colors for use in component
export { DARK_THEME };
