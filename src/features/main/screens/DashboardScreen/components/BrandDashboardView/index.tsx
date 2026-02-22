import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { useGetBrandRtdOrders } from '@services/api/brandRtdApi';
import type { Theme } from '@theme/types';
import type { RecentInquiry, RtdOrderStatus } from '@services/api';
import type { BrandDashboardViewProps } from './@types';
import { createStyles } from './styles';

const ACTIVE_ORDER_STATUSES: RtdOrderStatus[] = [
  'REQUESTED', 'ACCEPTED', 'PAID', 'IN_PRODUCTION', 'DISPATCHED',
];
const ORDER_STATUS_COLORS: Record<string, string> = {
  REQUESTED: '#3b82f6',
  ACCEPTED: '#3b82f6',
  PAID: '#10b981',
  IN_PRODUCTION: '#f59e0b',
  DISPATCHED: '#3b82f6',
};

const defaultData = {
  activeInquiries: 0,
  newProposals: 0,
  unreadMessages: 0,
  recentInquiries: [] as RecentInquiry[],
};

function getStatusBadge(
  status: RecentInquiry['status'],
  theme: Theme,
): { label: string; color: string; borderColor: string; bg: string } {
  switch (status) {
    case 'MATCHING':
      return {
        label: 'MATCHING',
        color: theme.colors.success.DEFAULT,
        borderColor: theme.colors.success.DEFAULT,
        bg: theme.colors.success[50] ?? theme.colors.success.light,
      };
    case 'OPEN':
      return {
        label: 'OPEN',
        color: theme.colors.text.secondary,
        borderColor: theme.colors.border.secondary,
        bg: theme.colors.surface.tertiary,
      };
    case 'NEW':
      return {
        label: 'PROPOSALS',
        color: theme.colors.primary.DEFAULT,
        borderColor: theme.colors.primary[200],
        bg: theme.colors.primary[50],
      };
    case 'CLOSED':
      return {
        label: 'CLOSED',
        color: theme.colors.text.tertiary,
        borderColor: theme.colors.border.primary,
        bg: theme.colors.surface.tertiary,
      };
    default:
      return {
        label: status,
        color: theme.colors.text.secondary,
        borderColor: theme.colors.border.primary,
        bg: theme.colors.surface.tertiary,
      };
  }
}

