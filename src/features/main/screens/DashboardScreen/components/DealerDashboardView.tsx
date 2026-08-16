import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import type { DealerDashboardData } from '@services/api';
import { useGetActiveSessions } from '@services/api';
import type { ActiveSessionListItem } from '@services/api/sessionApi/@types';
import { SCREENS } from '@navigation/constants';
import { useTabBarContentBottomInset } from '@shared/hooks/useTabBarContentBottomInset';
import { useDashboardHeaderHeight } from '../DashboardHeaderHeightContext';
import { ResponsesCard } from './ResponsesCard';
import { createStyles } from './DealerDashboardView/styles';

interface TransformedSession {
  id: string;
  status: 'ACTIVE' | 'NEGOTIATION' | 'WAITING';
  timeRemaining: string;
  companyAvatar: string;
  company: string;
  description: string;
  actionRequired: boolean;
  responsesReceived: number;
  totalExpectedResponses: number;
  progressPercent: number;
}

const { width } = Dimensions.get('window');

interface DealerDashboardViewProps {
  profileData: any;
  dashboardData?: DealerDashboardData;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const DealerDashboardView: React.FC<DealerDashboardViewProps> = ({
  profileData,
  dashboardData: apiData,
  onRefresh,
  refreshing = false,
}) => {
  const navigation = useNavigation<any>();
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

  const companyName = profileData?.company_name || 'Your Company';

  // Use API data with fallback to defaults
  const dashboardData = {
    profileCompletionPercentage: apiData?.profile_completion_percentage ?? 0,
    activeOpportunities: apiData?.active_opportunities_count ?? 0,
    activeInquiries: apiData?.active_inquiries_count ?? 0,
    lockedSessions: apiData?.locked_sessions_count ?? 0,
    expiredSessions: apiData?.expired_sessions_count ?? 0,
    unreadNotifications: apiData?.unread_notifications_count ?? 0,
    postedRequirements: apiData?.posted_requirements_count ?? 0,
  };

  // Active sessions = own posted + matched opportunities (own + matched, via /sessions/active)
  const {
    data: activeSessionsResponse,
    refetch: refetchActiveSessions,
    isRefetching: isSessionsRefetching,
  } = useGetActiveSessions({ filter: 'all', per_page: 3 });
  const activeSessions = activeSessionsResponse?.data ?? [];

  const transformedSessions = useMemo((): TransformedSession[] => {
    if (!activeSessions.length) return [];
    return activeSessions.slice(0, 3).map((session: ActiveSessionListItem) => {
      const firstItem = session.items?.[0];
      const totalQuantity = session.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

      let status: TransformedSession['status'] = 'ACTIVE';
      if (session.status === 'RESPONSES_RECEIVED' || session.status === 'CHAT_ACTIVE') {
        status = 'NEGOTIATION';
      } else if (session.status === 'MATCHING') {
        status = 'WAITING';
      }

      let timeRemaining = '';
      if (session.countdown) {
        const { days, hours, minutes } = session.countdown;
        if (days > 0) timeRemaining = `${days}d ${hours}h`;
        else if (hours > 0) timeRemaining = `${hours}h ${minutes}m`;
        else timeRemaining = `${minutes}m`;
      }

      const companyName = session.title.split('-')[0]?.trim() || session.poster_label || 'Company';
      const companyAvatar = companyName.charAt(0).toUpperCase();
      const materialName = firstItem?.material_category || 'Material';
      const quantityUnit = firstItem?.quantity_unit || 'units';
      const description = `${materialName} - ${totalQuantity} ${quantityUnit}`;

      const safeResponsesReceived = Number(session.responses_received ?? 0);
      const safeMatchedDealers = Number(session.matched_dealers_count ?? 0);
      const safeMatchingProgressMatched = Number(session.matching_progress?.matched ?? 0);
      const hasExplicitResponses =
        session.responses_received !== null && session.responses_received !== undefined;
      const resolvedResponsesReceived = hasExplicitResponses
        ? Number.isFinite(safeResponsesReceived)
          ? safeResponsesReceived
          : 0
        : Math.max(
            Number.isFinite(safeMatchingProgressMatched) ? safeMatchingProgressMatched : 0,
            Number.isFinite(safeMatchedDealers) ? safeMatchedDealers : 0,
          );
      const totalExpectedResponses = 10;
      const responsesReceived = Math.max(
        0,
        Math.min(resolvedResponsesReceived, totalExpectedResponses),
      );
      const progressPercent = (responsesReceived / totalExpectedResponses) * 100;

      return {
        id: String(session.id),
        status,
        timeRemaining,
        companyAvatar,
        company: companyName,
        description,
        actionRequired: session.status === 'RESPONSES_RECEIVED',
        responsesReceived,
        totalExpectedResponses,
        progressPercent,
      };
    });
  }, [activeSessions]);

  const handleViewAllSessions = useCallback(() => {
    navigation.navigate(SCREENS.SESSIONS.DASHBOARD, { initialTab: 'all' });
  }, [navigation]);

  const handleSessionPress = useCallback(
    (sessionId: string) => {
      navigation.navigate(SCREENS.SESSIONS.DETAILS, { sessionId });
    },
    [navigation],
  );

  const handleRefresh = useCallback(() => {
    onRefresh?.();
    refetchActiveSessions();
  }, [onRefresh, refetchActiveSessions]);

  const [actionCardLayout, setActionCardLayout] = useState({ width: 160, height: 170 });
  const onActionCardLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) setActionCardLayout({ width, height });
  }, []);
  const [statCardLayout, setStatCardLayout] = useState({ width: 160, height: 150 });
  const onStatCardLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) setStatCardLayout({ width, height });
  }, []);

  const primaryGradient = useMemo(
    () =>
      [theme.colors.primary[800], theme.colors.primary[600], theme.colors.primary[400]].filter(
        Boolean
      ) as string[],
    [theme.colors.primary]
  );

  const secondaryBlueGradient = useMemo(
    () =>
      [theme.colors.primary[700], theme.colors.primary[500], theme.colors.primary[300]].filter(
        Boolean
      ) as string[],
    [theme.colors.primary]
  );
  const statsBlueGradient = useMemo(
    () =>
      [theme.colors.primary[700], theme.colors.primary[500], theme.colors.primary[300]].filter(
        Boolean
      ) as string[],
    [theme.colors.primary]
  );
  const statsGreyGradient = useMemo(
    () =>
      [
        theme.colors.secondary[500],
        theme.colors.secondary[600],
        theme.colors.secondary[700],
      ].filter(Boolean) as string[],
    [theme.colors.secondary]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={scrollContentContainerStyle}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || isSessionsRefetching}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary.DEFAULT}
          colors={[theme.colors.primary.DEFAULT]}
          progressViewOffset={headerInset}
        />
      }
    >
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Manage your opportunities and sessions.</Text>
      </View>

      {/* Responses to your posts (2-tap path to chat) */}
      <ResponsesCard />

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View
          style={[styles.statCard, styles.statCardBlue, styles.statCardWithGradient]}
          onLayout={onStatCardLayout}
        >
          <Canvas
            style={[
              styles.statGradientCanvas,
              { width: statCardLayout.width, height: statCardLayout.height },
            ]}
          >
            <RoundedRect
              x={0}
              y={0}
              width={statCardLayout.width}
              height={statCardLayout.height}
              r={16}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(statCardLayout.width, statCardLayout.height)}
                colors={
                  statsBlueGradient.length >= 2
                    ? statsBlueGradient
                    : [theme.colors.primary.DEFAULT, theme.colors.primary.light]
                }
              />
            </RoundedRect>
          </Canvas>
          <View style={styles.statContent}>
          <View style={styles.statIconContainer}>
            <AppIcon.Inquiries width={22} height={22} color={theme.colors.text.inverse} />
          </View>
          <Text style={[styles.statValue, styles.statValueDark]}>{dashboardData.activeInquiries}</Text>
          <Text style={[styles.statLabel, styles.statLabelDark]}>Inquiries</Text>
          <Text style={[styles.statSublabel, styles.statLabelDark]}>
            Open – until 10 people respond
          </Text>
        </View>
        </View>

        <View style={[styles.statCard, styles.statCardGrey, styles.statCardWithGradient]}>
          <Canvas
            style={[
              styles.statGradientCanvas,
              { width: statCardLayout.width, height: statCardLayout.height },
            ]}
          >
            <RoundedRect
              x={0}
              y={0}
              width={statCardLayout.width}
              height={statCardLayout.height}
              r={16}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(statCardLayout.width, statCardLayout.height)}
                colors={statsGreyGradient}
              />
            </RoundedRect>
          </Canvas>
          <View style={styles.statContent}>
          <View style={[styles.statIconContainer, styles.statIconDark]}>
            <AppIcon.Sessions width={22} height={22} color={theme.colors.text.inverse} />
          </View>
          <Text style={[styles.statValue, styles.statValueDark]}>{dashboardData.lockedSessions}</Text>
          <Text style={[styles.statLabel, styles.statLabelDark]}>Locked{'\n'}Sessions</Text>
        </View>
        </View>
      </View>

      {/* Secondary Stats Row */}
      {/* <View style={styles.secondaryStatsContainer}>
        <View style={styles.secondaryStatCard}>
          <View style={[styles.secondaryStatIcon, { backgroundColor: '#FEF3C7' }]}>
            <AppIcon.Sessions width={18} height={18} color="#F59E0B" />
          </View>
          <View style={styles.secondaryStatInfo}>
            <Text style={styles.secondaryStatValue}>{dashboardData.expiredSessions}</Text>
            <Text style={styles.secondaryStatLabel}>Expired Sessions</Text>
          </View>
        </View>

        <View style={styles.secondaryStatCard}>
          <View style={[styles.secondaryStatIcon, { backgroundColor: '#FEE2E2' }]}>
            <AppIcon.Messages width={18} height={18} color="#EF4444" />
          </View>
          <View style={styles.secondaryStatInfo}>
            <Text style={styles.secondaryStatValue}>{dashboardData.unreadNotifications}</Text>
            <Text style={styles.secondaryStatLabel}>Unread Notifications</Text>
          </View>
        </View>
      </View> */}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.MAIN.POST_TO_BUY)}
            style={[styles.actionCardPrimary, styles.actionCardWithGradient]}
            onLayout={onActionCardLayout}
            activeOpacity={0.85}
          >
            <Canvas
              style={[
                styles.actionGradientCanvas,
                { width: actionCardLayout.width, height: actionCardLayout.height },
              ]}
            >
              <RoundedRect
                x={0}
                y={0}
                width={actionCardLayout.width}
                height={actionCardLayout.height}
                r={16}
              >
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(actionCardLayout.width, actionCardLayout.height)}
                  colors={
                    primaryGradient.length >= 2
                      ? primaryGradient
                      : [theme.colors.primary.DEFAULT, theme.colors.primary.light]
                  }
                />
              </RoundedRect>
            </Canvas>
            <View style={styles.actionContent}>
              <View style={styles.actionIcon}>
                <AppIcon.Market width={28} height={28} color={theme.colors.text.inverse} />
              </View>
              <Text style={styles.actionTitlePrimary}>Post Buy Req</Text>
              <Text style={styles.actionSubtitlePrimary}>Find Materials</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.MAIN.POST_TO_BUY, { intent: 'sell' })}
            style={[styles.actionCardSecondary, styles.actionCardWithGradient]}
            activeOpacity={0.85}
          >
            <Canvas
              style={[
                styles.actionGradientCanvas,
                { width: actionCardLayout.width, height: actionCardLayout.height },
              ]}
            >
              <RoundedRect
                x={0}
                y={0}
                width={actionCardLayout.width}
                height={actionCardLayout.height}
                r={16}
              >
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(actionCardLayout.width, actionCardLayout.height)}
                  colors={
                    secondaryBlueGradient.length >= 2
                      ? secondaryBlueGradient
                      : [theme.colors.primary.DEFAULT, theme.colors.primary.light]
                  }
                />
              </RoundedRect>
            </Canvas>
            <View style={styles.actionContent}>
              <View style={styles.actionIconSecondary}>
                <AppIcon.Inquiries width={28} height={28} color={theme.colors.text.inverse} />
              </View>
              <Text style={styles.actionTitleSecondary}>Post Sell Offer</Text>
              <Text style={styles.actionSubtitleSecondary}>List Inventory</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Additional Cards */}
      <View style={styles.additionalCardsRow}>
        <TouchableOpacity style={styles.additionalCard} activeOpacity={0.7}>
          <View style={styles.additionalIconContainer}>
            <AppIcon.Market width={24} height={24} color={theme.colors.primary.DEFAULT} />
          </View>
          <Text style={styles.additionalCardTitle}>Opportunities</Text>
          <Text style={styles.additionalCardSubtitle}>View all opportunities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.additionalCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(SCREENS.SESSIONS.DASHBOARD)}
        >
          <View style={styles.additionalIconContainer}>
            <AppIcon.Inquiries width={24} height={24} color={theme.colors.primary.DEFAULT} />
          </View>
          <Text style={styles.additionalCardTitle}>My Requirements</Text>
          <Text style={styles.additionalCardSubtitle}>
            {dashboardData.postedRequirements} posted
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Sessions (own posts + matched opportunities) */}
      <View style={styles.activeSessionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          <TouchableOpacity onPress={handleViewAllSessions}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {transformedSessions.length === 0 ? (
          <View style={styles.emptySessionsCard}>
            <View style={styles.emptySessionsIconWrap}>
              <AppIcon.Sessions width={32} height={32} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text style={styles.emptySessionsTitle}>No active sessions</Text>
            <Text style={styles.emptySessionsDesc}>
              You don't have any active sessions or matched opportunities right now.
            </Text>
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
          </View>
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
                    <Text style={styles.sessionStatusText}>{session.status.replace('_', ' ')}</Text>
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
                    <View style={[styles.progressFill, { width: `${session.progressPercent}%` }]} />
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

      {/* Market Insight */}
      <TouchableOpacity onPress={() => navigation.navigate(SCREENS.MAIN.MARKET_INSIGHT)} style={styles.insightCard} activeOpacity={0.8}>
        <Text style={styles.insightCategory}>MARKET INSIGHT</Text>
        <Text style={styles.insightTitle}>Explore market trends and opportunities</Text>
        <View style={styles.insightLink}>
          <Text style={styles.insightLinkText}>View Market</Text>
          <AppIcon.ArrowRight width={18} height={18} color={theme.colors.text.inverse} />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};