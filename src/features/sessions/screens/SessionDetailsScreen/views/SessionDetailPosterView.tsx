/**
 * SessionDetailPosterView
 * For the user who posted the inquiry: requirement summary, countdown, supplier responses list and filters.
 */

import React, { useCallback } from 'react';
import { View, FlatList, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { MatchResponse, MatchType } from '../../../@types';
import { RequirementSummaryCard } from '../../../components/RequirementSummaryCard';
import { MatchResponseCard } from '../../../components/MatchResponseCard';
import { FilterChip } from '../@types';
import { createStyles } from '../styles';

const FILTER_CHIPS: FilterChip[] = [
  { key: 'all', label: 'All' },
  { key: 'responded', label: 'Interested' },
  { key: 'exact_match', label: 'Exact Match' },
  { key: 'slight_variation', label: 'Slight Variation' },
  { key: 'nearest', label: 'Nearest' },
];

export interface SessionDetailPosterViewProps {
  summaryTitle: string;
  summarySubtitle: string;
  countdown: { hours: number; mins: number; secs: number } | null;
  responses: MatchResponse[];
  activeFilter: MatchType;
  onFilterChange: (filter: MatchType) => void;
  onChat: (response: MatchResponse) => void;
  onShortlist: (response: MatchResponse) => void;
  onReject: (response: MatchResponse) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export const SessionDetailPosterView: React.FC<SessionDetailPosterViewProps> = ({
  summaryTitle,
  summarySubtitle,
  countdown,
  responses,
  activeFilter,
  onFilterChange,
  onChat,
  onShortlist,
  onReject,
  onRefresh,
  refreshing,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const renderResponseCard = useCallback(
    ({ item }: { item: MatchResponse }) => (
      <View style={styles.responseCard}>
        <MatchResponseCard
          response={item}
          onChat={onChat}
          onShortlist={onShortlist}
          onReject={onReject}
        />
      </View>
    ),
    [onChat, onShortlist, onReject, styles.responseCard]
  );

  return (
    <FlatList
      data={responses}
      keyExtractor={(item) => item.id}
      renderItem={renderResponseCard}
      contentContainerStyle={styles.responseList}
      ListHeaderComponent={
        <>
          <RequirementSummaryCard
            title={summaryTitle}
            subtitle={summarySubtitle}
            countdown={countdown ?? undefined}
          />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Supplier Responses</Text>
            <Text style={styles.sectionCount}>{responses.length} found</Text>
          </View>
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
                  onPress={() => onFilterChange(chip.key)}
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
          <Text style={styles.emptyText}>No responses found for this filter.</Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary.DEFAULT}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};
