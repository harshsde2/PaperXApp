/**
 * SessionDetailsScreen
 * Shows session details with match responses and filter tabs
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import {
  useGetSessionDetail,
  useGetMatchmakingResponses,
} from '@services/api';
import { MatchResponse, MatchType, Session } from '../../@types';
import { MatchResponseCard } from '../../components/MatchResponseCard';
import { SessionDetailsScreenRouteProp, FilterChip } from './@types';
import { createStyles } from './styles';

const FILTER_CHIPS: FilterChip[] = [
  { key: 'all', label: 'All' },
  { key: 'exact_match', label: 'Exact Match' },
  { key: 'slight_variation', label: 'Slight Variation' },
  { key: 'nearest', label: 'Nearest' },
];

const SessionDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SessionDetailsScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const { sessionId, session: routeSession } = route.params || {};
  const [activeFilter, setActiveFilter] = useState<MatchType>('all');

  // Get session detail from API
  const {
    data: sessionDetail,
    isLoading: isLoadingSession,
    refetch: refetchSession,
  } = useGetSessionDetail(sessionId ? Number(sessionId) : 0);

  // Get inquiry ID from session detail or route session
  const inquiryId = useMemo(() => {
    if (sessionDetail?.inquiry?.id) {
      return sessionDetail.inquiry.id;
    }
    if (routeSession?.inquiryId) {
      return Number(routeSession.inquiryId);
    }
    return null;
  }, [sessionDetail, routeSession]);

  // Get matchmaking responses from API
  const filterParam = useMemo(() => {
    return activeFilter === 'all' ? undefined : activeFilter;
  }, [activeFilter]);

  const {
    data: matchmakingData,
    isLoading: isLoadingResponses,
    refetch: refetchResponses,
  } = useGetMatchmakingResponses(inquiryId || 0, {
    filter: filterParam,
  });

  // Map API responses to MatchResponse type
  const responses = useMemo<MatchResponse[]>(() => {
    if (!matchmakingData?.responses) {
      return [];
    }

    return matchmakingData.responses.map((response) => {
      const locationParts = response.dealer.location?.split(', ') || ['Unknown', 'Unknown'];
      const city = locationParts[0] || 'Unknown';
      const country = locationParts[1] || 'India';

      // Format distance
      let distance = 'Unknown';
      if (response.distance_km !== null && response.distance_km !== undefined) {
        if (response.distance_km < 1) {
          distance = `${Math.round(response.distance_km * 1000)} m away`;
        } else {
          distance = `${Math.round(response.distance_km)} km away`;
        }
      }

      // Format message from additional_details or quoted_price
      let message = response.additional_details || '';
      if (response.quoted_price) {
        const priceText = `Quoted price: ₹${response.quoted_price}`;
        message = message ? `${priceText}. ${message}` : priceText;
      }
      if (!message) {
        message = `Quantity offered: ${response.quantity_offered}`;
      }

      return {
        id: String(response.id),
        sessionId: sessionId || '',
        supplierId: response.dealer.id ? String(response.dealer.id) : 'unknown',
        supplierName: response.dealer.company_name || 'Unknown Supplier',
        isVerified: false, // API doesn't provide this, default to false
        location: {
          city,
          country,
          distance,
        },
        matchType: response.match_type,
        message,
        isShortlisted: response.is_shortlisted,
        isRejected: false, // API doesn't provide this, default to false
        respondedAt: response.responded_at,
      };
    });
  }, [matchmakingData, sessionId]);

  const refreshing = isLoadingSession || isLoadingResponses;

  // Responses are already filtered by API, but we keep this for consistency
  const filteredResponses = useMemo(() => {
    return responses;
  }, [responses]);

  const responseCount = useMemo(() => {
    return matchmakingData?.responses_count || responses.length;
  }, [matchmakingData, responses.length]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchSession(), refetchResponses()]);
  }, [refetchSession, refetchResponses]);

  const handleFilterChange = useCallback((filter: MatchType) => {
    setActiveFilter(filter);
    // Query will automatically refetch when filter changes due to queryKey dependency
  }, []);

  const handleChat = useCallback(
    (response: MatchResponse) => {
      navigation.navigate(SCREENS.SESSIONS.CHAT, {
        sessionId,
        partnerId: response.supplierId,
        partnerName: response.supplierName,
        inquiryRef: inquiryId ? String(inquiryId) : undefined,
      });
    },
    [navigation, sessionId, inquiryId]
  );

  const handleShortlist = useCallback(
    (response: MatchResponse) => {
      // TODO: Implement API call to shortlist response
      // For now, just refetch to get updated state
      refetchResponses();
    },
    [refetchResponses]
  );

  const handleReject = useCallback(
    (response: MatchResponse) => {
      // TODO: Implement API call to reject response
      // For now, just refetch to get updated state
      refetchResponses();
    },
    [refetchResponses]
  );

  // Timer calculation from API countdown
  const timeLeft = useMemo(() => {
    if (matchmakingData?.countdown) {
      const { hours, minutes, seconds } = matchmakingData.countdown;
      return {
        hours,
        mins: minutes,
        secs: seconds,
      };
    }
    return { hours: 0, mins: 0, secs: 0 };
  }, [matchmakingData?.countdown]);

  // Update timer every second
  const [currentTimeLeft, setCurrentTimeLeft] = useState(timeLeft);

  useEffect(() => {
    setCurrentTimeLeft(timeLeft);
    const timer = setInterval(() => {
      setCurrentTimeLeft((prev) => {
        let { hours, mins, secs } = prev;
        if (secs > 0) {
          secs--;
        } else if (mins > 0) {
          mins--;
          secs = 59;
        } else if (hours > 0) {
          hours--;
          mins = 59;
          secs = 59;
        }
        return { hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const renderResponseCard = useCallback(
    ({ item }: { item: MatchResponse }) => (
      <View style={styles.responseCard}>
        <MatchResponseCard
          response={item}
          onChat={handleChat}
          onShortlist={handleShortlist}
          onReject={handleReject}
        />
      </View>
    ),
    [handleChat, handleShortlist, handleReject, styles.responseCard]
  );

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <AppIcon.ArrowLeft width={20} height={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Matchmaking Responses</Text>
          <TouchableOpacity style={styles.filterButton}>
            <AppIcon.Process width={20} height={20} color={theme.colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredResponses}
        keyExtractor={(item) => item.id}
        renderItem={renderResponseCard}
        contentContainerStyle={styles.responseList}
        ListHeaderComponent={
          <>
            {/* Requirement Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryContent}>
                <View style={styles.summaryImagePlaceholder}>
                  <AppIcon.Market width={32} height={32} color={theme.colors.text.tertiary} />
                </View>
                <View style={styles.summaryDetails}>
                  <Text style={styles.summaryLabel}>Requirement Summary</Text>
                  <Text style={styles.summaryTitle} numberOfLines={2}>
                    {sessionDetail?.inquiry?.title ||
                      matchmakingData?.inquiry?.title ||
                      routeSession?.title ||
                      'Material Requirement'}
                  </Text>
                  <Text style={styles.summarySubtitle}>
                    {matchmakingData?.inquiry?.items
                      ?.map(
                        (item) =>
                          `${item.quantity} ${item.quantity_unit} ${item.material_category}`
                      )
                      .join(', ') ||
                      sessionDetail?.inquiry?.items
                        ?.map(
                          (item) =>
                            `${item.quantity} ${item.quantity_unit} ${item.material_category}`
                        )
                        .join(', ') ||
                      routeSession?.specifications ||
                      'No details available'}
                  </Text>
                </View>
              </View>

              {/* Timer */}
              {matchmakingData?.countdown && (
                <View style={styles.summaryTimer}>
                  <Text style={styles.timerLabel}>Bidding ends in:</Text>
                  <View style={styles.timerRow}>
                    <View style={styles.timerBlock}>
                      <View style={styles.timerValue}>
                        <Text style={styles.timerValueText}>
                          {String(currentTimeLeft.hours).padStart(2, '0')}
                        </Text>
                      </View>
                      <Text style={styles.timerUnit}>Hrs</Text>
                    </View>
                    <View style={styles.timerBlock}>
                      <View style={styles.timerValue}>
                        <Text style={styles.timerValueText}>
                          {String(currentTimeLeft.mins).padStart(2, '0')}
                        </Text>
                      </View>
                      <Text style={styles.timerUnit}>Mins</Text>
                    </View>
                    <View style={styles.timerBlock}>
                      <View style={styles.timerValue}>
                        <Text style={styles.timerValueText}>
                          {String(currentTimeLeft.secs).padStart(2, '0')}
                        </Text>
                      </View>
                      <Text style={styles.timerUnit}>Secs</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Supplier Responses</Text>
              <Text style={styles.sectionCount}>{responseCount} found</Text>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterChipsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsScroll}
              >
                {FILTER_CHIPS.map((chip) => (
                  <TouchableOpacity
                    key={chip.key}
                    style={[
                      styles.filterChip,
                      activeFilter === chip.key && styles.filterChipActive,
                    ]}
                    onPress={() => handleFilterChange(chip.key)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        activeFilter === chip.key && styles.filterChipTextActive,
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No responses found for this filter.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

export default SessionDetailsScreen;
