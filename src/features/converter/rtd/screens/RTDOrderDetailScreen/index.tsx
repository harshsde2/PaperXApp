import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import {
  useGetRtdOrderDetail,
  useAcceptRtdOrder,
  useDeclineRtdOrder,
  useMarkRtdOrderInProduction,
} from '@services/api';
import type { RtdOrderStatus } from '@services/api';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';
import { OrderSummaryCard } from '../../components/OrderSummaryCard';
import { OrderTimeline } from '../../components/OrderTimeline';
import { OrderActionButtons } from '../../components/OrderActionButtons';
import { DispatchProofModal } from '../../components/DispatchProofModal';
import type { RTDOrderDetailScreenProps, CountdownState } from './@types';
import { STATUS_LABELS, STATUS_DESCRIPTIONS } from './@types';
import { createStyles } from './styles';

const calcCountdown = (deadline: string): CountdownState => {
  const remaining = new Date(deadline).getTime() - Date.now();
  if (remaining <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
};

export const RTDOrderDetailScreen: React.FC<RTDOrderDetailScreenProps> = ({ route }) => {
  const { orderId } = route.params;
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const {
    data: order,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useGetRtdOrderDetail(orderId);

  const acceptMutation = useAcceptRtdOrder();
  const declineMutation = useDeclineRtdOrder();
  const inProductionMutation = useMarkRtdOrderInProduction();

  const [dispatchModalVisible, setDispatchModalVisible] = useState(false);
  const [countdown, setCountdown] = useState<CountdownState | null>(null);

  const isMutating =
    acceptMutation.isPending ||
    declineMutation.isPending ||
    inProductionMutation.isPending;

  // Countdown timer for REQUESTED state
  useEffect(() => {
    if (order?.status !== 'REQUESTED' || !order.confirmation_deadline) {
      setCountdown(null);
      return;
    }

    setCountdown(calcCountdown(order.confirmation_deadline));
    const interval = setInterval(() => {
      const state = calcCountdown(order.confirmation_deadline!);
      setCountdown(state);
      if (state.expired) {
        clearInterval(interval);
        refetch();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order?.status, order?.confirmation_deadline, refetch]);

  const handleAccept = useCallback(() => {
    Alert.alert('Accept Order', 'Are you sure you want to accept this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept',
        onPress: () => {
          acceptMutation.mutate(Number(orderId), {
            onSuccess: () => refetch(),
            onError: (err) => Alert.alert('Error', err.message || 'Failed to accept order'),
          });
        },
      },
    ]);
  }, [orderId, acceptMutation, refetch]);

  const handleDecline = useCallback(() => {
    Alert.alert('Decline Order', 'Are you sure you want to decline this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: () => {
          declineMutation.mutate(Number(orderId), {
            onSuccess: () => navigation.goBack(),
            onError: (err) => Alert.alert('Error', err.message || 'Failed to decline order'),
          });
        },
      },
    ]);
  }, [orderId, declineMutation, navigation]);

  const handleMarkInProduction = useCallback(() => {
    inProductionMutation.mutate(Number(orderId), {
      onSuccess: () => refetch(),
      onError: (err) => Alert.alert('Error', err.message || 'Failed to update order'),
    });
  }, [orderId, inProductionMutation, refetch]);

  const handleDispatch = useCallback(() => {
    setDispatchModalVisible(true);
  }, []);

  const handleDispatchSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const status = order?.status as RtdOrderStatus | undefined;

  const renderCountdown = useMemo(() => {
    if (!countdown || status !== 'REQUESTED') return null;
    return (
      <View style={styles.countdownContainer}>
        <View style={styles.countdownIcon}>
          <AppIcon.Sessions width={20} height={20} color={theme.colors.warning.DEFAULT} />
        </View>
        <View style={styles.countdownTextContainer}>
          <Text style={styles.countdownLabel}>Response deadline</Text>
          {countdown.expired ? (
            <Text style={styles.countdownExpired}>Expired</Text>
          ) : (
            <Text style={styles.countdownValue}>
              {countdown.hours}h {countdown.minutes}m {countdown.seconds}s remaining
            </Text>
          )}
        </View>
      </View>
    );
  }, [countdown, status, styles, theme]);

  const renderPayoutInfo = useMemo(() => {
    if (status !== 'COMPLETED' || !order?.payout) return null;
    const rawAmount = order.payout.amount ?? order.payout.payout_amount;
    const numericAmount = rawAmount != null ? Number(rawAmount) : 0;
    const formattedAmount = !isNaN(numericAmount)
      ? numericAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '0.00';
    return (
      <View style={styles.payoutCard}>
        <Text style={styles.payoutTitle}>Payout Information</Text>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutAmount}>₹{formattedAmount}</Text>
          <Text style={styles.payoutStatus}>{order.payout.payout_status}</Text>
        </View>
      </View>
    );
  }, [status, order?.payout, styles]);

  const renderDisputeBanner = useMemo(() => {
    if (status !== 'DISPUTED') return null;
    return (
      <View
        style={[
          styles.bannerCard,
          {
            backgroundColor: theme.colors.error.DEFAULT + '10',
            borderColor: theme.colors.error.DEFAULT + '30',
          },
        ]}
      >
        <Text style={[styles.bannerTitle, { color: theme.colors.error.DEFAULT }]}>
          Dispute Raised
        </Text>
        <Text style={[styles.bannerText, { color: theme.colors.text.secondary }]}>
          The brand has raised a dispute on this order. Payout is on hold until the dispute is
          resolved. Please contact support for assistance.
        </Text>
      </View>
    );
  }, [status, styles, theme]);

  const renderCancelledBanner = useMemo(() => {
    if (status !== 'CANCELLED') return null;
    return (
      <View
        style={[
          styles.bannerCard,
          {
            backgroundColor: theme.colors.text.tertiary + '10',
            borderColor: theme.colors.border.DEFAULT,
          },
        ]}
      >
        <Text style={[styles.bannerTitle, { color: theme.colors.text.primary }]}>
          Order Cancelled
        </Text>
        <Text style={[styles.bannerText, { color: theme.colors.text.secondary }]}>
          This order was cancelled by the brand before payment was completed.
        </Text>
      </View>
    );
  }, [status, styles, theme]);

  const renderTrackingInfo = useMemo(() => {
    if (status !== 'DISPATCHED' && status !== 'COMPLETED') return null;
    if (!order?.tracking_number && !order?.dispatch_proof_url) return null;
    return (
      <View style={styles.trackingCard}>
        <Text style={styles.trackingTitle}>Dispatch Information</Text>
        {order.dispatch_proof_type && (
          <View style={styles.trackingRow}>
            <Text style={styles.trackingLabel}>Proof Type</Text>
            <Text style={styles.trackingValue}>
              {order.dispatch_proof_type.replace(/_/g, ' ')}
            </Text>
          </View>
        )}
        {order.tracking_number && (
          <View style={[styles.trackingRow, { marginTop: theme.spacing[2] }]}>
            <Text style={styles.trackingLabel}>Tracking Number</Text>
            <Text style={styles.trackingValue}>{order.tracking_number}</Text>
          </View>
        )}
      </View>
    );
  }, [status, order, styles, theme]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View style={styles.errorContainer}>
        <AppIcon.Warning width={40} height={40} color={theme.colors.text.tertiary} />
        <Text style={styles.errorText}>Failed to load order details. Pull down to retry.</Text>
        <CustomButton
          title="Retry"
          onPress={() => refetch()}
          variant="outline"
          size="sm"
          style={{ marginTop: theme.spacing[4] }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
      >
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.statusHeaderRow}>
            <Text style={styles.statusTitle}>
              {STATUS_LABELS[order.status as RtdOrderStatus] ?? order.status}
            </Text>
            <OrderStatusBadge status={order.status as RtdOrderStatus} />
          </View>
          <Text style={styles.statusDescription}>
            {STATUS_DESCRIPTIONS[order.status as RtdOrderStatus] ?? ''}
          </Text>
          {renderCountdown}
        </View>

        {/* Banners */}
        {renderDisputeBanner}
        {renderCancelledBanner}

        {/* Payout */}
        {renderPayoutInfo}

        {/* Tracking */}
        {renderTrackingInfo}

        {/* Timeline */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          <OrderTimeline currentStatus={order.status as RtdOrderStatus} />
        </View>

        {/* Order Summary */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <OrderSummaryCard order={order} />
        </View>

        {/* Actions */}
        <View style={styles.actionContainer}>
          <OrderActionButtons
            status={order.status as RtdOrderStatus}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onMarkInProduction={handleMarkInProduction}
            onDispatch={handleDispatch}
            loading={isMutating}
          />
        </View>
      </ScrollView>

      {/* Dispatch Proof Modal */}
      <DispatchProofModal
        visible={dispatchModalVisible}
        orderId={Number(order.id)}
        onClose={() => setDispatchModalVisible(false)}
        onSuccess={handleDispatchSuccess}
      />
    </View>
  );
};
