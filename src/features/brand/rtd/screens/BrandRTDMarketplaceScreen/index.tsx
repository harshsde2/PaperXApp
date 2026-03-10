import React, { useState, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomHeader } from '@shared/components/CustomHeader';
import { AppIcon } from '@assets/svgs';
import { useGetRtdCatalogInfinite, useGetBrandRtdOrders } from '@services/api/brandRtdApi';
import { SCREENS } from '@navigation/constants';
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

const FILTER_SNAP_POINTS = ['75%','100%'];

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
    if (advancedFilters.moq) count++;
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
    if (advancedFilters.moq) {
      const moqNum = Number(advancedFilters.moq);
      if (!isNaN(moqNum) && moqNum > 0) {
        params.max_moq = moqNum;
      }
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
    <BottomSheetModalProvider>
      <View style={styles.container}>
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

        <BottomSheetModal
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
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};
