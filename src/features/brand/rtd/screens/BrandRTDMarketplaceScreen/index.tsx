import React, { useState, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomHeader } from '@shared/components/CustomHeader';
import { AppIcon } from '@assets/svgs';
import { useGetRtdCatalogInfinite, useGetBrandRtdOrders } from '@services/api/brandRtdApi';
import { SCREENS } from '@navigation/constants';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { Skeleton } from '@shared/components/Skeleton';
import { RTDProductCard } from '../../components/RTDProductCard';
import { MarketplaceFilterSheet } from '../../components/MarketplaceFilterSheet';
import type { RtdProduct, RtdLeadTime, GetRtdCatalogParams } from '@services/api/rtdApi/@types';
import { ACTIVE_RTD_STATUSES, getOrderProductId } from '../../constants';
import type {
  BrandRTDMarketplaceScreenProps,
  AdvancedFilterState,
} from './@types';
import { INITIAL_ADVANCED_FILTERS } from './@types';
import { createStyles } from './styles';

const FILTER_SNAP_POINTS = ['100%'];

export const BrandRTDMarketplaceScreen: React.FC<
  BrandRTDMarketplaceScreenProps
> = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const filterSheetRef = useRef<BottomSheetModal>(null);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>(
    INITIAL_ADVANCED_FILTERS,
  );

  const { data: rtdOrders, refetch: refetchOrders } = useGetBrandRtdOrders();

  const activeOrdersByProduct = useMemo(() => {
    const map = new Map<number, number>();
    (rtdOrders ?? []).forEach((o) => {
      const pid = getOrderProductId(o);
      if (pid != null && ACTIVE_RTD_STATUSES.includes(o.status)) map.set(pid, o.id);
    });
    return map;
  }, [rtdOrders]);

  useFocusEffect(
    useCallback(() => {
      refetchOrders();
    }, [refetchOrders]),
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.delivery_geography) count++;
    if (advancedFilters.lead_time) count++;
    if (advancedFilters.min_price || advancedFilters.max_price) count++;
    if (advancedFilters.moq_range) count++;
    if (advancedFilters.category) count++;
    if (advancedFilters.location_scope) count++;
    if (advancedFilters.has_branding === 'yes') count++;
    return count;
  }, [advancedFilters]);

  const handleFilterPress = useCallback(() => {
    filterSheetRef.current?.present();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <CustomHeader
          {...props}
          rightButton={{
            icon: (
              <View style={styles.filterIconWrapper}>
                <AppIcon.Filter width={22} height={22} color={theme.colors.text.primary} />
                {activeFilterCount > 0 && (
                  <View style={styles.filterBadge}>
                    <Text variant="captionSmall" style={styles.filterBadgeText}>
                      {activeFilterCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
            onPress: handleFilterPress,
          }}
        />
      ),
    });
  }, [navigation, handleFilterPress, activeFilterCount, styles, theme]);

  const apiParams = useMemo<Omit<GetRtdCatalogParams, 'page'>>(() => {
    const params: Omit<GetRtdCatalogParams, 'page'> = {};

    if (advancedFilters.delivery_geography) {
      params.delivery_geography = advancedFilters.delivery_geography;
    }
    if (advancedFilters.lead_time) {
      params.lead_time = advancedFilters.lead_time as RtdLeadTime;
    }
    if (advancedFilters.min_price) {
      params.min_price = Number(advancedFilters.min_price);
    }
    if (advancedFilters.max_price) {
      params.max_price = Number(advancedFilters.max_price);
    }
    if (advancedFilters.moq_range) {
      if (advancedFilters.moq_range === '0-50') {
        params.min_moq = 0;
        params.max_moq = 50;
      } else if (advancedFilters.moq_range === '50-500') {
        params.min_moq = 50;
        params.max_moq = 500;
      } else if (advancedFilters.moq_range === '500+') {
        params.min_moq = 500;
      }
    }
    if (advancedFilters.category) {
      params.category = advancedFilters.category;
    }
    if (advancedFilters.location_scope) {
      params.location_scope = advancedFilters.location_scope as 'city' | 'state' | 'pan_india';
    }
    if (advancedFilters.has_branding === 'yes') {
      params.has_branding = 'yes';
    }
    return params;
  }, [advancedFilters]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useGetRtdCatalogInfinite(apiParams);
  const showSkeleton = useSkeleton(isLoading);

  const products = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const handleApplyAdvancedFilters = useCallback((filters: AdvancedFilterState) => {
    setAdvancedFilters(filters);
    filterSheetRef.current?.dismiss();
  }, []);

  const handleResetAdvancedFilters = useCallback(() => {
    setAdvancedFilters(INITIAL_ADVANCED_FILTERS);
    filterSheetRef.current?.dismiss();
  }, []);

  const handleBuyNow = useCallback(
    (product: RtdProduct) => {
      navigation.navigate(SCREENS.BRAND_RTD.PRODUCT_DETAIL, {
        productId: product.id,
      });
    },
    [navigation],
  );

  const handleViewOrder = useCallback(
    (orderId: number) => {
      navigation.navigate(SCREENS.BRAND_RTD.ORDER_DETAIL as any, { orderId });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: RtdProduct }) => (
      <RTDProductCard
        product={item}
        onBuyNow={handleBuyNow}
        hasActiveOrder={activeOrdersByProduct.has(item.id)}
        activeOrderId={activeOrdersByProduct.get(item.id)}
        onViewOrder={handleViewOrder}
      />
    ),
    [handleBuyNow, activeOrdersByProduct, handleViewOrder],
  );

  const renderEmpty = useCallback(() => {
    if (showSkeleton) {
      return (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={`marketplace-skeleton-${index}`} style={styles.skeletonCard}>
              <Skeleton height={140} width="100%" borderRadius={theme.borderRadius.md} />
              <View style={styles.skeletonBody}>
                <View style={styles.skeletonTitleRow}>
                  <Skeleton height={16} width="65%" />
                  <Skeleton height={24} width={72} borderRadius={theme.borderRadius.full} />
                </View>
                <Skeleton height={12} width="45%" />
                <Skeleton height={12} width="78%" />
                <View style={styles.skeletonFooterRow}>
                  <Skeleton height={14} width="28%" />
                  <Skeleton height={34} width={112} borderRadius={theme.borderRadius.lg} />
                </View>
              </View>
            </View>
          ))}
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
  }, [showSkeleton, styles, theme.borderRadius]);

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

  const listContentStyle = useMemo(
    () => [
      styles.listContent,
      products.length === 0 ? styles.listContentFillWhenEmpty : null,
    ],
    [styles.listContent, styles.listContentFillWhenEmpty, products.length],
  );

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={listContentStyle}
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

        <GorhomBottomSheetModal
          ref={filterSheetRef}
          snapPoints={FILTER_SNAP_POINTS}
          enablePanDownToClose
          enableDynamicSizing={false}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.sheetHandle}
        >
          <MarketplaceFilterSheet
            filters={advancedFilters}
            onApply={handleApplyAdvancedFilters}
            onReset={handleResetAdvancedFilters}
          />
        </GorhomBottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};
