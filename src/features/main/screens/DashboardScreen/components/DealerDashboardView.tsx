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
import { AppIcon } from '@assets/svgs';
import type { DealerDashboardData } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { createStyles } from './DealerDashboardView/styles';

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
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Manage your opportunities and sessions.</Text>
      </View>

   

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