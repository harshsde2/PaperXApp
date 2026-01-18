/**
 * TransactionHistoryScreen - Premium Design
 * Full transaction history with beautiful filters and list
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { TransactionItem } from '@shared/components/TransactionItem';
import { AppIcon } from '@assets/svgs';
import {
  useGetWalletBalance,
  useGetTransactionsInfinite,
  WalletTransaction,
  TransactionDirection,
} from '@services/api';
import { createStyles } from './styles';
import { FilterOption } from './@types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BALANCE_CARD_HEIGHT = 90;

const FILTER_OPTIONS: FilterOption[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Added', value: 'ADDED' },
  { label: 'Used', value: 'DEDUCTED' },
];

const TransactionHistoryScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [activeFilter, setActiveFilter] = useState<TransactionDirection>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const { data: wallet } = useGetWalletBalance();

  const {
    data: transactionsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetTransactionsInfinite({
    type: activeFilter,
    per_page: 20,
  });

  const transactions = useMemo(() => {
    if (!transactionsData?.pages) return [];
    return transactionsData.pages.flatMap((page) => page.transactions);
  }, [transactionsData?.pages]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleFilterChange = useCallback((filter: TransactionDirection) => {
    setActiveFilter(filter);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderTransaction = useCallback(
    ({ item, index }: { item: WalletTransaction; index: number }) => (
      <View>
        <TransactionItem transaction={item} />
        {index < transactions.length - 1 && <View style={styles.transactionDivider} />}
      </View>
    ),
    [transactions.length, styles.transactionDivider]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }, [isFetchingNextPage, styles.loadingMore, theme.colors.primary.DEFAULT]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrapper}>
            <AppIcon.Transactions width={36} height={36} color={theme.colors.text.tertiary} />
          </View>
          <Text style={styles.emptyTitle}>No transactions found</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === 'ALL'
              ? 'Your transaction history will appear here once you start using credits.'
              : `No ${activeFilter === 'ADDED' ? 'credit additions' : 'credit usage'} found.`}
          </Text>
        </View>
      </View>
    );
  }, [isLoading, activeFilter, styles, theme.colors.text.tertiary]);

  const keyExtractor = useCallback(
    (item: WalletTransaction) => item.id.toString(),
    []
  );

  if (isLoading && !transactionsData) {
    return (
      <ScreenWrapper safeAreaEdges={['top']} backgroundColor={theme.colors.background.secondary}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper safeAreaEdges={['top']} backgroundColor={theme.colors.background.secondary}>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconWrapper}>
              <AppIcon.Warning width={32} height={32} color="#DC2626" />
            </View>
            <Text style={styles.errorText}>
              Failed to load transactions. Please try again.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaEdges={['top']} backgroundColor={theme.colors.background.secondary}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Premium Gradient Balance Card */}
          <View style={styles.balanceCardWrapper}>
            <View style={styles.balanceCard}>
              {/* Gradient Background using Skia */}
              <Canvas style={styles.balanceCardGradient}>
                <RoundedRect
                  x={0}
                  y={0}
                  width={SCREEN_WIDTH - 32}
                  height={BALANCE_CARD_HEIGHT}
                  r={16}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(SCREEN_WIDTH - 32, BALANCE_CARD_HEIGHT)}
                    colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
                  />
                </RoundedRect>
              </Canvas>

              {/* Card Content */}
              <View style={styles.balanceCardContent}>
                <View style={styles.balanceIconWrapper}>
                  <AppIcon.Wallet width={22} height={22} color="#FFFFFF" />
                </View>
                <View style={styles.balanceContent}>
                  <Text style={styles.balanceLabel}>Current Balance</Text>
                  <Text style={styles.balanceValue}>
                    {wallet?.balance?.toLocaleString('en-IN') ?? '0'}
                  </Text>
                </View>
                <View style={styles.creditsUnitContainer}>
                  <Text style={styles.creditsUnit}>Credits</Text>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{wallet?.status || 'ACTIVE'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterTab,
                  activeFilter === option.value && styles.filterTabActive,
                ]}
                onPress={() => handleFilterChange(option.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === option.value && styles.filterTabTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions List */}
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={keyExtractor}
          style={styles.listContainer}
          contentContainerStyle={[
            styles.listContent,
            transactions.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary.DEFAULT}
            />
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default TransactionHistoryScreen;
