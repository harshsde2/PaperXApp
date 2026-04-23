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
import { EmptyState } from '@shared/components/EmptyState';
import { AppIcon } from '@assets/svgs';
import { useGetConverterRtdProducts } from '@services/api';
import type { RtdProduct } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { Skeleton } from '@shared/components/Skeleton';
import { createStyles } from './styles';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import DashboardCardWrapper from '@shared/components/DashboardCardWrapper';
import GlassyWrapper from '@shared/components/GlassyWrapper';

export const ConverterRTDListingScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const { data: products = [], isLoading, refetch, isRefetching } = useGetConverterRtdProducts();
  const showSkeleton = useSkeleton(isLoading);

  const gradientColors = useMemo(
    () => [
      theme.colors.white,
      theme.colors.white,
      theme.colors.primary[50],
      theme.colors.primary[50],
      theme.colors.primary[200],
      theme.colors.primary[200],
      theme.colors.primary[300],
      theme.colors.primary[300],
      theme.colors.primary[300],
      theme.colors.primary[400],
      theme.colors.primary[400],
      theme.colors.primary[300],
      theme.colors.primary[300],
      theme.colors.primary[200],
      theme.colors.primary[100],
      theme.colors.white,
      theme.colors.white,
      theme.colors.white,
      theme.colors.white,
      theme.colors.white,
   
    ],
    [theme.colors]
  );

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
  const actionCardPrimaryGradient = useMemo(
    () => [
      theme.colors.primary.dark ?? theme.colors.primary[900],
      theme.colors.primary.DEFAULT,
      theme.colors.primary.light ?? theme.colors.primary[400],
    ].filter(Boolean) as string[],
    [theme.colors.primary],
  );
  const actionCardSecondaryGradient = useMemo(
    () => [
      theme.colors.primary[800] ?? theme.colors.primary.DEFAULT,
      theme.colors.primary[600] ?? theme.colors.primary.DEFAULT,
      theme.colors.primary[400] ?? theme.colors.primary.light ?? theme.colors.primary.DEFAULT,
    ].filter(Boolean) as string[],
    [theme.colors.primary],
  );

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
    <ScreenWrapper
      safeArea={true}
      gradient="linear"
      safeAreaEdges={[]}
      gradientColors={gradientColors}
      gradientStart={{ x: 1, y: 0 }}
      gradientEnd={{ x: 0, y: 1 }}
      statusBarStyle="dark-content"
    >

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
          {showSkeleton ? (
            <View style={{ flex: 1,paddingHorizontal: theme.spacing[4] }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.statsScroll}
                contentContainerStyle={styles.statsScrollContent}
              >
                <Skeleton height={92} width={140} borderRadius={theme.borderRadius.card.lg} />
                <Skeleton height={92} width={140} borderRadius={theme.borderRadius.card.lg} />
                <Skeleton height={92} width={140} borderRadius={theme.borderRadius.card.lg} />
              </ScrollView>

              <View style={{ flexDirection: 'column', gap: theme.spacing[3], marginTop: theme.spacing[6] }}>
                <Skeleton height={48} width="100%" borderRadius={theme.borderRadius.button.lg} />
                <Skeleton height={48} width="100%" borderRadius={theme.borderRadius.button.lg} />
              </View>

              <View style={styles.sectionHeader}>
                <Skeleton height={20} width={130} />
                <Skeleton height={16} width={48} />
              </View>

              {Array.from({ length: 4 }).map((_, index) => (
                <View
                  key={`listing-skeleton-${index}`}
                  style={[
                    styles.productCard,
                    { alignItems: 'center', gap: theme.spacing[3] },
                  ]}
                >
                  <Skeleton
                    width={72}
                    height={72}
                    borderRadius={theme.borderRadius.input.md}
                  />
                  <View style={{ flex: 1, gap: theme.spacing[2] }}>
                    <Skeleton width="70%" height={14} />
                    <Skeleton width="55%" height={12} />
                    <Skeleton width="35%" height={12} />
                    <Skeleton width="40%" height={14} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1,paddingHorizontal: theme.spacing[4] }}>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.statsScroll}
                contentContainerStyle={styles.statsScrollContent}
              >
                <GlassyWrapper
                  borderRadius={theme.borderRadius.card.lg}
                  blurAmount={22}
                  blurType="light"
                  overlayOpacity={0.1}
                  padding={theme.spacing[4]}
                  borderWidth={1}
                  showGlossyHighlight={false}
                  style={styles.statCard}
                  contentContainerStyle={styles.statCardInner}
                >
                  <Text fontWeight={'bold'} style={styles.statLabel}>Active</Text>
                  <Text style={[styles.statValue, { color: theme.colors.primary.DEFAULT }]}>{stats.active}</Text>
                  <View style={styles.statSub}>
                    <AppIcon.TickCheckedBox width={12} height={12} color={theme.colors.success.DEFAULT} />
                    <Text fontWeight={'semibold'} style={[styles.statSubText, styles.statSubTextSuccess]}>{stats.activeChange}</Text>
                  </View>
                </GlassyWrapper>
                <GlassyWrapper
                  borderRadius={theme.borderRadius.card.lg}
                  blurAmount={22}
                  blurType="light"
                  overlayOpacity={0.1}
                  padding={theme.spacing[4]}
                  borderWidth={1}
                  showGlossyHighlight={false}
                  style={styles.statCard}
                  contentContainerStyle={styles.statCardInner}
                >
                  <Text fontWeight={'bold'} style={styles.statLabel}>Paused</Text>
                  <Text style={styles.statValue}>{stats.paused}</Text>
                  <View style={styles.statSub}>
                    <AppIcon.Pause width={12} height={12} color={theme.colors.text.tertiary} />
                    <Text fontWeight={'semibold'} style={[styles.statSubText, styles.statSubTextMuted]}>{stats.pausedChange}</Text>
                  </View>
                </GlassyWrapper>
                <GlassyWrapper
                  borderRadius={theme.borderRadius.card.lg}
                  blurAmount={22}
                  blurType="light"
                  overlayOpacity={0.1}
                  padding={theme.spacing[4]}
                  borderWidth={1}
                  showGlossyHighlight={false}
                  style={styles.statCard}
                  contentContainerStyle={styles.statCardInner}
                >
                  <Text fontWeight={'bold'} style={styles.statLabel}>Pending</Text>
                  <Text style={[styles.statValue, { color: theme.colors.warning.DEFAULT }]}>{stats.pending}</Text>
                  <View style={styles.statSub}>
                    <AppIcon.Warning width={12} height={12} color={theme.colors.warning.DEFAULT} />
                    <Text fontWeight={'semibold'} style={[styles.statSubText, styles.statSubTextWarning]}>{stats.pendingLabel}</Text>
                  </View>
                </GlassyWrapper>
              </ScrollView>

              <View style={styles.actionCardsRow}>
                <TouchableOpacity
                  style={styles.actionCardTouchable}
                  onPress={handleAddReadyProduct}
                  activeOpacity={0.85}
                >
                  <GlassyWrapper
                    borderRadius={theme.borderRadius.card.lg}
                    blurAmount={24}
                    blurType="light"
                    overlayOpacity={0.08}
                    padding={theme.spacing[5]}
                    style={styles.actionCard}
                    contentContainerStyle={styles.actionCardInner}
                    gradientColors={actionCardPrimaryGradient}
                    gradientStart={{ x: 0, y: 0 }}
                    gradientEnd={{ x: 1, y: 1 }}
                  >
                    <View style={styles.actionCardIcon}>
                      <AppIcon.PlusCircle width={32} height={32} color={theme.colors.text.inverse} />
                    </View>
                    <Text fontWeight={'bold'} style={styles.actionCardTitle}>
                      Add Product
                    </Text>
                  </GlassyWrapper>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionCardTouchable}
                  onPress={handleViewOrders}
                  activeOpacity={0.85}
                >
                  <GlassyWrapper
                    borderRadius={theme.borderRadius.card.lg}
                    blurAmount={24}
                    blurType="light"
                    overlayOpacity={0.08}
                    padding={theme.spacing[5]}
                    style={styles.actionCard}
                    contentContainerStyle={styles.actionCardInner}
                    gradientColors={actionCardSecondaryGradient}
                    gradientStart={{ x: 0, y: 0 }}
                    gradientEnd={{ x: 1, y: 1 }}
                  >
                    <View style={styles.actionCardIcon}>
                      <AppIcon.Order width={32} height={32} color={theme.colors.text.inverse} />
                    </View>
                    <Text fontWeight={'bold'} style={styles.actionCardTitle}>
                      View Orders
                    </Text>
                  </GlassyWrapper>
                </TouchableOpacity>
              </View>
              </View>

              <DashboardCardWrapper style={{ marginTop: theme.spacing[6] }}>
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
                          <View style={[{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1], marginBottom: theme.spacing[1] }]}>
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
              </DashboardCardWrapper>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};