export const BrandDashboardView: React.FC<BrandDashboardViewProps> = ({
  profileData,
  dashboardData: apiData,
  onRefresh,
  refreshing = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'orders'>('inquiries');

  const dashboardData = {
    activeInquiries: apiData?.activeInquiries ?? defaultData.activeInquiries,
    newProposals: apiData?.newProposals ?? defaultData.newProposals,
    unreadMessages: apiData?.unreadMessages ?? defaultData.unreadMessages,
    recentInquiries: apiData?.recentInquiries ?? defaultData.recentInquiries,
  };

  const [postCardLayout, setPostCardLayout] = useState({ width: 320, height: 200 });
  const [rtdCardLayout, setRtdCardLayout] = useState({ width: 320, height: 200 });

  const onPostCardLayout = useCallback((e: any) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) setPostCardLayout({ width, height });
  }, []);
  const onRtdCardLayout = useCallback((e: any) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) setRtdCardLayout({ width, height });
  }, []);

  const postGradient = useMemo(
    () =>
      [
        theme.colors.primary.dark ?? theme.colors.primary[900],
        theme.colors.primary.DEFAULT,
        theme.colors.info?.DEFAULT ?? theme.colors.primary[500],
      ].filter(Boolean) as string[],
    [theme.colors.primary, theme.colors.info],
  );

  const rtdGradient = useMemo(
    () =>
      [
        theme.colors.success.DEFAULT,
        theme.colors.primary[400] ?? theme.colors.primary.DEFAULT,
        theme.colors.primary.DEFAULT,
      ].filter(Boolean) as string[],
    [theme.colors.success, theme.colors.primary],
  );

  const { data: rtdOrders } = useGetBrandRtdOrders();

  const activeRtdOrders = useMemo(
    () => (rtdOrders ?? []).filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)).slice(0, 3),
    [rtdOrders],
  );
  const activeOrderCount = useMemo(
    () => (rtdOrders ?? []).filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)).length,
    [rtdOrders],
  );

  const handlePostRequirement = () => {
    navigation.navigate(SCREENS.MAIN.POST_BRAND_REQUIREMENT);
  };

  const handleExploreRTD = () => {
    navigation.navigate(SCREENS.BRAND_RTD.MARKETPLACE);
  };

  const handleViewAllOrders = () => {
    navigation.navigate(SCREENS.BRAND_RTD.MY_ORDERS);
  };

  const handleOrderPress = (orderId: number) => {
    navigation.navigate(SCREENS.BRAND_RTD.ORDER_DETAIL, { orderId });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary.DEFAULT}
            colors={[theme.colors.primary.DEFAULT]}
          />
        ) : undefined
      }
    >
      {/* ── Notification Banner ── */}
      {dashboardData.newProposals > 0 && (
        <TouchableOpacity style={styles.notificationBanner} activeOpacity={0.8}>
          <View style={styles.notificationContent}>
            <Text fontWeight="bold" style={styles.notificationTitle}>
              You have {dashboardData.newProposals} new supplier proposal
              {dashboardData.newProposals > 1 ? 's' : ''}
            </Text>
            <Text style={styles.notificationSubtitle}>
              Review and compare matches now
            </Text>
          </View>
          <AppIcon.ChevronRight
            width={20}
            height={20}
            color={theme.colors.primary.DEFAULT}
          />
        </TouchableOpacity>
      )}

      {/* ── Post New Requirement Card ── */}
      <TouchableOpacity
        style={styles.actionCard}
        onPress={handlePostRequirement}
        onLayout={onPostCardLayout}
        activeOpacity={0.92}
      >
        <Canvas
          style={[
            styles.actionCardGradientCanvas,
            { width: postCardLayout.width, height: postCardLayout.height },
          ]}
        >
          <RoundedRect
            x={0}
            y={0}
            width={postCardLayout.width}
            height={postCardLayout.height}
            r={theme.borderRadius.card.lg ?? 16}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(postCardLayout.width, postCardLayout.height * 0.4)}
              colors={
                postGradient.length >= 2
                  ? postGradient
                  : [theme.colors.primary.DEFAULT, theme.colors.primary.dark ?? theme.colors.primary.DEFAULT]
              }
            />
          </RoundedRect>
        </Canvas>
        <View style={styles.actionCardContent}>
          <View style={styles.actionCardBadge}>
            <Text style={styles.actionCardBadgeText}>IDENTITY HIDDEN</Text>
          </View>
          <Text fontWeight="extrabold" style={styles.actionCardTitle}>
            Post New Requirement
          </Text>
          <Text style={styles.actionCardSubtitle}>
            Get custom quotes from top verified global suppliers.
          </Text>
          <View style={styles.actionCardIconWrap}>
            <AppIcon.PlusCircle width={22} height={22} color={theme.colors.text.inverse} />
          </View>
          <TouchableOpacity
            style={styles.actionCardButton}
            onPress={handlePostRequirement}
            activeOpacity={0.85}
          >
            <Text fontWeight="bold" style={styles.actionCardButtonText}>
              Create Request
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* ── Browse Ready to Dispatch Card ── */}
      <TouchableOpacity
        style={styles.actionCard}
        onPress={handleExploreRTD}
        onLayout={onRtdCardLayout}
        activeOpacity={0.92}
      >
        <Canvas
          style={[
            styles.actionCardGradientCanvas,
            { width: rtdCardLayout.width, height: rtdCardLayout.height },
          ]}
        >
          <RoundedRect
            x={0}
            y={0}
            width={rtdCardLayout.width}
            height={rtdCardLayout.height}
            r={theme.borderRadius.card.lg ?? 16}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(rtdCardLayout.width, rtdCardLayout.height * 0.4)}
              colors={
                rtdGradient.length >= 2
                  ? rtdGradient
                  : [theme.colors.success.DEFAULT, theme.colors.primary.DEFAULT]
              }
            />
          </RoundedRect>
        </Canvas>
        <View style={styles.actionCardContent}>
          <View style={styles.actionCardBadge}>
            <Text style={styles.actionCardBadgeText}>IN STOCK</Text>
          </View>
          <Text fontWeight="extrabold" style={styles.actionCardTitle}>
            Browse Ready to Dispatch
          </Text>
          <Text style={styles.actionCardSubtitle}>
            Immediate fulfillment from premium ready stock.
          </Text>
          <View style={styles.actionCardIconWrap}>
            <AppIcon.Market width={22} height={22} color={theme.colors.text.inverse} />
          </View>
          <TouchableOpacity
            style={styles.actionCardButton}
            onPress={handleExploreRTD}
            activeOpacity={0.85}
          >
            <Text fontWeight="bold" style={[styles.actionCardButtonText, styles.actionCardButtonTextSuccess]}>
              Explore RTD
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* ── Stats Row ── */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ACTIVE</Text>
            <Text fontWeight="extrabold" style={styles.statValue}>
              {dashboardData.activeInquiries}
            </Text>
            <Text style={styles.statCategory}>Inquiries</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statDot} />
            <Text style={styles.statLabel}>NEW</Text>
            <Text fontWeight="extrabold" style={[styles.statValue, styles.statValueHighlight]}>
              {dashboardData.newProposals}
            </Text>
            <Text style={styles.statCategory}>Proposals</Text>
          </View>
          <TouchableOpacity style={styles.statCard} onPress={handleViewAllOrders} activeOpacity={0.7}>
            <Text style={styles.statLabel}>ACTIVE</Text>
            <Text fontWeight="extrabold" style={styles.statValue}>
              {activeOrderCount}
            </Text>
            <Text style={styles.statCategory}>Orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── My RTD Orders ── */}
      {activeRtdOrders.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text fontWeight="extrabold" style={styles.recentTitle}>
              My RTD Orders
            </Text>
            <TouchableOpacity onPress={handleViewAllOrders}>
              <Text fontWeight="bold" style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          {activeRtdOrders.map((order) => {
            const color = ORDER_STATUS_COLORS[order.status] ?? '#94a3b8';
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.activityItem}
                activeOpacity={0.7}
                onPress={() => handleOrderPress(order.id)}
              >
                <View style={styles.activityIconWrap}>
                  <AppIcon.Market
                    width={20}
                    height={20}
                    color={theme.colors.text.secondary}
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text fontWeight="bold" style={styles.activityTitle}>
                    {order.product?.product_name ?? 'RTD Order'}
                  </Text>
                  <Text style={styles.activityTime}>
                    Qty: {order.quantity} · ₹{order.total_amount}
                  </Text>
                </View>
                <View
                  style={[
                    styles.activityBadge,
                    { borderColor: color, backgroundColor: `${color}15` },
                  ]}
                >
                  <Text style={[styles.activityBadgeText, { color }]}>
                    {order.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ── Recent Activity ── */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text fontWeight="extrabold" style={styles.recentTitle}>
            Recent Activity
          </Text>
          <TouchableOpacity>
            <Text fontWeight="bold" style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'inquiries' && styles.tabActive]}
            onPress={() => setActiveTab('inquiries')}
          >
            <Text
              fontWeight="semibold"
              style={[styles.tabText, activeTab === 'inquiries' && styles.tabTextActive]}
            >
              Inquiries
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
            onPress={() => setActiveTab('orders')}
          >
            <Text
              fontWeight="semibold"
              style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}
            >
              Orders
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'inquiries' ? (
          dashboardData.recentInquiries.length === 0 ? (
            <View style={styles.emptyActivityCard}>
              <View style={styles.emptyActivityIconWrap}>
                <AppIcon.Inquiries
                  width={32}
                  height={32}
                  color={theme.colors.primary.DEFAULT}
                />
              </View>
              <Text fontWeight="bold" style={styles.emptyActivityTitle}>
                No recent inquiries
              </Text>
              <Text style={styles.emptyActivityDesc}>
                You don't have any inquiries at the moment. Post a new requirement to get started.
              </Text>
              {/* <View style={styles.emptyActivityButtonContainer}> */}
                <CustomButton
                  title="Post New Requirement"
                  onPress={handlePostRequirement}
                  variant="gradient"
                  size="sm"
                  style={{ }}
                  textStyle={{ fontWeight: '600' }}
                />
              {/* </View> */}
            </View>
          ) : (
            dashboardData.recentInquiries.map((inquiry) => {
              const badge = getStatusBadge(inquiry.status, theme);
              return (
                <TouchableOpacity
                  key={inquiry.id}
                  style={styles.activityItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.activityIconWrap}>
                    <AppIcon.Inquiries
                      width={20}
                      height={20}
                      color={theme.colors.text.secondary}
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text fontWeight="bold" style={styles.activityTitle}>
                      {inquiry.title}
                    </Text>
                    <Text style={styles.activityTime}>Updated {inquiry.time}</Text>
                  </View>
                  <View
                    style={[
                      styles.activityBadge,
                      { borderColor: badge.borderColor, backgroundColor: badge.bg },
                    ]}
                  >
                    <Text style={[styles.activityBadgeText, { color: badge.color }]}>
                      {badge.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )
        ) : activeRtdOrders.length === 0 ? (
          <View style={styles.emptyActivityCard}>
            <View style={styles.emptyActivityIconWrap}>
              <AppIcon.Market
                width={32}
                height={32}
                color={theme.colors.primary.DEFAULT}
              />
            </View>
            <Text fontWeight="bold" style={styles.emptyActivityTitle}>
              No active orders
            </Text>
            <Text style={styles.emptyActivityDesc}>
              You don't have any RTD orders at the moment. Browse ready-to-dispatch products to place an order.
            </Text>
            {/* <View style={styles.emptyActivityButtonContainer}> */}
              <CustomButton
                title="Browse RTD"
                onPress={handleExploreRTD}
                variant="gradient"
                size="sm"
                textStyle={{ fontWeight: '600' }}
              />
            {/* </View> */}
          </View>
        ) : (
          activeRtdOrders.map((order) => {
            const color = ORDER_STATUS_COLORS[order.status] ?? '#94a3b8';
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.activityItem}
                activeOpacity={0.7}
                onPress={() => handleOrderPress(order.id)}
              >
                <View style={styles.activityIconWrap}>
                  <AppIcon.Market
                    width={20}
                    height={20}
                    color={theme.colors.text.secondary}
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text fontWeight="bold" style={styles.activityTitle}>
                    {order.product?.product_name ?? 'RTD Order'}
                  </Text>
                  <Text style={styles.activityTime}>
                    Qty: {order.quantity} · ₹{order.total_amount}
                  </Text>
                </View>
                <View
                  style={[
                    styles.activityBadge,
                    { borderColor: color, backgroundColor: `${color}15` },
                  ]}
                >
                  <Text style={[styles.activityBadgeText, { color }]}>
                    {order.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};
