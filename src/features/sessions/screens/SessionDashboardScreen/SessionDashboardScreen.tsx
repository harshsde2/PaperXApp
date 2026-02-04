/**
 * SessionDashboardScreen
 * Main dashboard showing all sessions with top tab filtering
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { useGetActiveSessions } from '@services/api';
import type { ActiveSessionListItem, SessionFilter } from '@services/api';
import { USE_DUMMY_DATA } from '@shared/constants/config';
import { Session, SessionTabType } from '../../@types';
import { SessionTabBar } from '../../components/SessionTabBar';
import { SessionCard } from '../../components/SessionCard';
import { getDummySessionsByTab } from '../../dummyData';
import { SessionDashboardScreenRouteProp } from './@types';
import { createStyles } from './styles';
import { useAppSelector } from '@store/hooks';

const SessionDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SessionDashboardScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const token = useAppSelector((state) => state.auth.token);
  console.log('token ->', JSON.stringify(token, null, 2));

  const initialTab = route.params?.initialTab || 'all';
  const [activeTab, setActiveTab] = useState<SessionTabType>(initialTab);

  // Map frontend tab to API filter
  const apiFilter: SessionFilter = useMemo(() => {
    if (activeTab === 'all') return 'all';
    return activeTab;
  }, [activeTab]);

  // Fetch active sessions from API (disabled in dummy mode)
  const {
    data: sessionsResponse,
    isLoading: isApiLoading,
    isRefetching,
    refetch,
  } = useGetActiveSessions(
    {
      filter: apiFilter,
      per_page: 50,
    },
    {
      enabled: !USE_DUMMY_DATA, // Disable API calls in dummy mode
    }
  );

  console.log('sessionsResponse ->', JSON.stringify(sessionsResponse, null, 2));
  console.log('USE_DUMMY_DATA ->', USE_DUMMY_DATA);

  // Use dummy data or API data based on config
  const sessions = USE_DUMMY_DATA ? [] : (sessionsResponse?.data || []);
  const isLoading = USE_DUMMY_DATA ? false : isApiLoading;
  const refreshing = USE_DUMMY_DATA ? false : isRefetching;

  // Transform API data to frontend Session type OR use dummy data
  const transformedSessions: Session[] = useMemo(() => {
    // Use dummy data in demo mode
    if (USE_DUMMY_DATA) {
      return getDummySessionsByTab(activeTab);
    }

    // Transform API data to frontend Session type
    return sessions.map((session: ActiveSessionListItem) => {
      const firstItem = session.items[0];
      const totalQuantity = session.items.reduce((sum, item) => sum + item.quantity, 0);
      
      // Map status from API to frontend
      let frontendStatus: SessionTabType = 'active';
      if (session.status === 'MATCHING') {
        frontendStatus = 'finding_matches';
      } else if (session.status === 'LOCKED') {
        frontendStatus = 'locked';
      } else if (session.status === 'RESPONSES_RECEIVED' || session.status === 'CHAT_ACTIVE') {
        frontendStatus = 'active';
      }

      return {
        id: String(session.id),
        inquiryId: `INQ-${String(session.inquiry_id).padStart(3, '0')}`,
        title: session.title,
        category: firstItem?.material_category || 'Material',
        createdAt: session.created_at,
        status: frontendStatus,
        isUrgent: session.urgency === 'urgent',
        biddingEndsAt: session.countdown
          ? new Date(Date.now() + 
              (session.countdown.days * 24 * 60 * 60 * 1000) +
              (session.countdown.hours * 60 * 60 * 1000) +
              (session.countdown.minutes * 60 * 1000) +
              (session.countdown.seconds * 1000)
            ).toISOString()
          : undefined,
        responsesReceived: session.responses_received || 0,
        totalExpectedResponses: session.matching_progress?.total || session.matched_dealers_count || 15,
        materialName: firstItem?.material_category || 'Material',
        quantity: String(totalQuantity),
        quantityUnit: firstItem?.quantity_unit || 'units',
      };
    });
  }, [sessions, activeTab]);

  // Filter sessions based on active tab
  // In dummy mode, data is already filtered by getDummySessionsByTab
  // In API mode, filter the transformed sessions
  const filteredSessions = useMemo(() => {
    if (USE_DUMMY_DATA) {
      return transformedSessions; // Already filtered by tab in dummy mode
    }
    if (activeTab === 'all') return transformedSessions;
    return transformedSessions.filter((session) => session.status === activeTab);
  }, [transformedSessions, activeTab]);

  const handleTabChange = useCallback((tab: SessionTabType) => {
    setActiveTab(tab);
  }, []);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleSessionPress = useCallback(
    (session: Session) => {
      if (session.status === 'locked') {
        navigation.navigate(SCREENS.SESSIONS.LOCKED, {
          sessionId: session.id,
          session,
        });
      } else {
        navigation.navigate(SCREENS.SESSIONS.DETAILS, {
          sessionId: session.id,
          session,
        });
      }
    },
    [navigation]
  );

  const handleViewMatches = useCallback(
    (session: Session) => {
      navigation.navigate(SCREENS.SESSIONS.DETAILS, {
        sessionId: session.id,
        session,
      });
    },
    [navigation]
  );

  const handleCreateSession = useCallback(() => {
    navigation.navigate(SCREENS.MAIN.POST);
  }, [navigation]);

  const handleSearch = useCallback(() => {
    // TODO: Implement search
  }, []);

  const handleNotifications = useCallback(() => {
    // TODO: Navigate to notifications
  }, []);

  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      switch (activeTab) {
        case 'finding_matches':
          return {
            title: 'No sessions finding matches',
            subtitle: 'Your new requirements will appear here while we find matches for you.',
          };
        case 'active':
          return {
            title: 'No active sessions',
            subtitle: 'Sessions with responses will appear here for your review.',
          };
        case 'locked':
          return {
            title: 'No locked sessions',
            subtitle: 'Completed sessions where you\'ve selected partners will appear here.',
          };
        default:
          return {
            title: 'No sessions yet',
            subtitle: 'Post a requirement to start finding matches for your industrial material needs.',
          };
      }
    };

    const { title, subtitle } = getEmptyMessage();

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrapper}>
          <AppIcon.Inquiries width={36} height={36} color={theme.colors.text.tertiary} />
        </View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
        {activeTab === 'all' && (
          <TouchableOpacity style={styles.emptyButton} onPress={handleCreateSession}>
            <Text style={styles.emptyButtonText}>Post Requirement</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSessionCard = useCallback(
    ({ item }: { item: Session }) => (
      <View style={styles.sessionCard}>
        <SessionCard
          session={item}
          onPress={handleSessionPress}
          onViewMatches={handleViewMatches}
        />
      </View>
    ),
    [handleSessionPress, handleViewMatches, styles.sessionCard]
  );

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <AppIcon.Dashboard width={18} height={18} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text style={styles.headerTitle}>Sourcing Hub</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleSearch}>
              <AppIcon.Search width={20} height={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleNotifications}>
              <AppIcon.Notification width={20} height={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <SessionTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
        </View>
      ) : (
        <FlatList
          data={filteredSessions}
          keyExtractor={(item) => item.id}
          renderItem={renderSessionCard}
          contentContainerStyle={[
            styles.listContent,
            filteredSessions.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary.DEFAULT}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + theme.spacing[6] }]}
        onPress={handleCreateSession}
        activeOpacity={0.8}
      >
        <AppIcon.ArrowRight width={28} height={28} color="#FFFFFF" style={{ transform: [{ rotate: '-90deg' }] }} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default SessionDashboardScreen;
