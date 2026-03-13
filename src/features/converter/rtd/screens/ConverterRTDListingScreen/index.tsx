import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { EmptyState } from '@shared/components/EmptyState';
import { AppIcon } from '@assets/svgs';
import { useGetConverterRtdProducts } from '@services/api';
import type { RtdProduct } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { createStyles } from './styles';

export const ConverterRTDListingScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const { data: products = [], isLoading, refetch, isRefetching } = useGetConverterRtdProducts();

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === 'active').length;
    const paused = products.filter((p) => p.status === 'paused').length;
    const pending = products.filter(
      (p) => p.status === 'pending' || (p.status !== 'active' && p.status !== 'paused')
    ).length;
    return {
      active,
      activeChange: '+2 today',
      paused,
      pausedChange: 'No change',
      pending,
      pendingLabel: 'Urgent',
    };
  }, [products]);

  const recentProducts = useMemo(() => products.slice(0, 5), [products]);

  const handleAddReadyProduct = () => {
    navigation.navigate(SCREENS.CONVERTER_RTD.ADD_PRODUCT);
  };

  const handleViewOrders = () => {
    navigation.navigate(SCREENS.CONVERTER_RTD.ORDER_HISTORY);
  };

  const handleSeeAll = () => {
    navigation.navigate(SCREENS.CONVERTER_RTD.MY_PRODUCTS);
  };

  const getStatusStyle = (status: string) => {
    if (status === 'active') return { badge: styles.statusBadgeLive, text: styles.statusBadgeTextLive };
    if (status === 'paused') return { badge: styles.statusBadgePaused, text: styles.statusBadgeTextPaused };
    return { badge: styles.statusBadgePending, text: styles.statusBadgeTextPending };
  };

  const formatStatus = (status: string) => {
    if (status === 'active') return 'Live';
    if (status === 'paused') return 'Paused';
    return 'Pending';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsScrollContent}
        >
          <View style={styles.statCard}>
            <Text fontWeight={'bold'} style={styles.statLabel}>Active</Text>
            <Text style={[styles.statValue, { color: theme.colors.primary.DEFAULT }]}>{stats.active}</Text>
            <View style={styles.statSub}>
              <AppIcon.TickCheckedBox width={12} height={12} color={theme.colors.success.DEFAULT} />
              <Text fontWeight={'semibold'} style={[styles.statSubText, styles.statSubTextSuccess]}>{stats.activeChange}</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text fontWeight={'bold'} style={styles.statLabel}>Paused</Text>
            <Text style={styles.statValue}>{stats.paused}</Text>
            <View style={styles.statSub}>
              <AppIcon.Pause width={12} height={12} color={theme.colors.text.tertiary} />
              <Text fontWeight={'semibold'} style={[styles.statSubText, styles.statSubTextMuted]}>{stats.pausedChange}</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text fontWeight={'bold'} style={styles.statLabel}>Pending</Text>
            <Text style={[styles.statValue, { color: theme.colors.warning.DEFAULT }]}>{stats.pending}</Text>
            <View style={styles.statSub}>
              <AppIcon.Warning width={12} height={12} color={theme.colors.warning.DEFAULT} />
              <Text fontWeight={'semibold'} style={[styles.statSubText, styles.statSubTextWarning]}>{stats.pendingLabel}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={{ flexDirection: 'column', gap: theme.spacing[3], marginTop: theme.spacing[6] }}>
          <CustomButton
            title="Add Ready Product"
            onPress={handleAddReadyProduct}
            variant="gradient"
            size="md"
            leftIcon={<AppIcon.PlusCircle width={20} height={20} color={theme.colors.text.inverse} />}
            style={{ flex: 1 }}
          />
          <CustomButton
            title="View Orders"
            onPress={handleViewOrders}
            leftIcon={<AppIcon.Order width={20} height={20} color={theme.colors.text.inverse} />}
            variant="gradient"
            size="md"
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text fontWeight={'bold'} style={styles.sectionTitle}>Recent Listings</Text>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text fontWeight={'semibold'} style={styles.seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentProducts.length === 0 ? (
          <EmptyState
            icon={<AppIcon.Market width={32} height={32} color={theme.colors.primary.DEFAULT} />}
            title="No Ready to Dispatch products yet"
            description="Tap Add Ready to Dispatch Product to list one."
            action={{ label: 'Add Ready to Dispatch Product', onPress: handleAddReadyProduct }}
          />
        ) : (
          recentProducts.map((product: RtdProduct) => {
            const statusStyle = getStatusStyle(product.status);
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                activeOpacity={0.8}
              >
                {product.image_path ? (
                  <Image
                    source={{ uri: product.image_path }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.productImagePlaceholder}>
                    <AppIcon.Market width={32} height={32} color={theme.colors.text.tertiary} />
                  </View>
                )}
                <View style={styles.productBody}>
                  <View style={styles.productRow}>
                    <Text fontWeight={'semibold'} style={styles.productName} numberOfLines={1}>
                      {product.display_name ?? product.product_name ?? product.category}
                    </Text>
                    <View style={[styles.statusBadge, statusStyle.badge]}>
                      <Text style={[styles.statusBadgeText, statusStyle.text]}>
                        {formatStatus(product.status)}
                      </Text>
                    </View>
                  </View>
                  <View style={[ {flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1],marginBottom: theme.spacing[1] }]}>
                    <AppIcon.Location width={10} height={10} color={theme.colors.primary.DEFAULT} />
                    <Text variant='bodySmall' size={10} fontWeight='regular' >
                      {product.delivery_geography}
                    </Text>
                  </View>
                  <Text style={styles.productMoq}>MOQ: {product.moq} units</Text>
                  <View style={styles.productPriceRow}>
                    <Text style={styles.productPrice}>₹{product.base_price}</Text>
                    <Text style={styles.productPriceUnit}>/ unit</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};
