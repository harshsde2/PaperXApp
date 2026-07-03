import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, Alert, RefreshControl } from 'react-native';
import { useTheme } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { useGetRtdOrderDetail, useAcceptRtdOrder, useDeclineRtdOrder } from '@services/api';
import type { RtdOrderStatus } from '@services/api';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';
import { OrderSummaryCard } from '../../components/OrderSummaryCard';
import { OrderTimeline } from '../../components/OrderTimeline';
import { OrderActionButtons } from '../../components/OrderActionButtons';
import { ContactDetailsCard } from '@shared/components/ContactDetailsCard';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { DetailSkeleton } from '@shared/components/skeletons';
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

  const { data: order, isError, refetch } = useGetRtdOrderDetail(orderId);

  const acceptMutation = useAcceptRtdOrder();
  const declineMutation = useDeclineRtdOrder();

  const [countdown, setCountdown] = useState<CountdownState | null>(null);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const showSkeleton = useSkeleton(!order && !isError);

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

  const status = order?.status as RtdOrderStatus | undefined;
  const showBrandContact =
    status === 'CONNECTED' ||
    status === 'PAID' ||
    status === 'IN_PRODUCTION' ||
    status === 'DISPATCHED' ||
    status === 'COMPLETED';

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

  const renderCancelledBanner = useMemo(() => {
    if (status !== 'CANCELLED') return null;
    return (
      <View
        style={[
          styles.bannerCard,
          {
            backgroundColor: theme.colors.text.tertiary + '10',
            borderColor: theme.colors.border.primary,
          },
        ]}
      >
        <Text style={[styles.bannerTitle, { color: theme.colors.text.primary }]}>
          Order Cancelled
        </Text>
        <Text style={[styles.bannerText, { color: theme.colors.text.secondary }]}>
          This order was cancelled by the brand before the platform fee was paid.
        </Text>
      </View>
    );
  }, [status, styles, theme]);

  if (!order) {
    if (isError) {
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
    if (showSkeleton) {
      return (
        <View style={styles.loadingContainer}>
          <DetailSkeleton />
        </View>
      );
    }
    return null;
  }

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

        {renderCancelledBanner}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          <OrderTimeline currentStatus={order.status as RtdOrderStatus} />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <OrderSummaryCard order={order} />
        </View>

        {showBrandContact && (
          <ContactDetailsCard
            title="Brand Contact"
            name={order.brand?.name}
            companyName={order.brand?.company_name}
            email={order.brand?.email}
            phone={order.brand?.mobile}
          />
        )}

        <View style={styles.actionContainer}>
          <OrderActionButtons
            status={order.status as RtdOrderStatus}
            onAccept={handleAccept}
            onDecline={handleDecline}
            loadingAccept={acceptMutation.isPending}
            loadingDecline={declineMutation.isPending}
          />
        </View>
      </ScrollView>
    </View>
  );
};
