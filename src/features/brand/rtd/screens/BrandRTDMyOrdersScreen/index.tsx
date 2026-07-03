import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { useGetBrandRtdOrdersInfinite } from '@services/api/brandRtdApi';
import type { RtdOrder } from '@services/api/rtdApi/@types';
import { ACTIVE_RTD_STATUSES } from '../../constants';
import type { BrandRTDMyOrdersScreenProps, OrderTab } from './@types';
import { createStyles } from './styles';

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: '#3b82f6',
  ACCEPTED: '#3b82f6',
  CONNECTED: '#10b981',
  PAID: '#10b981',
  IN_PRODUCTION: '#f59e0b',
  DISPATCHED: '#3b82f6',
  COMPLETED: '#10b981',
  CANCELLED: '#94a3b8',
  DISPUTED: '#ef4444',
};

function getTimeLabel(deadline: string | null | undefined): string | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const BrandRTDMyOrdersScreen: React.FC<BrandRTDMyOrdersScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState<OrderTab>('active');
  const [, setTick] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const params = useMemo(
    () => (activeTab === 'active' ? undefined : undefined),
    [activeTab],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading,
  } = useGetBrandRtdOrdersInfinite(params);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const allOrders = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const orders = useMemo(() => {
    if (activeTab === 'active') {
      return allOrders.filter((o) => ACTIVE_RTD_STATUSES.includes(o.status));
    }
    return allOrders.filter((o) => !ACTIVE_RTD_STATUSES.includes(o.status));
  }, [allOrders, activeTab]);

  const hasCountdowns = useMemo(
    () =>
      orders.some(
        (o) =>
          (o.status === 'REQUESTED' || o.status === 'ACCEPTED') &&
          o.confirmation_deadline,
      ),
    [orders],
  );

  useEffect(() => {
    if (hasCountdowns) {
      tickRef.current = setInterval(() => setTick((t) => t + 1), 1000);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [hasCountdowns]);

  const handleCardPress = useCallback(
    (orderId: number) => {
      navigation.navigate(SCREENS.BRAND_RTD.ORDER_DETAIL as any, { orderId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: RtdOrder }) => {
      const color = STATUS_COLORS[item.status] ?? '#94a3b8';
      const showCountdown =
        (item.status === 'REQUESTED' || item.status === 'ACCEPTED') &&
        item.confirmation_deadline;
      const timeLabel = showCountdown
        ? getTimeLabel(item.confirmation_deadline)
        : null;

      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleCardPress(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.orderId}>#PX-{item.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: color }]}>
              <Text style={styles.statusBadgeText}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            {item.product?.image_path ? (
              <Image
                source={{ uri: item.product.image_path }}
                style={styles.productThumbImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.productThumb} />
            )}
            <View style={styles.cardInfo}>
              <Text fontWeight="semibold" style={styles.productName} numberOfLines={1}>
                {item.product?.display_name ?? item.product?.product_name ?? item.product?.category ?? 'Product'}
              </Text>
              <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
            </View>
            <Text fontWeight="bold" style={styles.amountText}>
              ₹{item.subtotal}
            </Text>
          </View>

          {showCountdown && (
            <View style={styles.cardFooter}>
              {timeLabel ? (
                <>
                  <Text style={styles.footerLabel}>
                    {item.status === 'REQUESTED'
                      ? 'Awaiting confirmation'
                      : 'Payment deadline'}
                  </Text>
                  <View style={styles.countdownRow}>
                    <AppIcon.Sessions
                      width={14}
                      height={14}
                      color={theme.colors.primary.DEFAULT}
                    />
                    <Text style={styles.countdownText}>{timeLabel}</Text>
                  </View>
                </>
              ) : null}
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [handleCardPress, styles, theme],
  );

  const renderEmpty = useCallback(
    () =>
      !isLoading ? (
        <View style={styles.emptyContainer}>
          <AppIcon.Market
            width={48}
            height={48}
            color={theme.colors.text.tertiary}
          />
          <Text fontWeight="semibold" style={styles.emptyText}>
            {activeTab === 'active' ? 'No active orders' : 'No past orders'}
          </Text>
          <Text style={styles.emptySubText}>
            {activeTab === 'active'
              ? 'Browse the List of Products to place your first order.'
              : 'Completed and cancelled orders will appear here.'}
          </Text>
        </View>
      ) : null,
    [isLoading, activeTab, styles, theme],
  );

  const renderFooter = useCallback(
    () =>
      isFetchingNextPage ? (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
        </View>
      ) : null,
    [isFetchingNextPage, styles, theme],
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.7}
        >
          <Text
            fontWeight="semibold"
            style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Text
            fontWeight="semibold"
            style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            styles.listContent,
            orders.length === 0 && { flexGrow: 1 },
          ]}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={() => refetch()}
              tintColor={theme.colors.primary.DEFAULT}
            />
          }
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};
