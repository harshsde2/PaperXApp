import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { useGetWalletBalance } from '@services/api';
import type { ActiveSessionListItem } from '@services/api/sessionApi/@types';
import { SCREENS } from '@navigation/constants';
import type { ConverterDashboardViewProps, RTDSnapshotData, TransformedSession } from './@types';
import { useTabBarContentBottomInset } from '@shared/hooks/useTabBarContentBottomInset';
import { useDashboardHeaderHeight } from '../../DashboardHeaderHeightContext';
import { ResponsesCard } from '../ResponsesCard';
import { createStyles } from './styles';
import DashboardCardWrapper from '@shared/components/DashboardCardWrapper';
import GlassyWrapper from '@shared/components/GlassyWrapper';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { Skeleton } from '@shared/components/Skeleton';

const defaultDashboardData = {
  inquiriesCount: 0,
  newInquiries: 0,
  avgResponseSpeed: '-',
  avgResponseChange: '-',
  winRate: 0,
  newInquiriesList: [],
  activeSessions: [] as ActiveSessionListItem[],
  productionCapacity: { current: 0, max: 100, unit: '%' },
};

const defaultRTDSnapshot: RTDSnapshotData = {
  activeListings: 0,
  activeListingsChange: '',
  pendingOrders: 0,
  pendingOrdersLabel: 'None',
  totalOrders: 0,
  ordersLabel: 'All time',
  revenue: '₹0',
  revenueChange: '',
};

