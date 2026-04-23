/**
 * ResponderDetailsScreen
 * Dedicated screen for responders: view requirement, express interest or decline.
 * Uses responder-detail API. On Interested, opens modal for approx price (INR) + description.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { DetailSkeleton } from '@shared/components/skeletons';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import {
  useGetSessionDetail,
  useGetResponderDetail,
  useGetMatchmakingResponses,
  useExpressInterest,
  useDeclineInquiry,
  useOpenStructuredThread,
} from '@services/api';
import type { JobworkDetails } from '@services/api';
import { FullScreenImageModal } from '@shared/components/FullScreenImageModal';
import { ElapsedTimer } from '../../components/ElapsedTimer';
import { InterestedModal } from './InterestedModal';
import { ResponderDetailsParams } from './@types';
import { createStyles } from './styles';

const JOBWORK_FIND_INQUIRY_TYPE = 'jobwork_find';

function buildJobworkDetailLines(j: JobworkDetails): string[] {
  const lines: string[] = [];
  const v = (x: string | number | null | undefined) => (x != null && String(x).trim() !== '' ? String(x).trim() : null);
  if (v(j.jobwork_type)) lines.push(`Jobwork type: ${v(j.jobwork_type)}`);
  if (j.mode === 'find') {
    if (v(j.machinery_available)) lines.push(`Machinery: ${v(j.machinery_available)}`);
    if (v(j.location)) lines.push(`Location: ${v(j.location)}`);
    else if (v(j.city)) lines.push(`Location: ${v(j.city)}`);
    if (j.quantity != null && String(j.quantity).trim() !== '') lines.push(`Min order: ${j.quantity} ${j.quantity_unit ?? 'pieces'}`.trim());
    if (v(j.timeline)) lines.push(`Timeline: ${v(j.timeline)}`);
    if (v(j.special_instructions)) lines.push(`Special instructions: ${v(j.special_instructions)}`);
  } else {
    if (j.quantity != null && String(j.quantity).trim() !== '') lines.push(`Quantity: ${j.quantity} ${j.quantity_unit ?? 'pieces'}`.trim());
    if (v(j.raw_materials)) lines.push(`Raw materials: ${v(j.raw_materials)}`);
    if (v(j.size)) lines.push(`Size: ${[v(j.size), v(j.size_unit)].filter(Boolean).join(' ') || v(j.size)}`);
    if (v(j.thickness)) lines.push(`Thickness: ${[v(j.thickness), v(j.thickness_unit)].filter(Boolean).join(' ') || v(j.thickness)}`);
    if (v(j.grade_finish)) lines.push(`Grade / finish: ${v(j.grade_finish)}`);
    if (v(j.quality_requirements)) lines.push(`Quality: ${v(j.quality_requirements)}`);
    if (v(j.other_instructions)) lines.push(`Other instructions: ${v(j.other_instructions)}`);
    if (v(j.timeline)) lines.push(`Timeline: ${v(j.timeline)}`);
    if (v(j.location)) lines.push(`Delivery location: ${v(j.location)}`);
  }
  return lines;
}

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
  const [isRefreshingAfterInterest, setIsRefreshingAfterInterest] = useState(false);
  const [sampleImageFullScreenVisible, setSampleImageFullScreenVisible] = useState(false);

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
  const openStructuredThread = useOpenStructuredThread();

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

  const jobworkMode = responderDetail?.jobwork_mode;
  const jobwork = responderDetail?.jobwork;

  const requirementItems = useMemo(() => {
    if (jobwork && Object.keys(jobwork).length > 0) {
      const jobworkLines = buildJobworkDetailLines(jobwork);
      if (jobworkLines.length > 0) return jobworkLines;
    }
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
  }, [jobwork, responderDetail?.requirement_summary, matchmakingData?.inquiry?.items, sessionDetail?.inquiry?.items, routeSession?.specifications]);

  const createdAt = responderDetail?.created_at ?? sessionDetail?.created_at ?? null;
  const expiresAt = responderDetail?.expires_at ?? sessionDetail?.expires_at ?? null;

  const isJobworkFind = responderDetail?.inquiry_type === JOBWORK_FIND_INQUIRY_TYPE;
  const sampleImageUrl = responderDetail?.sample_image_url ?? null;
  const showSampleImage = isJobworkFind && !!sampleImageUrl;

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleOpenInterestedModal = useCallback(() => {
    setInterestedModalVisible(true);
  }, []);

  const handleCloseInterestedModal = useCallback(() => {
    setInterestedModalVisible(false);
  }, []);

  const handleSubmitInterested = useCallback(
    async (data: { approx_price?: number; description?: string }) => {
      if (!inquiryId || expressInterest.isPending || isRefreshingAfterInterest) return;
      setIsRefreshingAfterInterest(true);
      try {
        await expressInterest.mutateAsync({
          inquiryId,
          ...(data.approx_price != null ? { approx_price: data.approx_price } : {}),
          ...(data.description ? { description: data.description } : {}),
        });
        setInterestedModalVisible(false);
        await Promise.allSettled([refetchResponder(), refetchSession()]);
      } finally {
        setIsRefreshingAfterInterest(false);
      }
    },
    [inquiryId, expressInterest, isRefreshingAfterInterest, refetchResponder, refetchSession]
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
    if (!inquiryId) return;
    openStructuredThread.mutate(inquiryId, {
      onSuccess: (result) => {
        navigation.navigate(SCREENS.SESSIONS.STRUCTURED_CHAT, {
          threadId: String(result.thread_id),
          inquiryId: String(inquiryId),
          partnerName: posterLabel,
        });
      },
    });
  }, [navigation, inquiryId, posterLabel, openStructuredThread]);

  const isLoading = isLoadingSession || isLoadingResponder;
  const showSkeleton = useSkeleton(isLoading && !responderDetail && !sessionDetail);
  const isInterestFlowLoading = expressInterest.isPending || isRefreshingAfterInterest;
  if (showSkeleton) {
    return (
      <ScreenWrapper>
        <DetailSkeleton />
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
        {/* Hero: jobwork-specific or buy/sell + Posted by */}
        <View style={[styles.responderHero, intent === 'sell' ? styles.responderHeroSell : styles.responderHeroBuy]}>
          <Text style={[styles.responderHeroHeadline, intent === 'sell' ? styles.responderHeroHeadlineSell : styles.responderHeroHeadlineBuy]}>
            {jobworkMode === 'find'
              ? 'Converter is looking for jobwork'
              : jobworkMode === 'give'
                ? 'Converter wants to outsource jobwork'
                : intent === 'sell'
                  ? 'Someone wants to sell'
                  : 'Someone wants to buy'}
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

        {/* Jobwork find: sample image (only when inquiry is jobwork_find and has sample_image_url) */}
        {showSampleImage && sampleImageUrl && (
          <View style={styles.sampleImageSection}>
            <Text style={styles.responderSectionLabel}>Sample image</Text>
            <TouchableOpacity
              style={styles.sampleImageThumbnailWrap}
              onPress={() => setSampleImageFullScreenVisible(true)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: sampleImageUrl }} style={styles.sampleImageThumbnail} resizeMode="cover" />
            </TouchableOpacity>
          </View>
        )}

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
              {(expressedInterest || shortlisted) && !declined && (
                <View style={styles.actionSection}>
                  <View style={styles.statusBox}>
                    <Text style={styles.statusText}>
                      Your response is submitted. Open chat with the poster.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleChat}
                    disabled={openStructuredThread.isPending}
                    activeOpacity={0.8}
                  >
                    {openStructuredThread.isPending ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <AppIcon.Messages width={20} height={20} color="#FFF" />
                        <Text style={styles.primaryButtonText}>Chat</Text>
                      </>
                    )}
                  </TouchableOpacity>
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
                  {isInterestFlowLoading && !interestedModalVisible ? (
                    <View style={styles.statusBox}>
                      <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                      <Text style={styles.statusText}>
                        Submitting your response...
                      </Text>
                    </View>
                  ) : (
                    <>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleOpenInterestedModal}
                    disabled={isInterestFlowLoading}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.primaryButtonText}>Interested</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleNotInterested}
                    disabled={declineInquiry.isPending || isInterestFlowLoading}
                    activeOpacity={0.8}
                  >
                    {declineInquiry.isPending ? (
                      <ActivityIndicator size="small" color={theme.colors.text.secondary} />
                    ) : (
                      <Text style={styles.secondaryButtonText}>Not interested</Text>
                    )}
                  </TouchableOpacity>
                    </>
                  )}
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
        isSubmitting={isInterestFlowLoading}
      />
      {showSampleImage && sampleImageUrl && (
        <FullScreenImageModal
          visible={sampleImageFullScreenVisible}
          imageUrl={sampleImageUrl}
          onClose={() => setSampleImageFullScreenVisible(false)}
        />
      )}
    </ScreenWrapper>
  );
}
