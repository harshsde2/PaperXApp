/**
 * PosterDetailView
 * Full-screen poster detail: requirement summary and counts only. No response list, no names.
 * Uses data from poster-detail API; layout is fuller so the page does not look empty.
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { FullScreenImageModal } from '@shared/components/FullScreenImageModal';
import type { PosterDetailResponse, JobworkDetails } from '@services/api';
import { createStyles } from '../styles';

const JOBWORK_FIND_INQUIRY_TYPE = 'jobwork_find';

function getIntentBadgeLabel(data: PosterDetailResponse): string {
  if (data.jobwork_mode === 'find') return 'Jobwork – find work';
  if (data.jobwork_mode === 'give') return 'Jobwork – give work';
  return data.intent === 'sell' ? 'Wants to sell' : 'Wants to buy';
}

function buildJobworkDetailLines(j: JobworkDetails): { label: string; value: string }[] {
  const lines: { label: string; value: string }[] = [];
  const v = (x: string | number | null | undefined) => (x != null && String(x).trim() !== '' ? String(x).trim() : null);
  if (v(j.jobwork_type)) lines.push({ label: 'Jobwork type', value: v(j.jobwork_type)! });
  if (j.mode === 'find') {
    if (v(j.machinery_available)) lines.push({ label: 'Machinery', value: v(j.machinery_available)! });
    if (v(j.location)) lines.push({ label: 'Location', value: v(j.location)! });
    else if (v(j.city)) lines.push({ label: 'Location', value: v(j.city)! });
    if (j.quantity != null && String(j.quantity).trim() !== '') lines.push({ label: 'Min order', value: `${j.quantity} ${j.quantity_unit ?? 'pieces'}`.trim() });
    if (v(j.timeline)) lines.push({ label: 'Timeline', value: v(j.timeline)! });
    if (v(j.special_instructions)) lines.push({ label: 'Special instructions', value: v(j.special_instructions)! });
  } else {
    if (j.quantity != null && String(j.quantity).trim() !== '') lines.push({ label: 'Quantity', value: `${j.quantity} ${j.quantity_unit ?? 'pieces'}`.trim() });
    if (v(j.raw_materials)) lines.push({ label: 'Raw materials', value: v(j.raw_materials)! });
    if (v(j.size)) lines.push({ label: 'Size', value: [v(j.size), v(j.size_unit)].filter(Boolean).join(' ') || v(j.size)! });
    if (v(j.thickness)) lines.push({ label: 'Thickness', value: [v(j.thickness), v(j.thickness_unit)].filter(Boolean).join(' ') || v(j.thickness)! });
    if (v(j.grade_finish)) lines.push({ label: 'Grade / finish', value: v(j.grade_finish)! });
    if (v(j.quality_requirements)) lines.push({ label: 'Quality', value: v(j.quality_requirements)! });
    if (v(j.other_instructions)) lines.push({ label: 'Other instructions', value: v(j.other_instructions)! });
    if (v(j.timeline)) lines.push({ label: 'Timeline', value: v(j.timeline)! });
    if (v(j.location)) lines.push({ label: 'Delivery location', value: v(j.location)! });
  }
  return lines;
}

export interface PosterDetailViewProps {
  data: PosterDetailResponse | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  refreshing: boolean;
  onOpenResponsesChat: () => void;
}

// For poster (owner) we show "You posted this" instead of role label
const posterBadgeLabel = 'You posted this';

function formatCreatedAt(iso: string | null): string {
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

export const PosterDetailView: React.FC<PosterDetailViewProps> = ({
  data,
  isLoading,
  onRefresh,
  refreshing,
  onOpenResponsesChat,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [sampleImageFullScreenVisible, setSampleImageFullScreenVisible] = useState(false);
  const [referenceImageFullScreenVisible, setReferenceImageFullScreenVisible] = useState(false);

  if (isLoading && !data) {
    return (
      <View style={styles.posterDetailLoading}>
        <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
        <Text style={styles.posterDetailLoadingText}>Loading...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.posterDetailEmpty}>
        <Text style={styles.posterDetailEmptyText}>No details available</Text>
      </View>
    );
  }

  const intentLabel = getIntentBadgeLabel(data);
  const summary = data.requirement_summary;
  const jobwork = data.jobwork;
  const subtitleParts = summary.items?.length
    ? summary.items.map(
        (i) =>
          `${i.quantity ?? ''} ${i.quantity_unit ?? ''} ${i.material_category ?? ''}`.trim()
      ).filter(Boolean)
    : [summary.material, `${summary.quantity ?? ''} ${summary.quantity_unit ?? ''}`].filter(Boolean);
  const subtitle = subtitleParts.length ? subtitleParts.join(' • ') : data.title;
  const isJobworkFind = data.inquiry_type === JOBWORK_FIND_INQUIRY_TYPE;
  const sampleImageUrl = data.sample_image_url ?? null;
  const showSampleImage = isJobworkFind && !!sampleImageUrl;
  const referenceImageUrl = data.reference_image_url ?? null;

  const jobworkDetailLines = jobwork ? buildJobworkDetailLines(jobwork) : [];

  return (
    <ScrollView
      style={styles.posterDetailScroll}
      contentContainerStyle={styles.posterDetailContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary.DEFAULT}
        />
      }
    >
      {/* You posted this & Intent */}
      <View style={styles.posterDetailBadges}>
        <View style={styles.posterDetailBadge}>
          <AppIcon.Organization width={16} height={16} color={theme.colors.primary.DEFAULT} />
          <Text style={styles.posterDetailBadgeText}>{posterBadgeLabel}</Text>
        </View>
        <View
          style={[
            styles.posterDetailBadge,
            data.intent === 'sell' ? styles.posterDetailBadgeSell : styles.posterDetailBadgeBuy,
          ]}
        >
          <Text style={styles.posterDetailIntentText}>{intentLabel}</Text>
        </View>
      </View>

      {/* Requirement block – larger card */}
      <View style={styles.posterDetailCard}>
        <Text style={styles.posterDetailCardLabel}>Your requirement</Text>
        <Text style={styles.posterDetailCardTitle} numberOfLines={2}>
          {data.title}
        </Text>
        <Text style={styles.posterDetailCardSubtitle}>{subtitle}</Text>
        {summary.urgency && summary.urgency !== 'normal' && (
          <View style={styles.posterDetailUrgency}>
            <Text style={styles.posterDetailUrgencyText}>
              {summary.urgency === 'urgent' ? 'Urgent' : summary.urgency}
            </Text>
          </View>
        )}
        <View style={styles.posterDetailMeta}>
          <AppIcon.Inquiries width={14} height={14} color={theme.colors.text.tertiary} />
          <Text style={styles.posterDetailMetaText}>
            Posted on {formatCreatedAt(data.created_at)}
          </Text>
        </View>
      </View>

      {/* Jobwork details (when jobwork payload present) */}
      {jobwork && jobworkDetailLines.length > 0 && (
        <View style={styles.posterDetailCard}>
          <Text style={styles.posterDetailCardLabel}>Jobwork details</Text>
          {jobworkDetailLines.map((line, idx) => (
            <View key={idx} style={{ marginBottom: theme.spacing[2] }}>
              <Text style={[styles.posterDetailCardSubtitle, { marginBottom: 2 }]} numberOfLines={2}>
                <Text style={{ fontWeight: '600', color: theme.colors.text.primary }}>{line.label}: </Text>
                {line.value}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Jobwork find: sample image (only when inquiry is jobwork_find and has sample_image_url) */}
      {showSampleImage && sampleImageUrl && (
        <View style={styles.posterDetailSampleImageSection}>
          <Text style={styles.posterDetailSampleImageLabel}>Sample image</Text>
          <TouchableOpacity
            style={styles.posterDetailSampleImageThumbnailWrap}
            onPress={() => setSampleImageFullScreenVisible(true)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: sampleImageUrl }} style={styles.posterDetailSampleImageThumbnail} resizeMode="cover" />
          </TouchableOpacity>
        </View>
      )}

      {/* Brand reference image (optional) */}
      {referenceImageUrl && (
        <View style={styles.posterDetailSampleImageSection}>
          <Text style={styles.posterDetailSampleImageLabel}>Reference image</Text>
          <TouchableOpacity
            style={styles.posterDetailSampleImageThumbnailWrap}
            onPress={() => setReferenceImageFullScreenVisible(true)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: referenceImageUrl }} style={styles.posterDetailSampleImageThumbnail} resizeMode="cover" />
          </TouchableOpacity>
        </View>
      )}

      {/* Counts section */}
      <Text style={styles.posterDetailCountsTitle}>Reach & responses</Text>
      <View style={styles.posterDetailCountsRow}>
        <View style={styles.posterDetailCountCard}>
          <View style={styles.posterDetailCountIconWrap}>
            <AppIcon.Market width={24} height={24} color={theme.colors.primary.DEFAULT} />
          </View>
          <Text style={styles.posterDetailCountValue}>{data.reached_count}</Text>
          <Text style={styles.posterDetailCountLabel}>Reached</Text>
        </View>
        <View style={styles.posterDetailCountCard}>
          <View style={styles.posterDetailCountIconWrap}>
            <AppIcon.Messages width={24} height={24} color={theme.colors.primary.DEFAULT} />
          </View>
          <Text style={styles.posterDetailCountValue}>{data.responses_count}</Text>
          <Text style={styles.posterDetailCountLabel}>Responses</Text>
        </View>
      </View>
      {data.responses_count > 0 && (
        <TouchableOpacity
          style={styles.posterDetailChatButton}
          onPress={onOpenResponsesChat}
          activeOpacity={0.8}
        >
          <Text style={styles.posterDetailChatButtonText}>Open responder chats</Text>
        </TouchableOpacity>
      )}
      {showSampleImage && sampleImageUrl && (
        <FullScreenImageModal
          visible={sampleImageFullScreenVisible}
          imageUrl={sampleImageUrl}
          onClose={() => setSampleImageFullScreenVisible(false)}
        />
      )}
      {referenceImageUrl && (
        <FullScreenImageModal
          visible={referenceImageFullScreenVisible}
          imageUrl={referenceImageUrl}
          onClose={() => setReferenceImageFullScreenVisible(false)}
        />
      )}
    </ScrollView>
  );
};
