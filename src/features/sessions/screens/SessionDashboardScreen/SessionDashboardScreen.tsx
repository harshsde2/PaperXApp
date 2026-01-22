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
import { Session, SessionTabType } from '../../@types';
import { SessionTabBar } from '../../components/SessionTabBar';
import { SessionCard } from '../../components/SessionCard';
import { SessionDashboardScreenRouteProp } from './@types';
import { createStyles } from './styles';

// Mock data for demonstration
const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    inquiryId: 'INQ-001',
    title: '50k Units Sustainable Cardboard',
    category: 'Packaging',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    isUrgent: true,
    biddingEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    responsesReceived: 8,
    totalExpectedResponses: 10,
    materialName: 'Cardboard',
    quantity: '50000',
    quantityUnit: 'units',
  },
  {
    id: '2',
    inquiryId: 'INQ-002',
    title: 'Aluminum Foil Roll - 200m',
    category: 'Raw Materials',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'finding_matches',
    isUrgent: false,
    responsesReceived: 2,
    totalExpectedResponses: 15,
    materialName: 'Aluminum Foil',
    quantity: '200',
    quantityUnit: 'meters',
  },
  {
    id: '3',
    inquiryId: 'INQ-003',
    title: 'Eco-friendly Adhesive Tape',
    category: 'Office Supplies',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'locked',
    isUrgent: false,
    responsesReceived: 12,
    totalExpectedResponses: 15,
    materialName: 'Adhesive Tape',
    quantity: '5000',
    quantityUnit: 'rolls',
  },
  {
    id: '4',
    inquiryId: 'INQ-004',
    title: 'Rigid PVC Films - Industrial Grade',
    category: 'Industrial Materials',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    isUrgent: true,
    biddingEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    responsesReceived: 5,
    totalExpectedResponses: 12,
    materialName: 'PVC Films',
    quantity: '2000',
    quantityUnit: 'kg',
  },
];

const SessionDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SessionDashboardScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const initialTab = route.params?.initialTab || 'all';
  const [activeTab, setActiveTab] = useState<SessionTabType>(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter sessions based on active tab
  const filteredSessions = useMemo(() => {
    if (activeTab === 'all') return MOCK_SESSIONS;
    return MOCK_SESSIONS.filter((session) => session.status === activeTab);
  }, [activeTab]);

  const handleTabChange = useCallback((tab: SessionTabType) => {
    setActiveTab(tab);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

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
