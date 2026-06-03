/**
 * PaymentConfirmationScreen
 * Shows listing details, wallet balance, cost breakdown for posting requirement
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import {
  useGetWalletBalance,
  useCreateRazorpayExactCreditsOrder,
  useVerifyRazorpayPayment,
  useDeductCredits,
  usePostDealerRequirement,
  usePostBrandRequirement,
  usePostConverterRequirement,
  usePostConverterMachine,
  usePostMachine,
  usePostConverterJobworkFind,
  usePostConverterJobworkGive,
} from '@services/api';
import type { VerifyRazorpayPaymentRequest } from '@services/api';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import {
  formatPurchaseError,
  isRazorpaySdkError,
  isRazorpayUserCancellation,
  openRazorpayForWalletOrder,
} from '@features/wallet/screens/CreditPacksScreen/razorpayCheckout';
import { SCREENS } from '@navigation/constants';
import { queryKeys } from '@services/api';
import { useQueryClient } from '@tanstack/react-query';
import { createStyles } from './styles';
import {
  PaymentConfirmationScreenRouteProp,
  POSTING_COSTS,
  DIRECT_PAY_INR_PER_CREDIT,
  ListingDetails,
} from './@types';

const CARD_HEIGHT = 200;

function getDeadlineDate(urgency?: string): string {
  const today = new Date();
  if (urgency?.toLowerCase().includes('urgent')) {
    today.setDate(today.getDate() + 2);
  } else {
    today.setDate(today.getDate() + 5);
  }
  return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Requirement type definitions
type RequirementType =
  | 'dealer'
  | 'brand'
  | 'converter'
  | 'machineDealer'
  | 'converter-jobwork-find'
  | 'converter-jobwork-give';

const PaymentConfirmationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<PaymentConfirmationScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const { listingDetails, formData, requirementType = 'dealer' } = route.params || {};
  const typedRequirementType = requirementType as RequirementType;

  const [isProcessing, setIsProcessing] = useState(false);
  const pendingVerifyRef = useRef<VerifyRazorpayPaymentRequest | null>(null);

  const {
    data: wallet,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useGetWalletBalance();

  const { mutateAsync: createExactCreditsOrder } = useCreateRazorpayExactCreditsOrder();
  const { mutateAsync: verifyRazorpayPayment } = useVerifyRazorpayPayment();

  const { mutate: deductCredits } = useDeductCredits();
  const { mutate: postDealerRequirement } = usePostDealerRequirement();
  const { mutate: postBrandRequirement } = usePostBrandRequirement();
  const { mutate: postConverterRequirement } = usePostConverterRequirement();
  const { mutate: postMachine } = usePostMachine();
  const { mutate: postConverterMachine } = usePostConverterMachine();
  const { mutate: postConverterJobworkFind } = usePostConverterJobworkFind();
  const { mutate: postConverterJobworkGive } = usePostConverterJobworkGive();

  // Get the appropriate mutation: for machine post, converter uses converter API, machine dealer uses machine-dealer API
  const postRequirement = useMemo(() => {
    if (typedRequirementType === 'machineDealer' && user?.primary_role === 'converter') {
      return postConverterMachine;
    }
    if (typedRequirementType === 'converter-jobwork-find') {
      return postConverterJobworkFind;
    }
    if (typedRequirementType === 'converter-jobwork-give') {
      return postConverterJobworkGive;
    }
    const mutationMap = {
      dealer: postDealerRequirement,
      brand: postBrandRequirement,
      converter: postConverterRequirement,
      machineDealer: postMachine,
    } as const;
    return mutationMap[typedRequirementType] ?? postDealerRequirement;
  }, [typedRequirementType, user?.primary_role, postDealerRequirement, postBrandRequirement, postConverterRequirement, postMachine, postConverterMachine]);

  // Helper function to invalidate queries based on requirement type
  const invalidateQueriesByRequirementType = useCallback(
    (type: RequirementType) => {
      const invalidateConverter = () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.converter.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.converter.dashboard() });
      };

      const invalidationMap: Record<RequirementType, () => void> = {
        dealer: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.dealer.dashboard() });
        },
        brand: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.brand.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.brand.dashboard() });
        },
        converter: invalidateConverter,
        'converter-jobwork-find': invalidateConverter,
        'converter-jobwork-give': invalidateConverter,
        machineDealer: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.machineDealer.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.machineDealer.dashboard() });
          queryClient.invalidateQueries({ queryKey: queryKeys.machineDealer.listings() });
        },
      };

      const invalidate = invalidationMap[type] || invalidationMap.dealer;
      invalidate();

      // Always invalidate wallet balance
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
    },
    [queryClient]
  );

  const navigateToMatchmakingSuccess = useCallback(
    (reqDetails: any, credits: number) => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: SCREENS.MAIN.TABS },
            {
              name: SCREENS.MAIN.MATCHMAKING_SUCCESS,
              params: {
                requirementDetails: reqDetails,
                creditsDeducted: credits,
              },
            },
          ],
        })
      );
    },
    [navigation]
  );

  // Calculate costs
  const costBreakdown = useMemo(() => {
    const standardFee = POSTING_COSTS.STANDARD_FEE;
    const urgencyBoost = listingDetails?.urgency?.toLowerCase().includes('urgent')
      ? POSTING_COSTS.URGENCY_BOOST
      : 0;
    const subtotal = standardFee + urgencyBoost;
    const vat = Math.round((subtotal * POSTING_COSTS.VAT_PERCENTAGE) / 100);
    const total = subtotal + vat;

    return {
      standardFee,
      urgencyBoost,
      vat,
      total,
    };
  }, [listingDetails?.urgency]);

  const hasEnoughCredits = (wallet?.balance ?? 0) >= costBreakdown.total;

  // Converter material posting endpoint accepts only location_source = "manual".
  // Keep dropdown UX, but normalize payload just before API submit.
  const effectiveFormData = useMemo(() => {
    if (!formData || typeof formData !== 'object') return formData;
    if (typedRequirementType !== 'converter') return formData;

    return {
      ...formData,
      location_source: 'manual',
      location_id: null,
    };
  }, [formData, typedRequirementType]);

  const formatBalance = (balance: number): string => {
    if (balance >= 10000) {
      return (balance / 1000).toFixed(1) + 'K';
    }
    return balance.toLocaleString('en-IN');
  };

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBuyCredits = useCallback(() => {
    navigation.navigate(SCREENS.WALLET.CREDIT_PACKS);
  }, [navigation]);

  const runPostRequirementFlow = useCallback(() => {
    (postRequirement as (data: any, opts?: { onSuccess?: (r: any) => void; onError?: (e: any) => void }) => void)(
      effectiveFormData,
      {
        onSuccess: (response: any) => {
          const inquiryId =
            response?.inquiry_id ??
            response?.id ??
            response?.data?.inquiry_id ??
            response?.data?.id ??
            `INQ-${Date.now()}`;
          const referenceId = typeof inquiryId === 'string' ? inquiryId : String(inquiryId);

          if (typedRequirementType === 'machineDealer' && user?.primary_role === 'converter') {
            queryClient.invalidateQueries({ queryKey: queryKeys.converter.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.converter.dashboard() });
          } else {
            invalidateQueriesByRequirementType(typedRequirementType);
          }

          deductCredits(
            {
              credits: costBreakdown.total,
              description: 'Requirement Posted',
              transaction_type: 'REQUIREMENT_POSTED',
              reference_id: referenceId,
              reference_type: 'inquiry',
              metadata: {
                material: listingDetails?.materialName,
                quantity: listingDetails?.quantity,
              },
            },
            {
              onSuccess: () => {
                setIsProcessing(false);
                navigateToMatchmakingSuccess(
                  {
                    id: referenceId,
                    materialName: listingDetails?.materialName || 'Requirement',
                    quantity: `${listingDetails?.quantity} ${listingDetails?.quantityUnit || 'pieces'}`,
                    deadline: getDeadlineDate(listingDetails?.urgency),
                  },
                  costBreakdown.total
                );
              },
              onError: () => {
                setIsProcessing(false);
                navigation.navigate(SCREENS.MAIN.MATCHMAKING_SUCCESS, {
                  requirementDetails: {
                    id: referenceId,
                    materialName: listingDetails?.materialName || 'Requirement',
                    quantity: `${listingDetails?.quantity} ${listingDetails?.quantityUnit || 'pieces'}`,
                    deadline: getDeadlineDate(listingDetails?.urgency),
                  },
                  creditsDeducted: costBreakdown.total,
                });
              },
            }
          );
        },
        onError: (error: any) => {
          setIsProcessing(false);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to post requirement. Please try again.';
          Alert.alert('Error', errorMessage);
        },
      }
    );
  }, [
    postRequirement,
    effectiveFormData,
    typedRequirementType,
    user?.primary_role,
    queryClient,
    invalidateQueriesByRequirementType,
    deductCredits,
    costBreakdown.total,
    listingDetails,
    navigateToMatchmakingSuccess,
    navigation,
  ]);

  const showVerifyRetry = useCallback(
    (message: string) => {
      const body = pendingVerifyRef.current;
      if (!body) {
        Alert.alert('Payment', message);
        setIsProcessing(false);
        return;
      }
      Alert.alert('Confirm payment', message, [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setIsProcessing(false);
          },
        },
        {
          text: 'Retry',
          onPress: () => {
            void (async () => {
              try {
                const res = await verifyRazorpayPayment(body);
                pendingVerifyRef.current = null;
                dispatch(
                  showToast({
                    message: `Successfully purchased ${res.credits_added} credits!`,
                    type: 'success',
                  })
                );
                const { data } = await refetchWallet();
                if ((data?.balance ?? 0) < costBreakdown.total) {
                  setIsProcessing(false);
                  Alert.alert(
                    'Could not post yet',
                    'Your balance is still below the posting cost. Try Buy Credits or Pay & Post.'
                  );
                  return;
                }
                runPostRequirementFlow();
              } catch (e) {
                setIsProcessing(false);
                Alert.alert('Still could not confirm', formatPurchaseError(e));
              }
            })();
          },
        },
      ]);
    },
    [
      verifyRazorpayPayment,
      dispatch,
      refetchWallet,
      costBreakdown.total,
      runPostRequirementFlow,
    ]
  );

  const runDirectRazorpayAndPost = useCallback(async () => {
      pendingVerifyRef.current = null;
      setIsProcessing(true);
      try {
        const order = await createExactCreditsOrder({ credits: costBreakdown.total });
        const prefillName = user?.company_name?.trim() || undefined;
        const checkoutResult = await openRazorpayForWalletOrder(order, {
          contact: user?.mobile,
          name: prefillName,
        });
        pendingVerifyRef.current = checkoutResult;
        await verifyRazorpayPayment(checkoutResult);
        pendingVerifyRef.current = null;
      } catch (err) {
        if (isRazorpayUserCancellation(err)) {
          setIsProcessing(false);
          return;
        }
        if (isRazorpaySdkError(err)) {
          setIsProcessing(false);
          Alert.alert('Payment', formatPurchaseError(err));
          return;
        }
        const msg = formatPurchaseError(err);
        if (pendingVerifyRef.current) {
          showVerifyRetry(
            `${msg}\n\nIf you completed payment in Razorpay, tap Retry to confirm with the server.`
          );
        } else {
          setIsProcessing(false);
          Alert.alert('Payment Failed', msg);
        }
        return;
      }

      try {
        const { data } = await refetchWallet();
        if ((data?.balance ?? 0) < costBreakdown.total) {
          setIsProcessing(false);
          Alert.alert(
            'Could not post yet',
            'Payment may still be processing. Try Pay & Post or Buy Credits.'
          );
          return;
        }
        runPostRequirementFlow();
      } catch {
        setIsProcessing(false);
        Alert.alert('Error', 'Could not refresh wallet. Try Pay & Post.');
      }
    },
    [
      createExactCreditsOrder,
      verifyRazorpayPayment,
      user,
      showVerifyRetry,
      refetchWallet,
      costBreakdown.total,
      runPostRequirementFlow,
    ]
  );

  const handleDirectPay = useCallback(() => {
    if (isProcessing || walletLoading) {
      return;
    }

    const credits = costBreakdown.total;
    const estimatedInr = credits * DIRECT_PAY_INR_PER_CREDIT;
    Alert.alert(
      'Pay & post',
      `Pay about ₹${estimatedInr.toLocaleString('en-IN')} for ${credits} credits (estimate at ${DIRECT_PAY_INR_PER_CREDIT} INR per credit). Razorpay shows the final amount from the server. After payment we post your requirement and deduct ${credits} credits from your wallet.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay now',
          onPress: () => {
            void runDirectRazorpayAndPost();
          },
        },
      ]
    );
  }, [isProcessing, walletLoading, costBreakdown.total, runDirectRazorpayAndPost]);

  const handlePayAndPost = useCallback(() => {
    if (!hasEnoughCredits) {
      Alert.alert(
        'Insufficient Credits',
        `You need ${costBreakdown.total} credits to post this requirement. Please buy more credits.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy Credits', onPress: handleBuyCredits },
        ]
      );
      return;
    }

    setIsProcessing(true);
    runPostRequirementFlow();
  }, [hasEnoughCredits, costBreakdown.total, handleBuyCredits, runPostRequirementFlow]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Memoize the default listing details to avoid recalculation
  const displayDetails: ListingDetails = useMemo(() => {
    if (listingDetails) return listingDetails;
    return {
      title: 'Material Requirement',
      referenceNumber: '#0000',
      grade: 'Standard',
      materialName: 'Material',
      quantity: '0',
      quantityUnit: 'kg',
      urgency: 'Normal',
      tags: ['Material'],
    };
  }, [listingDetails]);

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing[2] }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <AppIcon.ArrowLeft width={20} height={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Confirmation</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Listing Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Listing Details</Text>
          <View style={styles.listingCard}>
            {displayDetails.imageUrl ? (
              <Image source={{ uri: displayDetails.imageUrl }} style={styles.listingImage} />
            ) : (
              <View style={styles.listingImagePlaceholder}>
                <AppIcon.Market width={32} height={32} color={theme.colors.text.tertiary} />
              </View>
            )}
            <View style={styles.listingContent}>
              <Text style={styles.listingTitle}>{displayDetails.title}</Text>
              <Text style={styles.listingSubtitle}>
                Ref: {displayDetails.referenceNumber} • {displayDetails.grade}
              </Text>
              <View style={styles.tagsContainer}>
                {displayDetails.tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      tag.toLowerCase() === 'urgent' && styles.tagUrgent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        tag.toLowerCase() === 'urgent' && styles.tagTextUrgent,
                      ]}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method Section - Wallet Card */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Payment Method</Text>
        </View>

        <View style={styles.walletCardWrapper}>
          <View style={styles.walletCard}>
            {/* Gradient Background using Skia */}
            <Canvas style={{ position: 'absolute', width: '100%', height: CARD_HEIGHT }}>
              <RoundedRect x={0} y={0} width={550} height={CARD_HEIGHT} r={20}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(400, CARD_HEIGHT)}
                  colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
                />
              </RoundedRect>
            </Canvas>

            <View style={styles.walletCardGradient}>
              <View style={styles.walletHeader}>
                <View style={styles.walletIconWrapper}>
                  <AppIcon.Wallet width={16} height={16} color="#FFFFFF" />
                </View>
                <Text style={styles.walletLabel}>Wallet Balance</Text>
              </View>

              <View style={styles.balanceRow}>
                <View style={styles.balanceContainer}>
                  {walletLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Text style={styles.balanceValue}>
                        {formatBalance(wallet?.balance ?? 0)}
                      </Text>
                      <Text style={styles.balanceUnit}>Credits</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity style={styles.buyCreditsButton} onPress={handleBuyCredits}>
                  <Text style={styles.buyCreditsText}>Buy Credits</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.walletInfoRow}>
                <View style={styles.walletInfoIcon}>
                  <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: fontWeightForPlatform('700') }}>i</Text>
                </View>
                <Text style={styles.walletInfoText}>
                  Posting will deduct credits immediately
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.directPayCard}>
            <Text style={styles.directPayTitle}>Pay directly for this chat</Text>
            <Text style={styles.directPayDescription}>
              Skip buying credits and pay this requirement instantly using card or UPI.
            </Text>
            <TouchableOpacity
              style={[
                styles.directPayButton,
                (isProcessing || walletLoading) && styles.payButtonDisabled,
              ]}
              onPress={handleDirectPay}
              disabled={isProcessing || walletLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.directPayButtonText}>Pay Directly</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cost Breakdown Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Cost Breakdown</Text>
          <View style={styles.costCard}>
            <View style={[styles.costRow, styles.costRowBorder]}>
              <Text style={styles.costLabel}>Standard Posting Fee</Text>
              <Text style={styles.costValue}>{costBreakdown.standardFee} Credits</Text>
            </View>

            {costBreakdown.urgencyBoost > 0 && (
              <View style={[styles.costRow, styles.costRowBorder]}>
                <Text style={styles.costLabel}>Urgency Boost (7-Day)</Text>
                <Text style={styles.costValue}>{costBreakdown.urgencyBoost} Credits</Text>
              </View>
            )}

            <View style={[styles.costRow, styles.costRowBorder]}>
              <Text style={styles.costLabel}>VAT ({POSTING_COSTS.VAT_PERCENTAGE}%)</Text>
              <Text style={styles.costValue}>{costBreakdown.vat} Credits</Text>
            </View>

            <View style={[styles.costRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Deduction</Text>
              <Text style={styles.totalValue}>{costBreakdown.total} Credits</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[
            styles.payButton,
            !hasEnoughCredits && styles.payButtonDisabled,
          ]}
          onPress={handlePayAndPost}
          disabled={isProcessing || walletLoading}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay & Post</Text>
              <View style={styles.payButtonBadge}>
                <Text style={styles.payButtonBadgeText}>{costBreakdown.total} CREDITS</Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator color={theme.colors.primary.DEFAULT} size="large" />
            <Text style={styles.loadingText}>Processing your payment...</Text>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
};

export default PaymentConfirmationScreen;
