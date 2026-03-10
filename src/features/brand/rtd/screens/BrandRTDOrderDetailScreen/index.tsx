import React, { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Clipboard,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import {
  useGetBrandRtdOrderDetail,
  useConfirmRtdPayment,
  useRaiseRtdDispute,
  useCancelRtdOrder,
} from '@services/api/brandRtdApi';
import type { RtdOrderStatus } from '@services/api';
import { BrandOrderTimeline } from '../../components/BrandOrderTimeline';
import { BrandOrderSummaryCard } from '../../components/BrandOrderSummaryCard';
import { OrderCountdownTimer } from '../../components/OrderCountdownTimer';
import { TrackingInfoCard } from '../../components/TrackingInfoCard';
import { ContactDetailsCard } from '@shared/components/ContactDetailsCard';
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
    progress: 0.35,
    title: 'Converter confirmed availability',
    description:
      'Please complete your payment to finalize the order and start the production process.',
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

  const confirmPayment = useConfirmRtdPayment();
  const raiseDispute = useRaiseRtdDispute();
  const cancelOrder = useCancelRtdOrder();

  const meta = useMemo(
    () => STATUS_META[activeOrder?.status ?? 'REQUESTED'],
    [activeOrder?.status],
  );

  const handlePay = useCallback(() => {
    if (!activeOrder) return;
    Alert.alert('Confirm Payment', 'Proceed to pay for this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Pay Now',
        onPress: () =>
          confirmPayment.mutate(
            { order_id: activeOrder.id },
            {
              onSuccess: () => refetch(),
              onError: (err) =>
                Alert.alert('Error', err?.message ?? 'Payment failed'),
            },
          ),
      },
    ]);
  }, [activeOrder, confirmPayment, refetch]);

  const handleRaiseDispute = useCallback(() => {
    if (!activeOrder) return;
    Alert.alert(
      'Raise Dispute',
      'Something wrong with your order? This will notify our support team.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Raise Dispute',
          style: 'destructive',
          onPress: () =>
            raiseDispute.mutate(activeOrder.id, {
              onSuccess: () => refetch(),
              onError: (err) =>
                Alert.alert('Error', err?.message ?? 'Failed to raise dispute'),
            }),
        },
      ],
    );
  }, [activeOrder, raiseDispute, refetch]);

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

  const handleCopyTracking = useCallback(() => {
    if (activeOrder?.tracking_number) {
      Clipboard.setString(activeOrder.tracking_number);
      Alert.alert('Copied', 'Tracking number copied to clipboard.');
    }
  }, [activeOrder?.tracking_number]);

  if (!activeOrder) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }

  const status = activeOrder.status;
  const isTerminal = ['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(status);

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

            {/* <View style={{ marginTop: theme.spacing[2], marginHorizontal: theme.spacing[4] }}>
              <EscrowBanner description="Funds are held safely until your order is delivered." />
            </View> */}

            <View style={styles.pricingCard}>
              <Text style={styles.pricingHeader}>Full Order Summary</Text>
              <View style={styles.pricingProductRow}>
                <View style={{ flex: 1 }}>
                  <Text fontWeight="bold" style={styles.pricingProductName}>
                    {activeOrder.product?.display_name ?? activeOrder.product?.product_name ?? activeOrder.product?.category ?? 'Product'}
                  </Text>
                  <Text style={styles.pricingRef}>Ref: #PX-{activeOrder.id}</Text>
                </View>
                <Text style={styles.pricingProductPrice}>
                  ₹{activeOrder.subtotal}
                </Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Quantity</Text>
                <Text style={styles.pricingValue}>{activeOrder.quantity} Units</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Product value</Text>
                <Text style={styles.pricingValue}>
                  ₹{activeOrder.subtotal}
                </Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Platform fee</Text>
                <Text style={styles.pricingValue}>
                  ₹{activeOrder.commission_amount}
                </Text>
              </View>
              {activeOrder.seller_gst_registered !== false && Number(activeOrder.gst_amount) > 0 && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>GST (18%)</Text>
                  <Text style={styles.pricingValue}>₹{activeOrder.gst_amount}</Text>
                </View>
              )}
              <View style={styles.pricingDivider} />
              <View style={styles.pricingTotalRow}>
                <Text fontWeight="bold" style={styles.pricingTotalLabel}>
                  Final Total
                </Text>
                <Text fontWeight="bold" style={styles.pricingTotalValue}>
                  ₹{activeOrder.total_amount}
                </Text>
              </View>
            </View>

            <View style={styles.facilitatorNote}>
              <Text style={styles.facilitatorText}>
                Zupply acts as a payment collection facilitator on behalf of the seller.
                Product amount is collected on behalf of the seller; platform fee is
                charged by Zupply for its services. Zupply does not guarantee product
                quality or delivery — the seller is solely responsible.
              </Text>
            </View>
          </>
        )}

        {/* === PAID / IN_PRODUCTION === */}
        {(status === 'PAID' || status === 'IN_PRODUCTION') && (
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

            {/* <View style={{ marginTop: theme.spacing[2], marginHorizontal: theme.spacing[4] }}>
              <EscrowBanner />
            </View> */}

            <BrandOrderSummaryCard order={activeOrder} />

            <ContactDetailsCard
              title="Converter Contact"
              name={activeOrder.converter?.name}
              companyName={activeOrder.converter?.company_name}
              email={activeOrder.converter?.email}
              phone={activeOrder.converter?.mobile}
            />
          </>
        )}

        {/* === DISPATCHED === */}
        {status === 'DISPATCHED' && (
          <>
            <View style={styles.dispatchedCard}>
              <View style={styles.dispatchedBadge}>
                <Text style={styles.dispatchedBadgeText}>In Transit</Text>
              </View>
              <Text fontWeight="bold" style={styles.dispatchedTitle}>
                Dispatched
              </Text>
              <Text style={styles.dispatchedDescription}>
                Your order has left the facility and is currently being handled by the
                courier partner.
              </Text>
            </View>

            <View style={{ marginHorizontal: theme.spacing[4], marginTop: theme.spacing[2] }}>
              <TrackingInfoCard
                trackingNumber={activeOrder.tracking_number ?? null}
                courierService={null}
                onCopyTracking={
                  activeOrder.tracking_number ? handleCopyTracking : undefined
                }
              />
            </View>

            <BrandOrderSummaryCard order={activeOrder} />

            <ContactDetailsCard
              title="Converter Contact"
              name={activeOrder.converter?.name}
              companyName={activeOrder.converter?.company_name}
              email={activeOrder.converter?.email}
              phone={activeOrder.converter?.mobile}
            />
          </>
        )}

        {/* === COMPLETED === */}
        {status === 'COMPLETED' && (
          <>
            <View style={styles.completedHero}>
              <View style={styles.completedIconCircle}>
                <Text style={styles.completedIconText}>✓</Text>
              </View>
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>Completed</Text>
              </View>
              <Text fontWeight="bold" style={styles.completedTitle}>
                Order Dispatched Successfully
              </Text>
              <Text style={styles.completedSubtitle}>
                Your order has been dispatched by the converter.
              </Text>
            </View>

            <View style={{ marginHorizontal: theme.spacing[4], marginTop: theme.spacing[2] }}>
              <TrackingInfoCard
                trackingNumber={activeOrder.tracking_number ?? null}
                courierService={null}
                onCopyTracking={
                  activeOrder.tracking_number ? handleCopyTracking : undefined
                }
              />
            </View>

            <ContactDetailsCard
              title="Converter Contact"
              name={activeOrder.converter?.name}
              companyName={activeOrder.converter?.company_name}
              email={activeOrder.converter?.email}
              phone={activeOrder.converter?.mobile}
            />

            <BrandOrderSummaryCard order={activeOrder} />

            <View style={styles.section}>
              <BrandOrderTimeline currentStatus={status} />
            </View>
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
              title={confirmPayment.isPending ? 'Processing...' : 'Proceed to Payment'}
              onPress={handlePay}
              variant="gradient"
              size="lg"
              disabled={confirmPayment.isPending}
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

        {status === 'DISPATCHED' && (
          <CustomButton
            title="Back to Dashboard"
            onPress={handleBackToDashboard}
            variant="gradient"
            size="lg"
          />
        )}

        {status === 'COMPLETED' && (
          <>
            <CustomButton
              title="Back to Dashboard"
              onPress={handleBackToDashboard}
              variant="gradient"
              size="lg"
            />
            <View style={styles.footerGap} />
            {/* <TouchableOpacity
              style={styles.dangerOutlineButton}
              onPress={handleRaiseDispute}
              activeOpacity={0.7}
              disabled={raiseDispute.isPending}
            >
              <AppIcon.Warning width={16} height={16} color={theme.colors.error.DEFAULT} />
              <Text style={styles.dangerOutlineButtonText}>
                {raiseDispute.isPending ? 'Submitting...' : 'Raise Dispute'}
              </Text>
            </TouchableOpacity> */}
          </>
        )}

        {status === 'DISPUTED' && (
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
                Back to Marketplace
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
