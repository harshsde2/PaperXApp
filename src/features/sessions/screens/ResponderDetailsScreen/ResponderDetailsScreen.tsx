/**
 * ResponderDetailsScreen
 * Dedicated screen for responders: view requirement, express interest or decline.
 * No quote modal – only Interested / Not interested.
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
  useExpressInterest,
  useDeclineInquiry,
} from '@services/api';
import { RequirementSummaryCard } from '../../components/RequirementSummaryCard';
import { ResponderDetailsParams } from './@types';
import { createStyles } from './styles';

export default function ResponderDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<{ params?: ResponderDetailsParams }>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const params = route.params?.params ?? route.params;
  const { sessionId, session: routeSession } = params ?? {};
  const sessionIdNum = sessionId ? Number(sessionId) : 0;

  const { data: sessionDetail, isLoading, refetch } = useGetSessionDetail(sessionIdNum, {
    enabled: !!sessionIdNum,
  });

  const inquiryId = sessionDetail?.inquiry?.id ?? (routeSession?.inquiryId ? parseInt(String(routeSession.inquiryId).replace(/\D/g, ''), 10) : 0);

  const { data: matchmakingData } = useGetMatchmakingResponses(inquiryId, {}, { enabled: !!inquiryId });

  const expressInterest = useExpressInterest();
  const declineInquiry = useDeclineInquiry();

  const status = sessionDetail?.my_responder_status;
  const expressedInterest = status?.expressed_interest ?? false;
  const shortlisted = status?.shortlisted ?? false;
  const declined = status?.declined ?? false;
  const intent = sessionDetail?.intent ?? sessionDetail?.inquiry?.intent ?? routeSession?.intent ?? 'buy';
  const posterLabel = sessionDetail?.poster_label ?? routeSession?.posterLabel ?? 'a supplier';
  // Bidding ended only when the bidding deadline (expires_at) has passed, so it matches the countdown.
  // When we have expires_at, use it only; otherwise fall back to locked_at for legacy API.
  const isLocked = sessionDetail?.expires_at
    ? new Date(sessionDetail.expires_at) <= new Date()
    : (sessionDetail?.locked_at ? new Date(sessionDetail.locked_at) <= new Date() : false);

  const summaryTitle = sessionDetail?.inquiry?.title ?? matchmakingData?.inquiry?.title ?? routeSession?.title ?? 'Requirement';
  const summarySubtitle = useMemo(() => {
    const items = matchmakingData?.inquiry?.items ?? sessionDetail?.inquiry?.items;
    if (items?.length) {
      return items
        .map((i) => `${i.quantity ?? ''} ${i.quantity_unit ?? ''} ${i.material_category ?? ''}`.trim())
        .join(', ');
    }
    return routeSession?.specifications ?? 'No details';
  }, [matchmakingData?.inquiry?.items, sessionDetail?.inquiry?.items, routeSession?.specifications]);

  const countdown = useMemo(() => {
    if (matchmakingData?.countdown) {
      const { hours, minutes, seconds } = matchmakingData.countdown;
      return { hours, mins: minutes, secs: seconds };
    }
    return null;
  }, [matchmakingData?.countdown]);

  const [liveCountdown, setLiveCountdown] = useState(countdown);
  useEffect(() => {
    setLiveCountdown(countdown);
    if (!countdown) return;
    const t = setInterval(() => {
      setLiveCountdown((prev) => {
        if (!prev) return null;
        let { hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else if (mins > 0) {
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
    return () => clearInterval(t);
  }, [countdown]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleInterested = useCallback(() => {
    if (!inquiryId) return;
    expressInterest.mutate(inquiryId, {
      onSuccess: () => refetch(),
    });
  }, [inquiryId, expressInterest, refetch]);

  const handleNotInterested = useCallback(() => {
    if (!inquiryId) return;
    declineInquiry.mutate(inquiryId, {
      onSuccess: () => refetch(),
    });
  }, [inquiryId, declineInquiry, refetch]);

  const handleChat = useCallback(() => {
    navigation.navigate(SCREENS.SESSIONS.CHAT, {
      sessionId,
      partnerId: '',
      partnerName: posterLabel,
      inquiryRef: String(inquiryId),
    });
  }, [navigation, sessionId, inquiryId, posterLabel]);

  if (isLoading && !sessionDetail) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <AppIcon.ArrowLeft width={20} height={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Match for you</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.posterLine}>
          <Text style={styles.posterLineText}>Posted by {posterLabel}</Text>
        </View>

        <View style={[styles.intentBadge, intent === 'sell' ? styles.intentBadgeSell : styles.intentBadgeBuy]}>
          <Text style={[styles.intentBadgeText, intent === 'sell' ? styles.intentBadgeTextSell : styles.intentBadgeTextBuy]}>
            {intent === 'sell' ? 'Post to sell' : 'Post to buy'}
          </Text>
        </View>

        <RequirementSummaryCard
          title={summaryTitle}
          subtitle={summarySubtitle}
          countdown={liveCountdown ?? undefined}
        />

        {isLocked && (
          <Text style={styles.lockedText}>Bidding has ended for this requirement.</Text>
        )}

        {!isLocked && (
          <>
            {shortlisted && (
              <View style={styles.actionSection}>
                <View style={styles.statusBox}>
                  <Text style={styles.statusText}>You're shortlisted. You can chat with the poster now.</Text>
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={handleChat} activeOpacity={0.8}>
                  <AppIcon.Messages width={20} height={20} color="#FFF" />
                  <Text style={styles.primaryButtonText}>Chat</Text>
                </TouchableOpacity>
              </View>
            )}

            {expressedInterest && !shortlisted && (
              <View style={styles.actionSection}>
                <View style={styles.statusBox}>
                  <Text style={styles.statusText}>Waiting for poster to shortlist you. You'll be notified when they do.</Text>
                </View>
              </View>
            )}

            {declined && (
              <View style={styles.actionSection}>
                <View style={styles.statusBox}>
                  <Text style={styles.statusText}>You're not interested in this requirement.</Text>
                </View>
              </View>
            )}

            {!expressedInterest && !shortlisted && !declined && (
              <View style={styles.actionSection}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleInterested}
                  disabled={expressInterest.isPending}
                  activeOpacity={0.8}
                >
                  {expressInterest.isPending ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <AppIcon.Process width={20} height={20} color="#FFF" />
                      <Text style={styles.primaryButtonText}>Interested</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleNotInterested}
                  disabled={declineInquiry.isPending}
                  activeOpacity={0.8}
                >
                  {declineInquiry.isPending ? (
                    <ActivityIndicator size="small" color={theme.colors.text.secondary} />
                  ) : (
                    <>
                      <Text style={styles.secondaryButtonText}>Not interested</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
