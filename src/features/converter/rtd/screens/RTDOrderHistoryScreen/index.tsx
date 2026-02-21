import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useGetRtdOrdersInfinite } from '@services/api';
import type { RtdOrder } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { OrderCard } from '../../components/OrderCard';
import type { OrderTab } from './@types';
import { createStyles } from './styles';

export const RTDOrderHistoryScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = React.useState<OrderTab>('requests');

  const params =
    activeTab === 'requests'
      ? { status: 'REQUESTED' as const }
      : undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading,
  } = useGetRtdOrdersInfinite(params);

  const orders = data?.pages.flatMap((page) => page.data) ?? [];

  const handleCardPress = useCallback(
    (orderId: number) => {
      navigation.navigate(SCREENS.CONVERTER_RTD.ORDER_DETAIL, {
        orderId,
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: RtdOrder }) => (
      <OrderCard order={item} onPress={handleCardPress} />
    ),
    [handleCardPress]
  );

  const ListEmptyComponent = useCallback(
    () =>
      !isLoading ? (
        <View style={styles.emptyContainer}>
          <AppIcon.Market
            width={48}
            height={48}
            color={theme.colors.text.tertiary}
          />
          <Text variant="bodyMedium" style={styles.emptyText}>
            No orders yet
          </Text>
        </View>
      ) : null,
    [isLoading, styles.emptyContainer, styles.emptyText, theme.colors.text.tertiary]
  );

  const ListFooterComponent = useCallback(
    () =>
      isFetchingNextPage ? (
        <View style={styles.footerLoader}>
          <ActivityIndicator
            size="small"
            color={theme.colors.primary.DEFAULT}
          />
        </View>
      ) : null,
    [isFetchingNextPage, styles.footerLoader, theme.colors.primary.DEFAULT]
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
          activeOpacity={0.7}
        >
          <Text
            variant="bodyMedium"
            fontWeight={activeTab === 'requests' ? 'semibold' : 'semibold'}
            style={[
              styles.tabText,
              activeTab === 'requests' && styles.activeTabText,
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Text
            variant="bodyMedium"
            fontWeight={activeTab === 'history' ? 'semibold' : 'semibold'}
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          orders.length === 0 && { flexGrow: 1 },
        ]}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};
