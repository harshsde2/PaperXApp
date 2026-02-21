import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { useGetRtdCatalogInfinite, useGetBrandRtdOrders } from '@services/api/brandRtdApi';
import { SCREENS } from '@navigation/constants';
import { RTDFilterBar } from '../../components/RTDFilterBar';
import { RTDProductCard } from '../../components/RTDProductCard';
import type { RTDFilterState, RTDFilterKey } from '../../components/RTDFilterBar/@types';
import type { RtdProduct, RtdOrderStatus } from '@services/api/rtdApi/@types';
import type { BrandRTDMarketplaceScreenProps, MarketplaceFilterState } from './@types';
import { createStyles } from './styles';

const ACTIVE_STATUSES: RtdOrderStatus[] = [
  'REQUESTED', 'ACCEPTED', 'PAID', 'IN_PRODUCTION', 'DISPATCHED',
];

const INITIAL_FILTERS: RTDFilterState = {
  category: null,
  leadTime: null,
  moq: null,
  price: null,
};

export const BrandRTDMarketplaceScreen: React.FC<
  BrandRTDMarketplaceScreenProps
> = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [chipFilters, setChipFilters] = useState<RTDFilterState>(INITIAL_FILTERS);

  const { data: rtdOrders, refetch: refetchOrders } = useGetBrandRtdOrders();

  const activeProductIds = useMemo(() => {
    const ids = new Set<number>();
    (rtdOrders ?? []).forEach((o) => {
      if (ACTIVE_STATUSES.includes(o.status)) ids.add(o.product_id);
    });
    return ids;
  }, [rtdOrders]);

  useFocusEffect(
    useCallback(() => {
      refetchOrders();
    }, [refetchOrders]),
  );

  const apiParams = useMemo<MarketplaceFilterState>(() => {
    const params: MarketplaceFilterState = {};
    if (chipFilters.category) params.category = chipFilters.category;
    if (chipFilters.leadTime) params.lead_time = chipFilters.leadTime;
    if (chipFilters.price) {
      params.sort_by = 'base_price';
      params.sort_dir = chipFilters.price === 'low' ? 'asc' : 'desc';
    }
    return params;
  }, [chipFilters]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useGetRtdCatalogInfinite(apiParams);

  const products = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const handleFilterChange = useCallback((key: RTDFilterKey) => {
    setChipFilters((prev) => ({
      ...prev,
      [key]: prev[key] ? null : key,
    }));
  }, []);

  const handleBuyNow = useCallback(
    (product: RtdProduct) => {
      navigation.navigate(SCREENS.BRAND_RTD.PRODUCT_DETAIL, {
        productId: product.id,
      });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleMyOrders = useCallback(() => {
    navigation.navigate(SCREENS.BRAND_RTD.MY_ORDERS as any);
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: RtdProduct }) => (
      <RTDProductCard
        product={item}
        onBuyNow={handleBuyNow}
        hasActiveOrder={activeProductIds.has(item.id)}
      />
    ),
    [handleBuyNow, activeProductIds],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text fontWeight="semibold" style={styles.emptyText}>
          No Products Found
        </Text>
        <Text style={styles.emptySubText}>
          Try adjusting your filters or check back later for new listings.
        </Text>
      </View>
    );
  }, [isLoading, styles, theme]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <ActivityIndicator
        size="small"
        color={theme.colors.primary.DEFAULT}
        style={styles.footerLoader}
      />
    );
  }, [isFetchingNextPage, theme]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.filterHeaderRow}>
          <RTDFilterBar filters={chipFilters} onFilterChange={handleFilterChange} />
          <TouchableOpacity onPress={handleMyOrders} style={styles.myOrdersLink} activeOpacity={0.7}>
            <Text fontWeight="bold" style={styles.myOrdersLinkText}>My Orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
      />
    </View>
  );
};
