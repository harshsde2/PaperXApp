import React, { useCallback, useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import {
  useGetRtdListingPacks,
  usePurchaseRtdListingPack,
  useCreateRazorpayExactCreditsOrder,
  useVerifyRazorpayPayment,
} from '@services/api';
import type { RtdListingPackItem } from '@services/api';
import { useAppSelector } from '@store/hooks';
import {
  openRazorpayForWalletOrder,
  isRazorpayUserCancellation,
  isRazorpaySdkError,
  formatPurchaseError,
} from '@features/wallet/screens/CreditPacksScreen/razorpayCheckout';
import type { RtdListingPackModalProps } from './@types';
import { createStyles } from './styles';

export const RtdListingPackModal: React.FC<RtdListingPackModalProps> = ({
  visible,
  onClose,
  onPurchaseSuccess,
  walletBalance,
  walletBalanceLoading = false,
  onInsufficientBalanceForPack,
  onBuyWalletCredits,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const user = useAppSelector((state) => state.auth.user);
  const [purchasingPackSlug, setPurchasingPackSlug] = useState<string | null>(null);
  const [directPayingPackSlug, setDirectPayingPackSlug] = useState<string | null>(null);
  const { data: packs = [], isLoading } = useGetRtdListingPacks();
  const purchaseMutation = usePurchaseRtdListingPack();
  const { mutateAsync: createExactCreditsOrder } = useCreateRazorpayExactCreditsOrder();
  const { mutateAsync: verifyRazorpayPayment } = useVerifyRazorpayPayment();

  const handleBuy = useCallback(
    async (pack: RtdListingPackItem) => {
      if (walletBalanceLoading) {
        return;
      }
      if (walletBalance < pack.price) {
        onInsufficientBalanceForPack?.(pack);
        return;
      }

      setPurchasingPackSlug(pack.slug);
      try {
        await purchaseMutation.mutateAsync({ pack_slug: pack.slug });
        setPurchasingPackSlug(null);
        onClose();
        onPurchaseSuccess();
      } catch (err: any) {
        setPurchasingPackSlug(null);
        const message =
          err?.response?.data?.message ??
          err?.message ??
          'Purchase failed. Please try again.';
        const isInsufficientBalance =
          typeof message === 'string' &&
          (message.toLowerCase().includes('insufficient') ||
            message.toLowerCase().includes('balance'));
        if (isInsufficientBalance && onBuyWalletCredits) {
          Alert.alert('Purchase failed', message, [
            { text: 'OK' },
            {
              text: 'Add credits',
              onPress: () => {
                onClose();
                onBuyWalletCredits();
              },
            },
          ]);
        } else {
          Alert.alert('Purchase failed', message);
        }
      }
    },
    [
      walletBalance,
      walletBalanceLoading,
      onInsufficientBalanceForPack,
      purchaseMutation,
      onClose,
      onPurchaseSuccess,
      onBuyWalletCredits,
    ]
  );

  const handleDirectPay = useCallback(
    async (pack: RtdListingPackItem) => {
      const estimatedInr = pack.price * 10;
      Alert.alert(
        'Pay directly',
        `Pay about ₹${estimatedInr.toLocaleString('en-IN')} for ${pack.price} credits (estimate). Razorpay shows the final amount. Credits will be added and this pack will be purchased automatically.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Pay now',
            onPress: async () => {
              setDirectPayingPackSlug(pack.slug);
              try {
                const order = await createExactCreditsOrder({ credits: pack.price });

                const checkoutResult = await openRazorpayForWalletOrder(order, {
                  contact: user?.mobile,
                  name: user?.company_name?.trim() || undefined,
                });

                await verifyRazorpayPayment(checkoutResult);

                await purchaseMutation.mutateAsync({ pack_slug: pack.slug });

                setDirectPayingPackSlug(null);
                onClose();
                onPurchaseSuccess();
              } catch (err: any) {
                setDirectPayingPackSlug(null);
                if (isRazorpayUserCancellation(err)) return;
                if (isRazorpaySdkError(err)) {
                  Alert.alert('Payment failed', formatPurchaseError(err));
                  return;
                }
                Alert.alert('Error', formatPurchaseError(err));
              }
            },
          },
        ]
      );
    },
    [
      user,
      createExactCreditsOrder,
      verifyRazorpayPayment,
      purchaseMutation,
      onClose,
      onPurchaseSuccess,
    ]
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Choose a listing pack</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AppIcon.Close width={24} height={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.balanceBanner}>
            <Text style={styles.balanceLabel}>Available credits</Text>
            {walletBalanceLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
            ) : (
              <Text style={styles.balanceValue}>
                {walletBalance.toLocaleString('en-IN')} Credits
              </Text>
            )}
          </View>
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <Text style={styles.subtitle}>Loading packs...</Text>
            ) : (
              packs.map((pack) => {
                const isPopular = pack.slug === 'pack_5';
                return (
                  <View
                    key={pack.slug}
                    style={[styles.packCard, isPopular && styles.packCardPopular]}
                  >
                    {isPopular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>Popular</Text>
                      </View>
                    )}
                    <Text style={styles.packName}>{pack.name}</Text>
                    <Text style={styles.packMeta}>
                      Upto {pack.product_limit} product{pack.product_limit !== 1 ? 's' : ''} ·{' '}
                      {pack.validity_days} days validity
                    </Text>
                    <View style={styles.packPriceRow}>
                      <Text style={styles.packPrice}>{pack.price} Credits</Text>
                      <CustomButton
                        title="Buy"
                        onPress={() => handleBuy(pack)}
                        variant="gradient"
                        size="sm"
                        loading={purchasingPackSlug === pack.slug}
                        disabled={
                          purchaseMutation.isPending ||
                          walletBalanceLoading ||
                          !!directPayingPackSlug
                        }
                        style={styles.buyButton}
                      />
                    </View>
                    <CustomButton
                      title={`Pay Directly — ₹~${(pack.price * 10).toLocaleString('en-IN')}`}
                      onPress={() => handleDirectPay(pack)}
                      variant="outline"
                      size="sm"
                      loading={directPayingPackSlug === pack.slug}
                      disabled={
                        purchaseMutation.isPending ||
                        !!purchasingPackSlug ||
                        !!directPayingPackSlug
                      }
                      style={styles.directPayButton}
                    />
                  </View>
                );
              })
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
