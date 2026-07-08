import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { AppIcon } from '@assets/svgs';
import { useGetInvoicesInfinite } from '@services/api';
import type { InvoiceListItem } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { ListItemSkeleton } from '@shared/components/skeletons';
import { createStyles } from './styles';

const formatPaidDate = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const InvoiceListScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInvoicesInfinite();

  const invoices = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );
  const showSkeleton = useSkeleton(isLoading && !data);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const openInvoice = useCallback(
    (invoice: InvoiceListItem) => {
      navigation.navigate(SCREENS.INVOICES.DETAIL, {
        invoiceKey: invoice.key,
        invoiceNo: invoice.invoice_no,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: InvoiceListItem }) => {
      const Icon = item.kind === 'rtd_platform_fee' ? AppIcon.Order : AppIcon.Wallet;
      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => openInvoice(item)}
        >
          <View style={styles.iconCircle}>
            <Icon width={20} height={20} color={theme.colors.primary.DEFAULT} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.cardInvoiceNo}>{item.invoice_no}</Text>
            <Text style={styles.cardDate}>{formatPaidDate(item.paid_at)}</Text>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.cardAmount}>
              ₹{item.total_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
            <View style={styles.paidChip}>
              <Text style={styles.paidChipText}>PAID</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [styles, theme, openInvoice],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <AppIcon.Transactions width={48} height={48} color={theme.colors.text.disabled} />
        <Text style={styles.emptyTitle}>No invoices yet</Text>
        <Text style={styles.emptySubtitle}>
          Invoices for your credit purchases and platform fee payments will appear here.
        </Text>
      </View>
    ),
    [styles, theme],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <ActivityIndicator
        size="small"
        color={theme.colors.primary.DEFAULT}
        style={styles.footerLoader}
      />
    );
  }, [isFetchingNextPage, theme, styles]);

  if (showSkeleton) {
    return (
      <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
        <View style={styles.skeletonContainer}>
          <ListItemSkeleton count={7} />
        </View>
      </ScreenWrapper>
    );
  }

  if (isError && invoices.length === 0) {
    return (
      <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
        <View style={styles.errorContainer}>
          <AppIcon.Warning width={48} height={48} color={theme.colors.text.disabled} />
          <Text style={styles.emptyTitle}>Couldn't load invoices</Text>
          <Text style={styles.emptySubtitle}>
            Please check your connection and try again.
          </Text>
          <CustomButton
            title="Retry"
            onPress={() => refetch()}
            variant="primary"
            size="md"
            style={styles.retryButton}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
      <FlatList
        data={invoices}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary.DEFAULT}
            colors={[theme.colors.primary.DEFAULT]}
          />
        }
      />
    </ScreenWrapper>
  );
};

export default InvoiceListScreen;
