/**
 * SessionDetailsScreen
 * Shows session details with match responses and filter tabs
 */

import React, { useState, useCallback, useMemo } from 'react';
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

// Mock responses data
const MOCK_RESPONSES: MatchResponse[] = [
  {
    id: '1',
    sessionId: '1',
    supplierId: 'sup-001',
    supplierName: 'Global Packaging Solutions',
    isVerified: true,
    location: {
      city: 'Mumbai',
      country: 'India',
      distance: '45 km away',
    },
    matchType: 'exact_match',
    message: 'We have 50 tons of Grade A recycled PET ready for immediate shipment. All certificates included.',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    sessionId: '1',
    supplierId: 'sup-002',
    supplierName: 'EcoMaterials Ltd.',
    isVerified: true,
    location: {
      city: 'Delhi',
      country: 'India',
      distance: '112 km away',
    },
    matchType: 'slight_variation',
    message: 'Available stock: 42 tons. Can provide remaining 8 tons within 10 days from secondary facility.',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    sessionId: '1',
    supplierId: 'sup-003',
    supplierName: 'Nordic Recyclers',
    isVerified: false,
    location: {
      city: 'Bangalore',
      country: 'India',
      distance: '310 km away',
    },
    matchType: 'exact_match',
    message: 'Full fulfillment available. Logistics partner can deliver to your doorstep by Friday.',
    isShortlisted: true,
    isRejected: false,
    respondedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    sessionId: '1',
    supplierId: 'sup-004',
    supplierName: 'GreenPack Industries',
    isVerified: true,
    location: {
      city: 'Chennai',
      country: 'India',
      distance: '520 km away',
    },
    matchType: 'nearest',
    message: 'We can provide similar grade material at competitive pricing. Sample available for inspection.',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

const SessionDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SessionDetailsScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const { sessionId, session } = route.params || {};
  const [activeFilter, setActiveFilter] = useState<MatchType>('all');
  const [responses, setResponses] = useState<MatchResponse[]>(MOCK_RESPONSES);
  const [refreshing, setRefreshing] = useState(false);

  // Filter responses
  const filteredResponses = useMemo(() => {
    if (activeFilter === 'all') return responses;
    return responses.filter((r) => r.matchType === activeFilter);
  }, [responses, activeFilter]);

  const responseCount = useMemo(() => {
    return responses.length;
  }, [responses]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleFilterChange = useCallback((filter: MatchType) => {
    setActiveFilter(filter);
  }, []);

  const handleChat = useCallback(
    (response: MatchResponse) => {
      navigation.navigate(SCREENS.SESSIONS.CHAT, {
        sessionId,
        partnerId: response.supplierId,
        partnerName: response.supplierName,
        inquiryRef: session?.inquiryId,
      });
    },
    [navigation, sessionId, session]
  );

  const handleShortlist = useCallback((response: MatchResponse) => {
    setResponses((prev) =>
      prev.map((r) =>
        r.id === response.id ? { ...r, isShortlisted: !r.isShortlisted } : r
      )
    );
  }, []);

  const handleReject = useCallback((response: MatchResponse) => {
    setResponses((prev) =>
      prev.map((r) =>
        r.id === response.id ? { ...r, isRejected: true } : r
      )
    );
  }, []);

  // Timer calculation
  const getTimeLeft = useCallback(() => {
    if (!session?.biddingEndsAt) {
      return { hours: 0, mins: 0, secs: 0 };
    }
    const target = new Date(session.biddingEndsAt).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      secs: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }, [session?.biddingEndsAt]);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [getTimeLeft]);

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
                {session?.imageUrl ? (
                  <Image source={{ uri: session.imageUrl }} style={styles.summaryImage} />
                ) : (
                  <View style={styles.summaryImagePlaceholder}>
                    <AppIcon.Market width={32} height={32} color={theme.colors.text.tertiary} />
                  </View>
                )}
                <View style={styles.summaryDetails}>
                  <Text style={styles.summaryLabel}>Requirement Summary</Text>
                  <Text style={styles.summaryTitle} numberOfLines={2}>
                    {session?.title || 'Material Requirement'}
                  </Text>
                  <Text style={styles.summarySubtitle}>
                    {session?.specifications || `${session?.materialName || 'Material'}, ${session?.quantity || '0'}${session?.quantityUnit || ''}`}
                  </Text>
                </View>
              </View>

              {/* Timer */}
              {session?.biddingEndsAt && (
                <View style={styles.summaryTimer}>
                  <Text style={styles.timerLabel}>Bidding ends in:</Text>
                  <View style={styles.timerRow}>
                    <View style={styles.timerBlock}>
                      <View style={styles.timerValue}>
                        <Text style={styles.timerValueText}>
                          {String(timeLeft.hours).padStart(2, '0')}
                        </Text>
                      </View>
                      <Text style={styles.timerUnit}>Hrs</Text>
                    </View>
                    <View style={styles.timerBlock}>
                      <View style={styles.timerValue}>
                        <Text style={styles.timerValueText}>
                          {String(timeLeft.mins).padStart(2, '0')}
                        </Text>
                      </View>
                      <Text style={styles.timerUnit}>Mins</Text>
                    </View>
                    <View style={styles.timerBlock}>
                      <View style={styles.timerValue}>
                        <Text style={styles.timerValueText}>
                          {String(timeLeft.secs).padStart(2, '0')}
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
