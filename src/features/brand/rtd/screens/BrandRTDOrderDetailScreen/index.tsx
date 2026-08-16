import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import {
  useGetBrandRtdOrderDetail,
  useCreateBrandRtdRazorpayOrder,
  useVerifyBrandRtdRazorpayPayment,
  useCancelRtdOrder,
  useConfirmRtdPayment,
} from '@services/api/brandRtdApi';
import { PAYMENTS_ENABLED } from '@shared/constants/config';
import type { RtdOrderStatus } from '@services/api';
import type { VerifyRazorpayPaymentRequest } from '@services/api/walletApi/@types';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import {
  openRazorpayForBrandRtdOrder,
  formatPurchaseError,
  isRazorpaySdkError,
  isRazorpayUserCancellation,
} from '@features/wallet/screens/CreditPacksScreen/razorpayCheckout';
import { BrandOrderTimeline } from '../../components/BrandOrderTimeline';
import { BrandOrderSummaryCard } from '../../components/BrandOrderSummaryCard';
import { OrderCountdownTimer } from '../../components/OrderCountdownTimer';
import { ContactDetailsCard } from '@shared/components/ContactDetailsCard';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { DetailSkeleton } from '@shared/components/skeletons';
import type { BrandRTDOrderDetailScreenProps } from './@types';
import { createStyles } from './styles';

const STATUS_META: Record<
  string,
  { label: string; color: string; progress: number; title: string; description: string }
> = {
  REQUESTED: {
    label: 'Requested',
    color: '#3b82f6',
    progress: 0.15,
    title: 'Waiting for converter confirmation',
    description:
      'The converter has a limited window to accept this order request.',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: '#3b82f6',
    progress: 0.5,
    title: 'Converter confirmed availability',
    description:
      'The converter accepted your request. Pay the platform fee to unlock their contact details and connect directly.',
  },
  CONNECTED: {
    label: 'Connected',
    color: '#10b981',
    progress: 1,
    title: "You're Connected!",
    description:
      'Platform fee paid. Contact the converter directly to arrange payment and delivery.',
  },
  PAID: {
    label: 'Paid',
    color: '#10b981',
    progress: 0.55,
    title: 'Payment confirmed',
    description:
      'Your payment has been received. The converter has been notified to begin production.',
  },
  IN_PRODUCTION: {
    label: 'In Production',
    color: '#f59e0b',
    progress: 0.7,
    title: 'Order is being prepared',
    description:
      'The converter is working on your order. You will be notified when it ships.',
  },
  DISPATCHED: {
    label: 'Dispatched',
    color: '#3b82f6',
    progress: 0.9,
    title: 'Dispatched',
    description:
      'Your order has left the facility and is currently being handled by the courier partner.',
  },
  COMPLETED: {
    label: 'Completed',
    color: '#10b981',
    progress: 1,
    title: 'Successfully Delivered',
    description: 'Your order has been delivered.',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#94a3b8',
    progress: 0,
    title: 'Order Cancelled',
    description:
      'This order was cancelled before payment was completed.',
  },
  DISPUTED: {
    label: 'Disputed',
    color: '#ef4444',
    progress: 0,
    title: 'Dispute Raised',
    description:
      'A dispute has been filed. Our support team is reviewing this order.',
  },
};

