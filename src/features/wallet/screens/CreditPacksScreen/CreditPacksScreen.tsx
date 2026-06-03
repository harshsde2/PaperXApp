/**
 * CreditPacksScreen - Luxury Dark Theme with Gradient Cards
 * Premium credit pack purchase experience with rich gradient backgrounds
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import {
  useGetWalletBalance,
  useGetCreditPacks,
  useCreateRazorpayOrder,
  useVerifyRazorpayPayment,
  CreditPack,
} from '@services/api';
import type { VerifyRazorpayPaymentRequest } from '@services/api/walletApi/@types';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { WalletSkeleton } from '@shared/components/skeletons';
import { createStyles, DARK_THEME } from './styles';
import {
  formatPurchaseError,
  isRazorpaySdkError,
  isRazorpayUserCancellation,
  openRazorpayForWalletOrder,
} from './razorpayCheckout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PackTier = 'starter' | 'growth' | 'business' | 'enterprise';

// Get tier based on pack slug or index
const getPackTier = (pack: CreditPack, index: number): PackTier => {
  const slug = pack.slug?.toLowerCase() || '';
  if (slug.includes('starter') || index === 0) return 'starter';
  if (slug.includes('growth') || pack.is_best_value) return 'growth';
  if (slug.includes('business') || index === 2) return 'business';
  return 'enterprise';
};

// Rich gradient colors for each tier
const TIER_GRADIENTS: Record<PackTier, { colors: string[]; border: string }> = {
  starter: {
    colors: ['#1A1A2E', '#16213E', '#1A1A2E'],
    border: 'rgba(113, 113, 122, 0.3)',
  },
  growth: {
    colors: ['#1A1500', '#2D2200', '#1A1500'],
    border: 'rgba(251, 191, 36, 0.3)',
  },
  business: {
    colors: ['#1A0A2E', '#2D1B4E', '#1A0A2E'],
    border: 'rgba(139, 92, 246, 0.3)',
  },
  enterprise: {
    colors: ['#0A1A1E', '#0D2A30', '#0A1A1E'],
    border: 'rgba(34, 211, 238, 0.3)',
  },
};

// Balance card gradient (black to gold)
const BALANCE_GRADIENT = ['#0D0D0D', '#1A1400', '#2A1F00', '#1A1400', '#0D0D0D'];

// Card dimensions
const CARD_PADDING = 40;
const BALANCE_CARD_HEIGHT = 110;
const PACK_CARD_HEIGHT = 250;
const SUMMARY_CARD_HEIGHT = 300;

const CreditPacksScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const { data: wallet } = useGetWalletBalance();
  const {
    data: creditPacks,
    isLoading: packsLoading,
    isError: packsError,
    error: packsErrorMessage,
    refetch: refetchPacks,
  } = useGetCreditPacks();
  const { mutateAsync: createRazorpayOrder, isPending: creatingOrder } = useCreateRazorpayOrder();
  const { mutateAsync: verifyRazorpayPayment, isPending: verifyingPayment } =
    useVerifyRazorpayPayment();
  const showSkeleton = useSkeleton(packsLoading);

  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const pendingVerifyRef = useRef<VerifyRazorpayPaymentRequest | null>(null);

  const purchasing = creatingOrder || verifyingPayment || checkoutBusy;

  /** Resume flows push CreditPacks on top of the caller; pop preserves that screen's state (e.g. RTD draft form). */
  const navigateAfterSuccessfulPurchase = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    if (__DEV__) {
      // If you still see POST /wallet/purchase in logs, Metro is serving an old bundle — reset cache and rebuild.
      console.log('[CreditPacksScreen] wallet pay flow: razorpay (create order + checkout + verify)');
    }
  }, []);

  const handlePackSelect = useCallback((pack: CreditPack) => {
    setSelectedPack(pack);
  }, []);

  const showVerifyRetry = useCallback(
    (message: string) => {
      const body = pendingVerifyRef.current;
      if (!body) {
        Alert.alert('Payment', message);
        return;
      }
      Alert.alert('Confirm payment', message, [
        { text: 'Cancel', style: 'cancel', onPress: () => {} },
        {
          text: 'Retry',
          onPress: async () => {
            try {
              const res = await verifyRazorpayPayment(body);
              pendingVerifyRef.current = null;
              dispatch(
                showToast({
                  message: `Successfully purchased ${res.credits_added} credits!`,
                  type: 'success',
                })
              );
              navigateAfterSuccessfulPurchase();
            } catch (e) {
              Alert.alert('Still could not confirm', formatPurchaseError(e));
            }
          },
        },
      ]);
    },
    [dispatch, navigateAfterSuccessfulPurchase, verifyRazorpayPayment]
  );

  const runRazorpayPurchase = useCallback(async () => {
    if (!selectedPack) {
      return;
    }
    pendingVerifyRef.current = null;
    try {
      const order = await createRazorpayOrder({
        credit_pack_id: selectedPack.id,
      });
      setCheckoutBusy(true);
      const prefillName = user?.company_name?.trim() || undefined;
      const checkoutResult = await openRazorpayForWalletOrder(order, {
        contact: user?.mobile,
        name: prefillName,
      });
      pendingVerifyRef.current = checkoutResult;
      const response = await verifyRazorpayPayment(checkoutResult);
      pendingVerifyRef.current = null;
      dispatch(
        showToast({
          message: `Successfully purchased ${response.credits_added} credits!`,
          type: 'success',
        })
      );
      navigateAfterSuccessfulPurchase();
    } catch (err) {
      if (isRazorpayUserCancellation(err)) {
        return;
      }
      if (isRazorpaySdkError(err)) {
        Alert.alert('Payment', formatPurchaseError(err));
        return;
      }
      const msg = formatPurchaseError(err);
      if (pendingVerifyRef.current) {
        showVerifyRetry(
          `${msg}\n\nIf you completed payment in Razorpay, tap Retry to confirm with the server.`
        );
      } else {
        Alert.alert('Purchase Failed', msg);
      }
    } finally {
      setCheckoutBusy(false);
    }
  }, [
    selectedPack,
    user,
    createRazorpayOrder,
    verifyRazorpayPayment,
    dispatch,
    navigateAfterSuccessfulPurchase,
    showVerifyRetry,
  ]);

  const handlePurchase = useCallback(() => {
    if (!selectedPack) {
      Alert.alert('Select a Pack', 'Please select a credit pack to continue.');
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `You're about to purchase ${selectedPack.credits} credits for ₹${selectedPack.total_price.toLocaleString('en-IN')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay',
          onPress: () => {
            runRazorpayPurchase().catch(() => {});
          },
        },
      ]
    );
  }, [selectedPack, runRazorpayPurchase]);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-IN');
  };

  // Get style based on tier
  const getTierStyles = useCallback(
    (tier: PackTier, isSelected: boolean) => {
      const tierStyleMap = {
        starter: {
          badgeText: styles.packTierTextStarter,
          creditsBox: styles.packCreditsBoxStarter,
          creditsValue: styles.packCreditsValueStarter,
          button: isSelected
            ? styles.packSelectButtonSelected
            : styles.packSelectButtonStarter,
          buttonText: isSelected
            ? styles.packSelectButtonTextSelected
            : styles.packSelectButtonTextStarter,
        },
        growth: {
          badgeText: styles.packTierTextGrowth,
          creditsBox: styles.packCreditsBoxGrowth,
          creditsValue: styles.packCreditsValueGrowth,
          button: isSelected
            ? styles.packSelectButtonSelected
            : styles.packSelectButtonGrowth,
          buttonText: isSelected
            ? styles.packSelectButtonTextSelected
            : styles.packSelectButtonTextGrowth,
        },
        business: {
          badgeText: styles.packTierTextBusiness,
          creditsBox: styles.packCreditsBoxBusiness,
          creditsValue: styles.packCreditsValueBusiness,
          button: isSelected
            ? styles.packSelectButtonSelected
            : styles.packSelectButtonBusiness,
          buttonText: isSelected
            ? styles.packSelectButtonTextSelected
            : styles.packSelectButtonTextBusiness,
        },
        enterprise: {
          badgeText: styles.packTierTextEnterprise,
          creditsBox: styles.packCreditsBoxEnterprise,
          creditsValue: styles.packCreditsValueEnterprise,
          button: isSelected
            ? styles.packSelectButtonSelected
            : styles.packSelectButtonEnterprise,
          buttonText: isSelected
            ? styles.packSelectButtonTextSelected
            : styles.packSelectButtonTextEnterprise,
        },
      };
      return tierStyleMap[tier];
    },
    [styles]
  );

  if (showSkeleton) {
    return (
      <ScreenWrapper safeAreaEdges={['top']} backgroundColor={DARK_THEME.background}>
        <StatusBar barStyle="light-content" backgroundColor={DARK_THEME.background} />
        <View style={styles.loadingContainer}>
          <WalletSkeleton transactionCount={4} />
        </View>
      </ScreenWrapper>
    );
  }

  if (packsError) {
    const err = packsErrorMessage as { response?: { status?: number; data?: { message?: string } }; message?: string };
    const message =
      err?.response?.status === 401
        ? 'Please log in to view credit packs.'
        : err?.response?.data?.message || err?.message || 'Could not load credit packs. Tap Retry.';
    return (
      <ScreenWrapper safeAreaEdges={['top']} backgroundColor={DARK_THEME.background}>
        <StatusBar barStyle="light-content" backgroundColor={DARK_THEME.background} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetchPacks()}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  if (!creditPacks || creditPacks.length === 0) {
    return (
      <ScreenWrapper safeAreaEdges={['top']} backgroundColor={DARK_THEME.background}>
        <StatusBar barStyle="light-content" backgroundColor={DARK_THEME.background} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No credit packs available at the moment.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const cardWidth = SCREEN_WIDTH - CARD_PADDING;

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={DARK_THEME.background}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_THEME.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTitleContainer}>
            <Text variant="h4" color='white' fontWeight="semibold">How would you like to pay to post your requirement?</Text>
          </View>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIcon}>
              <AppIcon.Wallet width={22} height={22} color={DARK_THEME.tiers.growth.secondary} />
            </View>
            <Text style={styles.headerTitle}>Buy Credits</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Choose a pack that suits your business needs
          </Text>

          {/* Current Balance - Gradient Card */}
          <View style={styles.currentBalanceWrapper}>
            <View style={styles.currentBalanceCard}>
              {/* Gradient Background */}
              <Canvas style={styles.gradientCanvas}>
                <RoundedRect x={0} y={0} width={cardWidth} height={BALANCE_CARD_HEIGHT} r={20}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(cardWidth, BALANCE_CARD_HEIGHT)}
                    colors={BALANCE_GRADIENT}
                  />
                </RoundedRect>
              </Canvas>

              {/* Content */}
              <View style={styles.currentBalanceContent}>
                <View style={styles.currentBalanceIcon}>
                  <AppIcon.Wallet width={26} height={26} color={DARK_THEME.accent.gold} />
                </View>
                <View style={styles.currentBalanceInfo}>
                  <Text style={styles.currentBalanceLabel}>Current Balance</Text>
                  <Text style={styles.currentBalanceValue}>
                    {wallet?.balance?.toLocaleString('en-IN') ?? '0'}
                  </Text>
                  <Text style={styles.currentBalanceUnit}>Credits Available</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Credit Packs */}
        <View style={styles.packsSection}>
          <Text style={styles.sectionLabel}>Select Your Pack</Text>
          <View style={styles.packsList}>
            {creditPacks.map((pack, index) => {
              const isSelected = selectedPack?.id === pack.id;
              const tier = getPackTier(pack, index);
              const tierStyles = getTierStyles(tier, isSelected);
              const tierGradient = TIER_GRADIENTS[tier];

              return (
                <TouchableOpacity
                  key={pack.id}
                  style={[
                    styles.packCardWrapper,
                    { borderColor: isSelected ? tierGradient.border : 'transparent' },
                  ]}
                  onPress={() => handlePackSelect(pack)}
                  activeOpacity={0.9}
                  disabled={purchasing}
                >
                  {/* Gradient Background */}
                  <Canvas style={styles.packGradientCanvas}>
                    <RoundedRect x={0} y={0} width={cardWidth} height={PACK_CARD_HEIGHT} r={24}>
                      <LinearGradient
                        start={vec(0, 0)}
                        end={vec(cardWidth, PACK_CARD_HEIGHT)}
                        colors={tierGradient.colors}
                      />
                    </RoundedRect>
                  </Canvas>

                  {/* Border Overlay */}
                  <View
                    style={[
                      styles.packBorderOverlay,
                      { borderColor: tierGradient.border },
                    ]}
                  />

                  {/* Best Value Badge */}
                  {pack.is_best_value && (
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueText}>MOST POPULAR</Text>
                    </View>
                  )}

                  {/* Selected Indicator */}
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <View style={styles.selectedDot} />
                    </View>
                  )}

                  {/* Pack Content */}
                  <View
                    style={[
                      styles.packContent,
                      pack.is_best_value && styles.packContentWithBadge,
                    ]}
                  >
                    <View style={styles.packTopRow}>
                      <View style={styles.packInfoSection}>
                        {/* Tier Badge */}
                        <Text style={[styles.packTierText, tierStyles.badgeText]}>
                          {tier.toUpperCase()} PACK
                        </Text>
                        <Text style={styles.packName}>{pack.name}</Text>
                        <Text style={styles.packDescription} numberOfLines={2}>
                          {pack.description}
                        </Text>
                      </View>

                      {/* Credits Box */}
                      <View style={[styles.packCreditsBox, tierStyles.creditsBox]}>
                        <Text style={[styles.packCreditsValue, tierStyles.creditsValue]}>
                          {pack.credits}
                        </Text>
                        <Text style={styles.packCreditsLabel}>CREDITS</Text>
                      </View>
                    </View>

                    {/* Price Row */}
                    <View style={styles.packPriceRow}>
                      <View style={styles.packPriceContainer}>
                        <Text style={styles.packGst}>
                          ₹{formatPrice(pack.price)} + {pack.gst_percentage}% GST
                        </Text>
                        <View style={styles.packPriceMain}>
                          <Text style={styles.packPriceCurrency}>₹</Text>
                          <Text style={styles.packPrice}>{formatPrice(pack.total_price)}</Text>
                        </View>
                      </View>

                      {/* Validity & Select */}
                      <View style={styles.packActions}>
                        <View style={styles.validityTag}>
                          <View style={styles.validityDot} />
                          <Text style={styles.validityText}>{pack.validity}</Text>
                        </View>
                        <View style={[styles.packSelectButton, tierStyles.button]}>
                          <Text style={[styles.packSelectButtonText, tierStyles.buttonText]}>
                            {isSelected ? 'Selected ✓' : 'Select'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Payment Method */}
        {selectedPack && (
          <>
            <View style={styles.paymentSection}>
              <Text style={styles.sectionLabel}>Payment</Text>
              <View style={styles.razorpayHintBox}>
                <Text style={styles.razorpayHintText}>
                  You will complete UPI, card, or net banking in the secure Razorpay checkout
                  window. Your card or UPI details are never stored on this device.
                </Text>
              </View>
            </View>

            {/* Order Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionLabel}>Order Summary</Text>
              <View style={styles.summaryCardWrapper}>
                {/* Gradient Background */}
                <Canvas style={styles.summaryGradientCanvas}>
                  <RoundedRect x={0} y={0} width={cardWidth} height={SUMMARY_CARD_HEIGHT} r={20}>
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(cardWidth, SUMMARY_CARD_HEIGHT)}
                      colors={['#0D0D0D', '#1A1400', '#0D0D0D']}
                    />
                  </RoundedRect>
                </Canvas>
                <View style={styles.summaryBorderOverlay} />

                <View style={styles.summaryContent}>
                  <View style={[styles.summaryRow, styles.summaryDivider]}>
                    <Text style={styles.summaryLabel}>Pack</Text>
                    <Text style={styles.summaryValue}>{selectedPack.name}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryDivider]}>
                    <Text style={styles.summaryLabel}>Base Price</Text>
                    <Text style={styles.summaryValue}>₹{formatPrice(selectedPack.price)}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryDivider]}>
                    <Text style={styles.summaryLabel}>
                      GST ({selectedPack.gst_percentage}%)
                    </Text>
                    <Text style={styles.summaryValue}>₹{formatPrice(selectedPack.gst_amount)}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalValue}>
                      ₹{formatPrice(selectedPack.total_price)}
                    </Text>
                  </View>
                  <View style={styles.creditsYouGet}>
                    <AppIcon.ArrowRight
                      width={18}
                      height={18}
                      color={DARK_THEME.accent.success}
                    />
                    <Text style={styles.creditsYouGetText}>You'll receive</Text>
                    <Text style={styles.creditsYouGetValue}>+{selectedPack.credits} Credits</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Purchase Button */}
            <View style={styles.purchaseSection}>
              <TouchableOpacity
                style={[styles.purchaseButton, purchasing && styles.purchaseButtonDisabled]}
                onPress={handlePurchase}
                activeOpacity={0.85}
                disabled={purchasing}
              >
                {purchasing ? (
                  <ActivityIndicator color="#000000" size="small" />
                ) : (
                  <>
                    <AppIcon.Wallet width={22} height={22} color="#000000" />
                    <Text style={styles.purchaseButtonText}>
                      Pay ₹{formatPrice(selectedPack.total_price)}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <View style={styles.secureNote}>
                <AppIcon.Security width={14} height={14} color={DARK_THEME.text.muted} />
                <Text style={styles.secureNoteText}>Secure payment powered by Razorpay</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default CreditPacksScreen;
