/**
 * PaymentConfirmationScreen
 * Shows listing details, wallet balance, cost breakdown for posting requirement
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useGetWalletBalance, useDeductCredits, usePostDealerRequirement, usePostBrandRequirement, usePostConverterRequirement } from '@services/api';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { SCREENS } from '@navigation/constants';
import { queryKeys } from '@services/api';
import { useQueryClient } from '@tanstack/react-query';
import { createStyles } from './styles';
import {
  PaymentConfirmationScreenRouteProp,
  POSTING_COSTS,
  ListingDetails,
} from './@types';

const CARD_HEIGHT = 200;

// Requirement type definitions
type RequirementType = 'dealer' | 'brand' | 'converter';

const PaymentConfirmationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<PaymentConfirmationScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { listingDetails, formData, requirementType = 'dealer' } = route.params || {};
  const typedRequirementType = requirementType as RequirementType;

  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: wallet,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useGetWalletBalance();

  const { mutate: deductCredits } = useDeductCredits();
  const { mutate: postDealerRequirement } = usePostDealerRequirement();
  const { mutate: postBrandRequirement } = usePostBrandRequirement();
  const { mutate: postConverterRequirement } = usePostConverterRequirement();
  
  // Get the appropriate mutation based on requirement type using a mapping object
  const postRequirement = useMemo(() => {
    const mutationMap: Record<RequirementType, typeof postDealerRequirement> = {
      dealer: postDealerRequirement,
      brand: postBrandRequirement,
      converter: postConverterRequirement,
    };

    return mutationMap[typedRequirementType] || postDealerRequirement; // Default to dealer
  }, [typedRequirementType, postDealerRequirement, postBrandRequirement, postConverterRequirement]);

  // Helper function to invalidate queries based on requirement type
  const invalidateQueriesByRequirementType = useCallback(
    (type: RequirementType) => {
      const invalidationMap: Record<RequirementType, () => void> = {
        dealer: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.dealer.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.dealer.dashboard() });
        },
        brand: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.brand.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.brand.dashboard() });
        },
        converter: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.converter.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.converter.dashboard() });
        },
      };

      const invalidate = invalidationMap[type] || invalidationMap.dealer;
      invalidate();
      
      // Always invalidate wallet balance
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
    },
    [queryClient]
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

  const handlePayAndPost = useCallback(() => {

    // navigation.navigate(SCREENS.MAIN.MATCHMAKING_SUCCESS, {
    //   requirementDetails: {
    //     id:`#${Math.floor(Math.random() * 9000) + 1000}`,
    //     materialName: listingDetails?.materialName || 'Material',
    //     quantity: `${listingDetails?.quantity}${listingDetails?.quantityUnit || 'kg'}`,
    //     deadline: getDeadlineDate(listingDetails?.urgency),
    //   },
    //   creditsDeducted: costBreakdown.total,
    // });

    // return; // TODO: Remove this after testing

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

    // First post the requirement
    postRequirement(formData, {
      onSuccess: (response: any) => {

        console.log('response', JSON.stringify(response, null, 2));
        
        // Handle both dealer (inquiry_id) and brand (id) response formats
        const inquiryId = response.data?.inquiry_id || response.data?.id || `INQ-${Date.now()}`;
        
        // Invalidate queries based on requirement type
        invalidateQueriesByRequirementType(typedRequirementType);
        
        // Then deduct credits
        deductCredits(
          {
            credits: costBreakdown.total,
            description: 'Requirement Posted',
            transaction_type: 'REQUIREMENT_POSTED',
            reference_id: inquiryId,
            reference_type: 'inquiry',
            metadata: {
              material: listingDetails?.materialName,
              quantity: listingDetails?.quantity,
            },
          },
          {
            onSuccess: () => {
              setIsProcessing(false);
              // Navigate to success screen
              navigation.navigate(SCREENS.MAIN.MATCHMAKING_SUCCESS, {
                requirementDetails: {
                  id: inquiryId,
                  materialName: listingDetails?.materialName || 'Requirement',
                  quantity: `${listingDetails?.quantity} ${listingDetails?.quantityUnit || 'pieces'}`,
                  deadline: getDeadlineDate(listingDetails?.urgency),
                },
                creditsDeducted: costBreakdown.total,
              });
            },
            onError: (error: any) => {
              setIsProcessing(false);
              console.log('error', JSON.stringify(error, null, 2));
              // Still navigate to success since requirement was posted
              navigation.navigate(SCREENS.MAIN.MATCHMAKING_SUCCESS, {
                requirementDetails: {
                  id: inquiryId,
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
        console.log('error', JSON.stringify(error.response, null, 2));
        setIsProcessing(false);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to post requirement. Please try again.';
        Alert.alert('Error', errorMessage);
      },
    });
  }, [
    hasEnoughCredits,
    costBreakdown.total,
    formData,
    listingDetails,
    navigation,
    postRequirement,
    deductCredits,
    handleBuyCredits,
    invalidateQueriesByRequirementType,
    typedRequirementType,
  ]);

  const getDeadlineDate = (urgency?: string) => {
    const today = new Date();
    if (urgency?.toLowerCase().includes('urgent')) {
      today.setDate(today.getDate() + 2);
    } else {
      today.setDate(today.getDate() + 5);
    }
    return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
                  <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>i</Text>
                </View>
                <Text style={styles.walletInfoText}>
                  Posting will deduct credits immediately
                </Text>
              </View>
            </View>
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
              <Text style={styles.totalValue}>{20} Credits</Text>
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
