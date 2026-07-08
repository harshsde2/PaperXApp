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
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { InsufficientCreditsModal } from '@shared/components/InsufficientCreditsModal';
import { AppIcon } from '@assets/svgs';
import {
  useGetRtdListingPacks,
  usePurchaseRtdListingPack,
  useCreateRazorpayExactCreditsOrder,
  useVerifyRazorpayPayment,
} from '@services/api';
import type { RtdListingPackItem } from '@services/api';
import { queryKeys } from '@services/api/queryClient';
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
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const [busyPackSlug, setBusyPackSlug] = useState<string | null>(null);
  const [shortfallPack, setShortfallPack] = useState<RtdListingPackItem | null>(null);
  const { data: packs = [], isLoading } = useGetRtdListingPacks();
  const purchaseMutation = usePurchaseRtdListingPack();
  const { mutateAsync: createExactCreditsOrder } = useCreateRazorpayExactCreditsOrder();
  const { mutateAsync: verifyRazorpayPayment } = useVerifyRazorpayPayment();

  const refreshWalletBalance = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
  }, [queryClient]);

  /**
   * Razorpay top-up for the shortfall, then pack purchase, in one chain.
   * Existing credits are used first; only the difference is charged.
   */
  const payShortfallAndPurchase = useCallback(
    async (pack: RtdListingPackItem, shortfall: number) => {
      setBusyPackSlug(pack.slug);
      let checkoutOpened = false;
      let paymentVerified = false;
      try {
        const order = await createExactCreditsOrder({ credits: shortfall });

        checkoutOpened = true;
        const checkoutResult = await openRazorpayForWalletOrder(order, {
          contact: user?.mobile,
          name: user?.company_name?.trim() || undefined,
        });

        await verifyRazorpayPayment(checkoutResult);
        paymentVerified = true;

        await purchaseMutation.mutateAsync({ pack_slug: pack.slug });

        setBusyPackSlug(null);
        onClose();
        onPurchaseSuccess();
      } catch (err: any) {
        setBusyPackSlug(null);
        refreshWalletBalance();
        if (isRazorpayUserCancellation(err)) return;
        if (isRazorpaySdkError(err)) {
          Alert.alert('Payment failed', formatPurchaseError(err));
          return;
        }
        if (paymentVerified) {
          // Credits landed in the wallet but the pack purchase failed —
          // nothing is lost; a retry now takes the credits path.
          Alert.alert(
            'Almost there',
            'Your payment was received and credits were added to your wallet, but the pack purchase could not be completed. Please tap Buy again — no extra payment is needed.'
          );
          return;
        }
        const message = formatPurchaseError(err);
        if (!checkoutOpened) {
          // Failed before Razorpay opened (e.g. order creation rejected) —
          // nothing was charged, plain error is enough.
          Alert.alert('Payment failed', message);
          return;
        }
        // Verify call failed after checkout: the webhook still adds credits
        // server-side, so guide the user to retry shortly.
        Alert.alert(
          'Payment processing',
          `${message}\n\nIf money was deducted, your credits will be added automatically within a moment. Please tap Buy again shortly — you will not be charged twice.`
        );
      }
    },
    [
      user,
      createExactCreditsOrder,
      verifyRazorpayPayment,
      purchaseMutation,
      onClose,
      onPurchaseSuccess,
      refreshWalletBalance,
    ]
  );

  const handleShortfallPayNow = useCallback(() => {
    if (!shortfallPack) return;
    const pack = shortfallPack;
    const shortfall = Math.max(1, Math.ceil(pack.price - walletBalance));
    setShortfallPack(null);
    payShortfallAndPurchase(pack, shortfall);
  }, [shortfallPack, walletBalance, payShortfallAndPurchase]);

  const handleBuy = useCallback(
    async (pack: RtdListingPackItem) => {
      if (walletBalanceLoading || busyPackSlug) {
        return;
      }

      // Not enough credits — show the insufficient-credits popup first.
      if (walletBalance < pack.price) {
        setShortfallPack(pack);
        return;
      }

      // Enough credits — purchase with wallet balance.
      setBusyPackSlug(pack.slug);
      try {
        await purchaseMutation.mutateAsync({ pack_slug: pack.slug });
        setBusyPackSlug(null);
        onClose();
        onPurchaseSuccess();
      } catch (err: any) {
        setBusyPackSlug(null);
        const message =
          err?.response?.data?.message ??
          err?.message ??
          'Purchase failed. Please try again.';
        const isInsufficientBalance =
          typeof message === 'string' &&
          (message.toLowerCase().includes('insufficient') ||
            message.toLowerCase().includes('balance'));
        if (isInsufficientBalance) {
          // Local balance was stale — refresh and fall back to direct payment.
          refreshWalletBalance();
          setShortfallPack(pack);
        } else {
          Alert.alert('Purchase failed', message);
        }
      }
    },
    [
      walletBalance,
      walletBalanceLoading,
      busyPackSlug,
      purchaseMutation,
      onClose,
      onPurchaseSuccess,
      refreshWalletBalance,
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
                      <Text style={styles.packPrice}>₹{pack.price.toLocaleString('en-IN')}</Text>
                      <CustomButton
                        title="Buy"
                        onPress={() => handleBuy(pack)}
                        variant="gradient"
                        size="sm"
                        loading={busyPackSlug === pack.slug}
                        disabled={
                          purchaseMutation.isPending ||
                          walletBalanceLoading ||
                          !!busyPackSlug
                        }
                        style={styles.buyButton}
                      />
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </Pressable>
      </Pressable>

      <InsufficientCreditsModal
        visible={!!shortfallPack}
        currentBalance={Math.floor(walletBalance)}
        requiredCredits={shortfallPack?.price ?? 0}
        title="Not enough credits"
        message={
          shortfallPack
            ? `This pack costs ₹${shortfallPack.price.toLocaleString('en-IN')}. Pay the remaining ₹${Math.max(
                1,
                Math.ceil(shortfallPack.price - walletBalance)
              ).toLocaleString('en-IN')} now and the pack will be activated automatically.`
            : undefined
        }
        buyButtonLabel={
          shortfallPack
            ? `Buy Now — ₹${Math.max(
                1,
                Math.ceil(shortfallPack.price - walletBalance)
              ).toLocaleString('en-IN')}`
            : 'Buy Now'
        }
        onClose={() => setShortfallPack(null)}
        onBuyCredits={handleShortfallPayNow}
      />
    </Modal>
  );
};
