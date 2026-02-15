/**
 * ResponderDetailsScreen
 * Dedicated screen for responders: view requirement, express interest or decline.
 * Uses responder-detail API. On Interested, opens modal for approx price (INR) + description.
 */

import React, { useCallback, useMemo, useState } from 'react';
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
  useGetResponderDetail,
  useGetMatchmakingResponses,
  useExpressInterest,
  useDeclineInquiry,
} from '@services/api';
import { ElapsedTimer } from '../../components/ElapsedTimer';
import { InterestedModal } from './InterestedModal';
import { ResponderDetailsParams } from './@types';
import { createStyles } from './styles';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function ResponderDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<{ params?: ResponderDetailsParams }>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const [interestedModalVisible, setInterestedModalVisible] = useState(false);

  const params = route.params?.params ?? route.params;
  const { sessionId, session: routeSession } = params ?? {};
  const sessionIdNum = sessionId ? Number(sessionId) : 0;

  const { data: sessionDetail, isLoading: isLoadingSession, refetch: refetchSession } = useGetSessionDetail(sessionIdNum, {
    enabled: !!sessionIdNum,
  });

  const { data: responderDetail, isLoading: isLoadingResponder, refetch: refetchResponder } = useGetResponderDetail(sessionIdNum, {
    enabled: !!sessionIdNum,
  });

  const inquiryId = responderDetail?.inquiry_id ?? sessionDetail?.inquiry?.id ?? (routeSession?.inquiryId ? parseInt(String(routeSession.inquiryId).replace(/\D/g, ''), 10) : 0);
  const { data: matchmakingData } = useGetMatchmakingResponses(inquiryId, {}, { enabled: !!inquiryId && !responderDetail });

  const expressInterest = useExpressInterest();
  const declineInquiry = useDeclineInquiry();

  const status = responderDetail?.my_responder_status ?? sessionDetail?.my_responder_status;
  const expressedInterest = status?.expressed_interest ?? false;
  const shortlisted = status?.shortlisted ?? false;
  const declined = status?.declined ?? false;
  const intent = responderDetail?.intent ?? sessionDetail?.intent ?? sessionDetail?.inquiry?.intent ?? routeSession?.intent ?? 'buy';
  const posterLabel = responderDetail?.poster_label ?? sessionDetail?.poster_label ?? routeSession?.posterLabel ?? 'a supplier';

  const isLocked = useMemo(() => {
    if (responderDetail?.expires_at) return new Date(responderDetail.expires_at) <= new Date();
    if (sessionDetail?.expires_at) return new Date(sessionDetail.expires_at) <= new Date();
    if (sessionDetail?.locked_at) return new Date(sessionDetail.locked_at) <= new Date();
    return false;
  }, [responderDetail?.expires_at, sessionDetail?.expires_at, sessionDetail?.locked_at]);

  const summaryTitle = responderDetail?.title ?? sessionDetail?.inquiry?.title ?? matchmakingData?.inquiry?.title ?? routeSession?.title ?? 'Requirement';

  const requirementItems = useMemo(() => {
    const items = responderDetail?.requirement_summary?.items ?? [];
    if (items.length) {
      return items.map((i) => {
        const parts = [i.quantity, i.quantity_unit, i.material_category].filter(Boolean);
        return parts.join(' ').trim() || '—';
      }).filter(Boolean);
    }
    const fallbackItems = matchmakingData?.inquiry?.items ?? sessionDetail?.inquiry?.items ?? [];
    if (fallbackItems.length) {
      return fallbackItems.map((i: { quantity?: number; quantity_unit?: string; material_category?: string }) =>
        `${i.quantity ?? ''} ${i.quantity_unit ?? ''} ${i.material_category ?? ''}`.trim()
      ).filter(Boolean);
    }
    const spec = routeSession?.specifications;
    return spec ? [spec] : ['No details'];
  }, [responderDetail?.requirement_summary, matchmakingData?.inquiry?.items, sessionDetail?.inquiry?.items, routeSession?.specifications]);

  const createdAt = responderDetail?.created_at ?? sessionDetail?.created_at ?? null;
  const expiresAt = responderDetail?.expires_at ?? sessionDetail?.expires_at ?? null;

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleOpenInterestedModal = useCallback(() => {
    setInterestedModalVisible(true);
  }, []);

  const handleCloseInterestedModal = useCallback(() => {
    setInterestedModalVisible(false);
  }, []);

  const handleSubmitInterested = useCallback(
    (data: { approx_price: number; description: string }) => {
      if (!inquiryId) return;
      expressInterest.mutate(
        { inquiryId, approx_price: data.approx_price, description: data.description },
        {
          onSuccess: () => {
            setInterestedModalVisible(false);
            refetchResponder();
            refetchSession();
          },
        }
      );
    },
    [inquiryId, expressInterest, refetchResponder, refetchSession]
  );

  const handleNotInterested = useCallback(() => {
    if (!inquiryId) return;
    declineInquiry.mutate(inquiryId, {
      onSuccess: () => {
        refetchResponder();
        refetchSession();
      },
    });
  }, [inquiryId, declineInquiry, refetchResponder, refetchSession]);

  const handleChat = useCallback(() => {
    navigation.navigate(SCREENS.SESSIONS.CHAT, {
      sessionId,
      partnerId: '',
      partnerName: posterLabel,
      inquiryRef: String(inquiryId),
    });
  }, [navigation, sessionId, inquiryId, posterLabel]);

  const isLoading = isLoadingSession || isLoadingResponder;
  if (isLoading && !responderDetail && !sessionDetail) {
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
        contentContainerStyle={styles.responderContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: Someone wants to buy/sell + Posted by */}
        <View style={[styles.responderHero, intent === 'sell' ? styles.responderHeroSell : styles.responderHeroBuy]}>
          <Text style={[styles.responderHeroHeadline, intent === 'sell' ? styles.responderHeroHeadlineSell : styles.responderHeroHeadlineBuy]}>
            {intent === 'sell' ? 'Someone wants to sell' : 'Someone wants to buy'}
          </Text>
          <Text style={styles.responderHeroByline}>Posted by {posterLabel}</Text>
        </View>

        {/* What they're looking for – requirement block with list */}
        <Text style={styles.responderSectionLabel}>What they're looking for</Text>
        <View style={styles.responderRequirementBlock}>
          <Text style={styles.responderRequirementTitle} numberOfLines={2}>
            {summaryTitle}
          </Text>
          <View style={styles.responderRequirementList}>
            {requirementItems.map((line, index) => (
              <View key={index} style={styles.responderRequirementRow}>
                <View style={styles.responderRequirementRowBullet} />
                <Text style={styles.responderRequirementRowText} numberOfLines={2}>{line}</Text>
              </View>
            ))}
          </View>
          <View style={styles.responderMeta}>
            <Text style={styles.responderMetaText}>Posted {formatDate(createdAt)}</Text>
            {expiresAt && (
              <Text style={styles.responderMetaText}>Expires {formatDate(expiresAt)}</Text>
            )}
          </View>
        </View>

        {/* Time since post (elapsed, counts up to 24h or backend end) */}
        {!isLocked && createdAt && (
          <View style={styles.responderTimerWrap}>
            <ElapsedTimer
              startDate={createdAt}
              endDate={expiresAt ?? undefined}
              label="Time since post"
              showLabel
            />
          </View>
        )}

        {isLocked && (
          <Text style={styles.lockedText}>Session has ended for this requirement.</Text>
        )}

        {/* Your response */}
        {!isLocked && (
          <>
            <Text style={styles.responderActionsTitle}>Your response</Text>
            <View style={styles.responderActionsSection}>
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
                    onPress={handleOpenInterestedModal}
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
                      <Text style={styles.secondaryButtonText}>Not interested</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <InterestedModal
        visible={interestedModalVisible}
        onClose={handleCloseInterestedModal}
        onSubmit={handleSubmitInterested}
        isSubmitting={expressInterest.isPending}
      />
    </ScreenWrapper>
  );
}