export const ConverterDashboardView: React.FC<ConverterDashboardViewProps> = ({
  profileData,
  dashboardData: apiData,
  onRefresh,
  refreshing = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const tabBarInset = useTabBarContentBottomInset();
  const headerInset = useDashboardHeaderHeight();
  const scrollContentContainerStyle = useMemo(
    () => [
      styles.contentContainer,
      { paddingTop: headerInset },
      tabBarInset > 0 ? { paddingBottom: theme.spacing[6] + tabBarInset } : null,
    ],
    [styles.contentContainer, headerInset, tabBarInset, theme.spacing],
  );
  const navigation = useNavigation<any>();
  const { data: wallet } = useGetWalletBalance();
  const showSkeleton = useSkeleton(!apiData && !refreshing);

  const activeSessionsData =
    (apiData as any)?.activeSessions ?? (apiData as any)?.active_sessions ?? [];
  const dashboardData = {
    ...defaultDashboardData,
    ...apiData,
    activeSessions: activeSessionsData as ActiveSessionListItem[],
  };

  const rtdSnapshot: RTDSnapshotData = useMemo(() => {
    const fromApi = (apiData as any)?.rtdSnapshot ?? (apiData as any)?.rtd_snapshot;
    if (fromApi && typeof fromApi === 'object') {
      return {
        ...defaultRTDSnapshot,
        activeListings: fromApi.active_listings ?? fromApi.activeListings ?? defaultRTDSnapshot.activeListings,
        activeListingsChange: fromApi.active_listings_change ?? fromApi.activeListingsChange ?? defaultRTDSnapshot.activeListingsChange,
        pendingOrders: fromApi.pending_orders ?? fromApi.pendingOrders ?? defaultRTDSnapshot.pendingOrders,
        pendingOrdersLabel: fromApi.pending_orders_label ?? fromApi.pendingOrdersLabel ?? defaultRTDSnapshot.pendingOrdersLabel,
        totalOrders: fromApi.total_orders ?? fromApi.totalOrders ?? defaultRTDSnapshot.totalOrders,
        ordersLabel: fromApi.orders_label ?? fromApi.ordersLabel ?? defaultRTDSnapshot.ordersLabel,
        revenue: fromApi.revenue ?? defaultRTDSnapshot.revenue,
        revenueChange: fromApi.revenue_change ?? fromApi.revenueChange ?? defaultRTDSnapshot.revenueChange,
      };
    }
    return {
      ...defaultRTDSnapshot,
      activeListings: dashboardData.activeSessions?.length ?? defaultRTDSnapshot.activeListings,
      pendingOrders: dashboardData.inquiriesCount ?? defaultRTDSnapshot.pendingOrders,
    };
  }, [apiData, dashboardData.activeSessions?.length, dashboardData.inquiriesCount]);

  const transformedSessions = useMemo((): TransformedSession[] => {
    if (!dashboardData.activeSessions?.length) return [];
    return dashboardData.activeSessions.slice(0, 3).map((session: ActiveSessionListItem) => {
      const firstItem = session.items?.[0];
      const totalQuantity =
        session.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      const safeResponsesReceived = Number(session.responses_received ?? 0);
      const safeMatchedDealers = Number(session.matched_dealers_count ?? 0);
      const safeMatchingProgressMatched = Number(session.matching_progress?.matched ?? 0);
      const hasExplicitResponses = session.responses_received !== null && session.responses_received !== undefined;
      const resolvedResponsesReceived = hasExplicitResponses
        ? Number.isFinite(safeResponsesReceived)
          ? safeResponsesReceived
          : 0
        : Math.max(
          Number.isFinite(safeMatchingProgressMatched) ? safeMatchingProgressMatched : 0,
          Number.isFinite(safeMatchedDealers) ? safeMatchedDealers : 0
        );
      let status: TransformedSession['status'] = 'ACTIVE';
      if (session.status === 'RESPONSES_RECEIVED' || session.status === 'CHAT_ACTIVE') {
        status = 'NEGOTIATION';
      } else if (session.status === 'MATCHING') status = 'WAITING';
      let timeRemaining = '';
      if (session.countdown) {
        const { days, hours, minutes } = session.countdown;
        if (days > 0) timeRemaining = `${days}d ${hours}h`;
        else if (hours > 0) timeRemaining = `${hours}h ${minutes}m`;
        else timeRemaining = `${minutes}m`;
      }
      const companyName = session.title.split('-')[0]?.trim() || 'Company';
      const companyAvatar = companyName.charAt(0).toUpperCase();
      const materialName = firstItem?.material_category || 'Material';
      const quantityUnit = firstItem?.quantity_unit || 'units';
      const description = `${materialName} • ${totalQuantity} ${quantityUnit}`;
      const totalExpectedResponses = 10;
      const responsesReceived = Math.max(
        0,
        Math.min(resolvedResponsesReceived, totalExpectedResponses)
      );
      const progressPercent = (responsesReceived / totalExpectedResponses) * 100;
      const actionRequired = session.status === 'RESPONSES_RECEIVED';
      return {
        id: String(session.id),
        status,
        timeRemaining,
        companyAvatar,
        company: companyName,
        description,
        actionRequired,
        responsesReceived,
        totalExpectedResponses,
        progressPercent,
      };
    });
  }, [dashboardData.activeSessions]);

  const creditsFormatted =
    wallet?.balance != null
      ? Number(wallet.balance).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      : '0.00';

  const handleAddCredits = () => {
    navigation.navigate(SCREENS.WALLET.CREDIT_PACKS);
  };

  const handlePostRequirement = () => {
    navigation.navigate(SCREENS.MAIN.POST);
  };

  const handleListRTDProduct = () => {
    navigation.navigate(SCREENS.CONVERTER_RTD.LISTING);
  };

  const handleViewAllSessions = () => {
    navigation.navigate(SCREENS.SESSIONS.DASHBOARD, { initialTab: 'all' });
  };

  const handleSessionPress = (sessionId: string) => {
    navigation.navigate(SCREENS.SESSIONS.DETAILS, { sessionId });
  };

  const handleRTDDetails = () => {
    navigation.navigate(SCREENS.CONVERTER_RTD.LISTING);
  };

  const handlePendingOrders = () => {
    navigation.navigate(SCREENS.CONVERTER_RTD.ORDER_HISTORY);
  };

  /** Dark, saturated stops (similar depth to the original Skia cards). */
  const quickActionGradientPrimary = useMemo(
    () =>
      [
        theme.colors.primary.dark ?? theme.colors.primary[900],
        theme.colors.primary[800] ?? theme.colors.primary.DEFAULT,
        theme.colors.primary[700],
      ].filter(Boolean) as string[],
    [theme.colors.primary],
  );

  const quickActionGradientSecondary = useMemo(
    () =>
      [
        theme.colors.primary[800] ?? theme.colors.primary.DEFAULT,
        theme.colors.primary[700],
        theme.colors.primary[600],
      ].filter(Boolean) as string[],
    [theme.colors.primary],
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={scrollContentContainerStyle}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary.DEFAULT}
            colors={[theme.colors.primary.DEFAULT]}
            progressViewOffset={headerInset}
          />
        ) : undefined
      }
    >
      {showSkeleton ? (
        <>
          <View style={styles.section}>
            <View style={styles.quickActionsRow}>
              <Skeleton height={140} width="48%" borderRadius={theme.borderRadius.card.lg} />
              <Skeleton height={140} width="48%" borderRadius={theme.borderRadius.card.lg} />
            </View>
          </View>

          <DashboardCardWrapper style={{ marginBottom: 0, marginTop: 20, paddingHorizontal: 0 }}>
            <View style={styles.section}>
              <View style={styles.rtdHeader}>
                <Skeleton height={20} width={170} />
                <Skeleton height={16} width={52} />
              </View>
              <View style={styles.rtdCardsRow}>
                <Skeleton height={110} width="31%" borderRadius={theme.borderRadius.card.lg} />
                <Skeleton height={110} width="31%" borderRadius={theme.borderRadius.card.lg} />
                <Skeleton height={110} width="31%" borderRadius={theme.borderRadius.card.lg} />
              </View>
            </View>

            <View style={styles.activeSessionsSection}>
              <Skeleton height={20} width={130} style={{ marginBottom: theme.spacing[3] }} />
              <Skeleton
                height={132}
                width="100%"
                borderRadius={theme.borderRadius.card.lg}
                style={{ marginBottom: theme.spacing[3] }}
              />
              <Skeleton
                height={132}
                width="100%"
                borderRadius={theme.borderRadius.card.lg}
                style={{ marginBottom: theme.spacing[3] }}
              />
              <View style={{ alignSelf: 'center', marginTop: theme.spacing[2] }}>
                <Skeleton height={34} width={140} borderRadius={theme.borderRadius.button.lg} />
              </View>
            </View>
          </DashboardCardWrapper>
        </>
      ) : (
        <>
      {/* Responses to your posts (2-tap path to chat) */}
      <ResponsesCard />

      {/* PaperX Credits */}
      {/* <View style={styles.creditsBar}>
        <View style={styles.creditsLeft}>
          <View style={styles.creditsIconWrap}>
            <AppIcon.Wallet width={24} height={24} color={theme.colors.primary.DEFAULT} />
          </View>
          <View>
            <Text style={styles.creditsLabel}>PAPERX CREDITS</Text>
            <Text style={styles.creditsValue}>{creditsFormatted}</Text>
          </View>
        </View>
        <CustomButton
          title="Add Credits"
          onPress={handleAddCredits}
          variant="gradient"
          size="sm"
          // style={styles.addCreditsButton}
          textStyle={styles.addCreditsButtonText}
        />
      </View> */}

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionTouchable}
            onPress={handlePostRequirement}
            activeOpacity={0.85}
          >
            <GlassyWrapper
              borderRadius={theme.borderRadius.card.lg}
              blurAmount={26}
              blurType="light"
              overlayOpacity={0.08}
              padding={theme.spacing[0]}
              style={styles.quickActionGlassy}
              contentContainerStyle={styles.quickActionGlassyInner}
              gradientColors={quickActionGradientPrimary}
              gradientStart={{ x: 0, y: 0 }}
              gradientEnd={{ x: 1, y: 1 }}
            >
              <View style={styles.quickActionContent}>
                <View style={styles.quickActionIcon}>
                  <AppIcon.Inquiries
                    width={36}
                    height={36}
                    color={theme.colors.text.inverse}
                  />
                </View>
                <Text fontWeight="bold" style={styles.quickActionLabel}>
                  Post Requirement
                </Text>
                <Text style={styles.quickActionSubtext}>
                  To Buy and sell for various requirements
                </Text>
              </View>
            </GlassyWrapper>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionTouchable}
            onPress={handleListRTDProduct}
            activeOpacity={0.85}
          >
            <GlassyWrapper
              borderRadius={theme.borderRadius.card.lg}
              blurAmount={26}
              blurType="light"
              overlayOpacity={0.08}
              padding={theme.spacing[0]}
              style={styles.quickActionGlassy}
              contentContainerStyle={styles.quickActionGlassyInner}
              gradientColors={quickActionGradientSecondary}
              gradientStart={{ x: 0, y: 0 }}
              gradientEnd={{ x: 1, y: 1 }}
            >
              <View style={styles.quickActionContent}>
                <View style={styles.quickActionIcon}>
                  <AppIcon.PlusCircle
                    width={36}
                    height={36}
                    color={theme.colors.text.inverse}
                  />
                </View>
                <Text fontWeight="bold" style={styles.quickActionLabel}>
                  Ready to Dispatch
                </Text>
                <Text style={styles.quickActionSubtext}>
                  Publish ready stock for faster deals
                </Text>
              </View>
            </GlassyWrapper>
          </TouchableOpacity>
        </View>
      </View>

      <DashboardCardWrapper style={{ marginBottom: 0, marginTop: 20, paddingHorizontal: 0 }} >
        {/* Ready to Dispatch Snapshot */}
        <View style={styles.section}>
          <View style={styles.rtdHeader}>
            <Text style={styles.sectionTitle}>Ready to Dispatch</Text>
            <TouchableOpacity onPress={handleRTDDetails}>
              <Text style={styles.detailsLink}>Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rtdCardsRow}>
            <TouchableOpacity
              style={styles.rtdCardTouchable}
              onPress={handleRTDDetails}
              activeOpacity={0.7}
            >
              <GlassyWrapper
                borderRadius={theme.borderRadius.card.lg}
                blurAmount={22}
                blurType="light"
                overlayOpacity={0.1}
                padding={theme.spacing[2]}
                borderWidth={1}
                showGlossyHighlight={false}
                style={styles.rtdGlassyCard}
                contentContainerStyle={styles.rtdGlassyCardInner}
              >
                <Text style={styles.rtdCardLabel}>Active</Text>
                <Text style={styles.rtdCardValue}>{rtdSnapshot.activeListings}</Text>
                <View style={styles.rtdCardSub}>
                  <AppIcon.TickCheckedBox width={14} height={14} color={theme.colors.success.DEFAULT} />
                  <Text style={styles.rtdCardSubText}>
                    {rtdSnapshot.activeListingsChange || (rtdSnapshot.activeListings > 0 ? 'Live' : 'No listings')}
                  </Text>
                </View>
              </GlassyWrapper>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rtdCardTouchable}
              onPress={handlePendingOrders}
              activeOpacity={0.7}
            >
              <GlassyWrapper
                borderRadius={theme.borderRadius.card.lg}
                blurAmount={22}
                blurType="light"
                overlayOpacity={0.1}
                padding={theme.spacing[2]}
                borderWidth={1}
                showGlossyHighlight={false}
                style={styles.rtdGlassyCard}
                contentContainerStyle={styles.rtdGlassyCardInner}
              >
                <Text style={styles.rtdCardLabel}>Pending</Text>
                <Text style={styles.rtdCardValue}>
                  {String(rtdSnapshot.pendingOrders).padStart(2, '0')}
                </Text>
                <View style={styles.rtdCardSub}>
                  <AppIcon.Warning width={14} height={14} color={theme.colors.warning.DEFAULT} />
                  <Text style={styles.rtdCardSubText}>{"Action"}</Text>
                </View>
              </GlassyWrapper>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rtdCardTouchable}
              onPress={handlePendingOrders}
              activeOpacity={0.7}
            >
              <GlassyWrapper
                borderRadius={theme.borderRadius.card.lg}
                blurAmount={22}
                blurType="light"
                overlayOpacity={0.1}
                padding={theme.spacing[2]}
                borderWidth={1}
                showGlossyHighlight={false}
                style={styles.rtdGlassyCard}
                contentContainerStyle={styles.rtdGlassyCardInner}
              >
                <Text style={styles.rtdCardLabel}>Orders</Text>
                <Text style={styles.rtdCardValue}>{String(rtdSnapshot.totalOrders).padStart(2, '0')}</Text>
                <View style={styles.rtdCardSub}>
                  <AppIcon.ArrowRight width={14} height={14} color={theme.colors.primary.DEFAULT} />
                  <Text style={styles.rtdCardSubText}>{rtdSnapshot.ordersLabel}</Text>
                </View>
              </GlassyWrapper>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Sessions */}
        <View style={styles.activeSessionsSection}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          {transformedSessions.length === 0 ? (
            <GlassyWrapper
              borderRadius={theme.borderRadius.card.lg}
              blurAmount={22}
              blurType="light"
              overlayOpacity={0.1}
              padding={theme.spacing[6]}
              borderWidth={2}
              borderStyle="dashed"
              borderColor={theme.colors.border.primary}
              showGlossyHighlight={false}
              style={styles.emptySessionsGlassy}
              contentContainerStyle={styles.emptySessionsGlassyInner}
            >
              <View style={styles.emptySessionsIconWrap}>
                <AppIcon.Sessions width={32} height={32} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text style={styles.emptySessionsTitle}>No active sessions</Text>
              <Text style={styles.emptySessionsDesc}>
                You don't have any ongoing conversion sessions at the moment.
              </Text>
              <View style={styles.viewAllSessionsButtonContainer}>
                <CustomButton
                  title="View All Sessions"
                  onPress={handleViewAllSessions}
                  variant="gradient"
                  size="sm"
                  style={{ marginTop: theme.spacing[2], alignSelf: 'flex-start' }}
                  textStyle={styles.viewAllSessionsButtonText}
                />
              </View>
            </GlassyWrapper>
          ) : (
            <>
              {transformedSessions.map((session) => (
                <TouchableOpacity
                  key={session.id}
                  style={styles.sessionCard}
                  onPress={() => handleSessionPress(session.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionStatusBadge}>
                      <View
                        style={[
                          styles.sessionStatusDot,
                          {
                            backgroundColor:
                              session.status === 'NEGOTIATION'
                                ? theme.colors.success.DEFAULT
                                : theme.colors.warning.DEFAULT,
                          },
                        ]}
                      />
                      <Text style={styles.sessionStatusText}>
                        {session.status.replace('_', ' ')}
                      </Text>
                    </View>
                    {session.timeRemaining ? (
                      <View style={styles.sessionTimeContainer}>
                        <AppIcon.Sessions width={14} height={14} color={theme.colors.primary.DEFAULT} />
                        <Text style={styles.sessionTimeText}>{session.timeRemaining}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.sessionContent}>
                    <View style={styles.sessionAvatar}>
                      <Text style={styles.sessionAvatarText}>{session.companyAvatar}</Text>
                    </View>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionCompany}>{session.company}</Text>
                      <Text style={styles.sessionDescription}>{session.description}</Text>
                    </View>
                    {session.actionRequired ? (
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Action</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.chatButton}>
                        <AppIcon.Messages width={20} height={20} color={theme.colors.text.secondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.sessionProgress}>
                    <View style={styles.progressMetaRow}>
                      <Text style={styles.progressMetaLabel}>Responses Received</Text>
                      <Text style={styles.progressMetaValue}>
                        {session.responsesReceived}/{session.totalExpectedResponses}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${session.progressPercent}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={{ alignSelf: 'center' }}>
                <CustomButton
                  title="View All Sessions"
                  onPress={handleViewAllSessions}
                  variant="gradient"
                  size="sm"
                  style={{ marginTop: theme.spacing[2], alignSelf: 'flex-start' }}
                  textStyle={styles.viewAllSessionsButtonText}
                />
              </View>
            </>
          )}
        </View>
      </DashboardCardWrapper>
        </>
      )}
    </ScrollView>
  );
};
