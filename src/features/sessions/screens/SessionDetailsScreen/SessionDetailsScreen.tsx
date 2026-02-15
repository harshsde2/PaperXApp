/**
 * SessionDetailsScreen
 * One screen, two views: Poster (match responses + filters) vs Receiver (requirement summary + submit quote).
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import {
  useGetSessionDetail,
  useGetPosterDetail,
  useGetMatchmakingResponses,
  type GetMatchmakingResponsesParams,
} from '@services/api';
import { MatchResponse, MatchType, Session } from '../../@types';
import { SessionDetailsScreenRouteProp } from './@types';
import { PosterDetailView } from './views/PosterDetailView';
import { SessionDetailReceiverView } from './views/SessionDetailReceiverView';
import { createStyles } from './styles';

const SessionDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SessionDetailsScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const { sessionId, session: routeSession } = route.params || {};
  const [activeFilter, setActiveFilter] = useState<MatchType>('all');

  const {
    data: sessionDetail,
    isLoading: isLoadingSession,
    refetch: refetchSession,
  } = useGetSessionDetail(sessionId ? Number(sessionId) : 0, {
    enabled: !!sessionId,
  });

  const inquiryId = useMemo(() => {
    if (sessionDetail?.inquiry?.id) {
      return sessionDetail.inquiry.id;
    }
    if (routeSession?.inquiryId) {
      const parsed = parseInt(routeSession.inquiryId.replace(/\D/g, ''), 10);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
  }, [sessionDetail, routeSession]);

  const isOwner = routeSession?.isOwner ?? sessionDetail?.is_owner ?? true;

  const filterParam = useMemo((): GetMatchmakingResponsesParams => {
    return activeFilter === 'all' ? {} : { filter: activeFilter };
  }, [activeFilter]);

  const {
    data: matchmakingData,
    isLoading: isLoadingResponses,
    refetch: refetchResponses,
  } = useGetMatchmakingResponses(inquiryId || 0, filterParam, {
    enabled: !!inquiryId && !isOwner,
  });

  const {
    data: posterDetailData,
    isLoading: isLoadingPosterDetail,
    refetch: refetchPosterDetail,
    isRefetching: isRefetchingPosterDetail,
  } = useGetPosterDetail(sessionId ? Number(sessionId) : 0, {
    enabled: !!sessionId && isOwner,
  });

  const posterLabel = sessionDetail?.poster_label ?? routeSession?.posterLabel ?? 'a supplier';

  const summaryTitle = useMemo(() => {
    return (
      sessionDetail?.inquiry?.title ||
      matchmakingData?.inquiry?.title ||
      routeSession?.title ||
      'Material Requirement'
    );
  }, [sessionDetail?.inquiry?.title, matchmakingData?.inquiry?.title, routeSession?.title]);

  const summarySubtitle = useMemo(() => {
    const items = matchmakingData?.inquiry?.items ?? sessionDetail?.inquiry?.items;
    if (items?.length) {
      return items
        .map((item) => `${item.quantity ?? ''} ${item.quantity_unit ?? ''} ${item.material_category ?? ''}`.trim())
        .join(', ');
    }
    return routeSession?.specifications ?? 'No details available';
  }, [matchmakingData?.inquiry?.items, sessionDetail?.inquiry?.items, routeSession?.specifications]);

  const responses = useMemo<MatchResponse[]>(() => {
    if (!matchmakingData?.responses) return [];
    return matchmakingData.responses.map((response) => {
      const locationParts = response.dealer.location?.split(', ') || ['Unknown', 'Unknown'];
      const city = locationParts[0] || 'Unknown';
      const country = locationParts[1] || 'India';
      let distance = 'Unknown';
      if (response.distance_km != null) {
        distance = response.distance_km < 1
          ? `${Math.round(response.distance_km * 1000)} m away`
          : `${Math.round(response.distance_km)} km away`;
      }
      let message = '';
      if (response.has_responded) {
        message = response.additional_details || '';
        if (response.quoted_price) {
          const priceText = `Quoted price: ₹${response.quoted_price}`;
          message = message ? `${priceText}. ${message}` : priceText;
        }
        if (!message && response.quantity_offered) {
          message = `Quantity offered: ${response.quantity_offered}`;
        }
        if (!message) message = 'Response submitted';
      } else {
        message = `Match score: ${response.match_score ?? 0}% • Awaiting response`;
      }
      return {
        id: String(response.id),
        sessionId: sessionId || '',
        supplierId: response.dealer.id ? String(response.dealer.id) : 'unknown',
        supplierName: response.dealer.company_name || 'Potential Match',
        isVerified: false,
        location: { city, country, distance },
        matchType: response.match_type,
        message,
        isShortlisted: response.is_shortlisted,
        isRejected: false,
        respondedAt: response.responded_at,
        hasResponded: response.has_responded,
        matchScore: response.match_score,
      };
    });
  }, [matchmakingData, sessionId]);

  const refreshing =
    isLoadingSession || (isOwner ? isLoadingPosterDetail : isLoadingResponses) || isRefetchingPosterDetail;

  const receiverStartDate = sessionDetail?.created_at ?? undefined;
  const receiverEndDate = sessionDetail?.expires_at ?? undefined;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    if (isOwner) {
      await Promise.all([refetchSession(), refetchPosterDetail()]);
    } else {
      await Promise.all([refetchSession(), refetchResponses()]);
    }
  }, [isOwner, refetchSession, refetchPosterDetail, refetchResponses]);

  const handleFilterChange = useCallback((filter: MatchType) => {
    setActiveFilter(filter);
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
      refetchResponses();
    },
    [refetchResponses]
  );

  const handleReject = useCallback(
    (response: MatchResponse) => {
      refetchResponses();
    },
    [refetchResponses]
  );

  const isLocked = useMemo(() => {
    const lockedAt = sessionDetail?.locked_at;
    if (!lockedAt) return false;
    return new Date(lockedAt) <= new Date();
  }, [sessionDetail?.locked_at]);

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <AppIcon.ArrowLeft width={20} height={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isOwner ? 'Your requirement' : 'Match for you'}
          </Text>
          {!isOwner ? (
            <TouchableOpacity style={styles.filterButton}>
              <AppIcon.Process width={20} height={20} color={theme.colors.primary.DEFAULT} />
            </TouchableOpacity>
          ) : (
            <View style={styles.filterButton} />
          )}
        </View>
      </View>

      {isOwner ? (
        <PosterDetailView
          data={posterDetailData}
          isLoading={isLoadingPosterDetail}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      ) : (
        <SessionDetailReceiverView
          summaryTitle={summaryTitle}
          summarySubtitle={summarySubtitle}
          posterLabel={posterLabel}
          startDate={receiverStartDate}
          endDate={receiverEndDate}
          inquiryId={inquiryId ?? 0}
          sessionId={sessionId ?? ''}
          onQuoteSubmitted={handleRefresh}
          isLocked={isLocked}
        />
      )}
    </ScreenWrapper>
  );
};

export default SessionDetailsScreen;
