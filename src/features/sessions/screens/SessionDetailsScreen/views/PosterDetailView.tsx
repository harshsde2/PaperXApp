/**
 * PosterDetailView
 * Full-screen poster detail: requirement summary and counts only. No response list, no names.
 * Uses data from poster-detail API; layout is fuller so the page does not look empty.
 */

import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import type { PosterDetailResponse } from '@services/api';
import { createStyles } from '../styles';

export interface PosterDetailViewProps {
  data: PosterDetailResponse | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  refreshing: boolean;
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
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

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

  const intentLabel = data.intent === 'sell' ? 'Wants to sell' : 'Wants to buy';
  const summary = data.requirement_summary;
  const subtitleParts = summary.items?.length
    ? summary.items.map(
        (i) =>
          `${i.quantity ?? ''} ${i.quantity_unit ?? ''} ${i.material_category ?? ''}`.trim()
      ).filter(Boolean)
    : [summary.material, `${summary.quantity ?? ''} ${summary.quantity_unit ?? ''}`].filter(Boolean);
  const subtitle = subtitleParts.length ? subtitleParts.join(' • ') : data.title;

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
            <AppIcon.Process width={24} height={24} color={theme.colors.primary.DEFAULT} />
          </View>
          <Text style={styles.posterDetailCountValue}>{data.matches_count}</Text>
          <Text style={styles.posterDetailCountLabel}>Matches</Text>
        </View>
        <View style={styles.posterDetailCountCard}>
          <View style={styles.posterDetailCountIconWrap}>
            <AppIcon.Messages width={24} height={24} color={theme.colors.primary.DEFAULT} />
          </View>
          <Text style={styles.posterDetailCountValue}>{data.responses_count}</Text>
          <Text style={styles.posterDetailCountLabel}>Responses</Text>
        </View>
      </View>
    </ScrollView>
  );
};