export const BrandRTDOrderDetailScreen: React.FC<BrandRTDOrderDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { orderId } = route.params;

  const [manualRefreshing, setManualRefreshing] = React.useState(false);

  const {
    data: activeOrder,
    refetch,
  } = useGetBrandRtdOrderDetail(orderId);

  const createRtdRzpOrder = useCreateBrandRtdRazorpayOrder();
  const verifyRtdRzpPayment = useVerifyBrandRtdRazorpayPayment();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const pendingVerifyRef = useRef<VerifyRazorpayPaymentRequest | null>(null);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const cancelOrder = useCancelRtdOrder();
  const confirmRtdPayment = useConfirmRtdPayment();

  const paying = checkoutBusy || createRtdRzpOrder.isPending || verifyRtdRzpPayment.isPending;

  const meta = useMemo(
    () => STATUS_META[activeOrder?.status ?? 'REQUESTED'],
    [activeOrder?.status],
  );
  const showSkeleton = useSkeleton(!activeOrder);

  const showVerifyRetry = useCallback(
    (message: string, orderId: number) => {
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
              await verifyRtdRzpPayment.mutateAsync({ orderId, ...body });
              pendingVerifyRef.current = null;
              dispatch(showToast({ message: 'Payment successful', type: 'success' }));
              await refetch();
            } catch (e) {
              Alert.alert('Still could not confirm', formatPurchaseError(e));
            }
          },
        },
      ]);
    },
    [dispatch, refetch, verifyRtdRzpPayment]
  );

  const runRtdRazorpayCheckout = useCallback(
    async (orderId: number) => {
      pendingVerifyRef.current = null;
      try {
        const rzOrder = await createRtdRzpOrder.mutateAsync(orderId);
        setCheckoutBusy(true);
        const prefillName = user?.company_name?.trim() || undefined;
        const checkoutResult = await openRazorpayForBrandRtdOrder(rzOrder, {
          contact: user?.mobile,
          name: prefillName,
        });
        pendingVerifyRef.current = checkoutResult;
        await verifyRtdRzpPayment.mutateAsync({
          orderId,
          ...checkoutResult,
        });
        pendingVerifyRef.current = null;
        dispatch(showToast({ message: 'Payment successful', type: 'success' }));
        await refetch();
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
            `${msg}\n\nIf you completed payment in Razorpay, tap Retry to confirm with the server.`,
            orderId
          );
        } else {
          Alert.alert('Payment failed', msg);
        }
      } finally {
        setCheckoutBusy(false);
      }
    },
    [createRtdRzpOrder, dispatch, refetch, showVerifyRetry, user, verifyRtdRzpPayment]
  );

  const handlePay = useCallback(() => {
    if (!activeOrder) return;
    const orderId = activeOrder.id;
    const total = activeOrder.total_amount;

    // Free-launch mode: connect without paying the platform fee.
    if (!PAYMENTS_ENABLED) {
      Alert.alert('Connect', 'Connect with this converter for free?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            confirmRtdPayment.mutate(
              { order_id: orderId, transaction_id: 'FREE_MODE' },
              {
                onSuccess: () => {
                  dispatch(showToast({ message: 'Connected', type: 'success' }));
                  void refetch();
                },
                onError: (err: any) =>
                  Alert.alert('Error', err?.message ?? 'Could not connect. Please try again.'),
              },
            );
          },
        },
      ]);
      return;
    }

    Alert.alert(
      'Confirm payment',
      `Pay platform fee of ₹${total} via Razorpay? You will complete checkout in a secure window.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay now',
          onPress: () => {
            void runRtdRazorpayCheckout(orderId);
          },
        },
      ]
    );
  }, [activeOrder, runRtdRazorpayCheckout, confirmRtdPayment, dispatch, refetch]);

  const handleCancel = useCallback(() => {
    if (!activeOrder) return;
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'Keep Order', style: 'cancel' },
      {
        text: 'Cancel Order',
        style: 'destructive',
        onPress: () =>
          cancelOrder.mutate(activeOrder.id, {
            onSuccess: () => refetch(),
            onError: (err) =>
              Alert.alert('Error', err?.message ?? 'Failed to cancel'),
          }),
      },
    ]);
  }, [activeOrder, cancelOrder, refetch]);

  const handleBackToDashboard = useCallback(() => {
    navigation.navigate(SCREENS.MAIN.TABS as any);
  }, [navigation]);

  const handleBackToMarketplace = useCallback(() => {
    navigation.navigate(SCREENS.BRAND_RTD.MARKETPLACE as any);
  }, [navigation]);

  if (!activeOrder) {
    if (showSkeleton) {
      return (
        <View style={styles.loadingContainer}>
          <DetailSkeleton />
        </View>
      );
    }
    return (
      <View style={styles.loadingContainer} />
    );
  }

  const status = activeOrder.status;
  const isTerminal = ['CONNECTED', 'CANCELLED', 'DECLINED', 'EXPIRED', 'COMPLETED', 'DISPUTED'].includes(status);
  const showConverterContact =
    status === 'CONNECTED' ||
    status === 'PAID' ||
    status === 'IN_PRODUCTION' ||
    status === 'DISPATCHED' ||
    status === 'COMPLETED';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={manualRefreshing}
            onRefresh={() => {
              setManualRefreshing(true);
              refetch().finally(() => setManualRefreshing(false));
            }}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
      >
        {/* Timeline for active flow */}
        {!isTerminal && status !== 'CANCELLED' && (
          <View style={styles.section}>
            <BrandOrderTimeline currentStatus={status} />
          </View>
        )}

        {/* === REQUESTED === */}
        {status === 'REQUESTED' && (
          <>
            <View style={styles.statusHeader}>
              <View style={styles.statusBadgeRow}>
                <View style={[styles.statusBadge, { backgroundColor: meta.color }]}>
                  <Text style={styles.statusBadgeText}>{meta.label}</Text>
                </View>
              </View>
              <Text fontWeight="bold" style={styles.statusTitle}>
                {meta.title}
              </Text>
              <Text style={styles.statusDescription}>{meta.description}</Text>
            </View>

            {activeOrder.confirmation_deadline && (
              <View style={styles.countdownWrapper}>
                <OrderCountdownTimer
                  deadline={activeOrder.confirmation_deadline}
                  onExpired={refetch}
                />
                <Text style={styles.countdownHint}>
                  Time remaining for converter to respond
                </Text>
              </View>
            )}

            <BrandOrderSummaryCard order={activeOrder} />
          </>
        )}

        {/* === ACCEPTED (Pay Now) === */}
        {status === 'ACCEPTED' && (
          <>
            <View style={styles.statusHeader}>
              <View style={styles.statusBadgeRow}>
                <View style={[styles.statusBadge, { backgroundColor: meta.color }]}>
                  <Text style={styles.statusBadgeText}>{meta.label}</Text>
                </View>
                <Text style={styles.progressHint}>
                  Order Progress: {Math.round(meta.progress * 100)}%
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${meta.progress * 100}%` },
                  ]}
                />
              </View>
              <Text fontWeight="bold" style={styles.statusTitle}>
                {meta.title}
              </Text>
              <Text style={styles.statusDescription}>{meta.description}</Text>
            </View>

            <View style={styles.pricingCard}>
              <Text style={styles.pricingHeader}>Platform Fee Summary</Text>
              <View style={styles.pricingProductRow}>
                <View style={{ flex: 1 }}>
                  <Text fontWeight="bold" style={styles.pricingProductName}>
                    {activeOrder.product?.display_name ?? activeOrder.product?.product_name ?? activeOrder.product?.category ?? 'Product'}
                  </Text>
                  <Text style={styles.pricingRef}>Ref: #PX-{activeOrder.id}</Text>
                </View>
                <Text style={styles.pricingProductPrice}>₹{activeOrder.subtotal}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Order value (pay direct to converter)</Text>
                <Text style={styles.pricingValue}>₹{activeOrder.subtotal}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Platform fee</Text>
                <Text style={styles.pricingValue}>₹{activeOrder.commission_amount}</Text>
              </View>
              {activeOrder.seller_gst_registered !== false && Number(activeOrder.gst_amount) > 0 && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>GST on platform fee (18%)</Text>
                  <Text style={styles.pricingValue}>₹{activeOrder.gst_amount}</Text>
                </View>
              )}
              <View style={styles.pricingDivider} />
              <View style={styles.pricingTotalRow}>
                <Text fontWeight="bold" style={styles.pricingTotalLabel}>
                  You Pay to Zupply
                </Text>
                <Text fontWeight="bold" style={styles.pricingTotalValue}>
                  ₹{activeOrder.total_amount}
                </Text>
              </View>
            </View>

            <View style={styles.facilitatorNote}>
              <Text style={styles.facilitatorText}>
                Zupply collects only its platform fee. Product payment and delivery are arranged
                directly with the converter after you connect.
              </Text>
            </View>
          </>
        )}

        {(status === 'CONNECTED' ||
          status === 'PAID' ||
          status === 'IN_PRODUCTION' ||
          status === 'DISPATCHED' ||
          status === 'COMPLETED') && (
          <>
            <View style={styles.statusHeader}>
              <View style={styles.statusBadgeRow}>
                <View style={[styles.statusBadge, { backgroundColor: meta.color }]}>
                  <Text style={styles.statusBadgeText}>{meta.label}</Text>
                </View>
              </View>
              <Text fontWeight="bold" style={styles.statusTitle}>
                {meta.title}
              </Text>
              <Text style={styles.statusDescription}>{meta.description}</Text>
            </View>

            <BrandOrderSummaryCard order={activeOrder} />

            {showConverterContact && (
              <ContactDetailsCard
                title="Converter Contact"
                name={activeOrder.converter?.name}
                companyName={activeOrder.converter?.company_name}
                email={activeOrder.converter?.email}
                phone={activeOrder.converter?.mobile}
              />
            )}
          </>
        )}

        {/* === CANCELLED === */}
        {status === 'CANCELLED' && (
          <>
            <View style={styles.expiredBanner}>
              <View style={styles.expiredBadgeRow}>
                <View style={styles.expiredBadge}>
                  <Text style={styles.expiredBadgeText}>Cancelled</Text>
                </View>
                {activeOrder.cancelled_at && (
                  <Text style={styles.expiredDateText}>
                    {new Date(activeOrder.cancelled_at).toLocaleDateString()}
                  </Text>
                )}
              </View>
              <View style={styles.expiredBody}>
                <AppIcon.Sessions width={20} height={20} color={theme.colors.text.tertiary} />
                <Text style={styles.expiredBodyText}>
                  This order was cancelled. The quoted pricing and inventory are no
                  longer reserved.
                </Text>
              </View>
            </View>

            <BrandOrderSummaryCard order={activeOrder} />
          </>
        )}

        {/* === DISPUTED === */}
        {status === 'DISPUTED' && (
          <>
            <View style={styles.expiredBanner}>
              <View style={styles.expiredBadgeRow}>
                <View
                  style={[
                    styles.expiredBadge,
                    { backgroundColor: 'rgba(239,68,68,0.1)' },
                  ]}
                >
                  <Text
                    style={[styles.expiredBadgeText, { color: theme.colors.error.DEFAULT }]}
                  >
                    Disputed
                  </Text>
                </View>
              </View>
              <View style={styles.expiredBody}>
                <AppIcon.Warning width={20} height={20} color={theme.colors.error.DEFAULT} />
                <Text style={styles.expiredBodyText}>
                  A dispute has been filed for this order. Our support team is
                  reviewing the case. You will be notified once it is resolved.
                </Text>
              </View>
            </View>

            <BrandOrderSummaryCard order={activeOrder} />

            <View style={styles.section}>
              <BrandOrderTimeline currentStatus={status} />
            </View>
          </>
        )}
      </ScrollView>

      {/* === FOOTER ACTIONS === */}
      <View style={styles.footer}>
        {status === 'ACCEPTED' && (
          <>
            <CustomButton
              title={paying ? 'Processing...' : `Pay Platform Fee — ₹${activeOrder.total_amount}`}
              onPress={handlePay}
              variant="gradient"
              size="lg"
              disabled={paying}
            />
            <View style={styles.footerGap} />
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={handleCancel}
              activeOpacity={0.7}
              disabled={cancelOrder.isPending}
            >
              <Text fontWeight="bold" style={styles.outlineButtonText}>
                {cancelOrder.isPending ? 'Cancelling...' : 'Cancel Order'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'CONNECTED' && (
          <CustomButton
            title="Back to Dashboard"
            onPress={handleBackToDashboard}
            variant="gradient"
            size="lg"
          />
        )}

        {status === 'CANCELLED' && (
          <>
            <CustomButton
              title="Reorder Items"
              onPress={handleBackToMarketplace}
              variant="gradient"
              size="lg"
            />
            <View style={styles.footerGap} />
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={handleBackToMarketplace}
              activeOpacity={0.7}
            >
              <Text fontWeight="bold" style={styles.outlineButtonText}>
                Back to List
              </Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'REQUESTED' && (
          <Text style={styles.footerHint}>
            You can cancel this order at any time before it is accepted by the
            converter.
          </Text>
        )}
      </View>
    </View>
  );
};
