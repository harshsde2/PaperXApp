import React, { useMemo, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ListRenderItem,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useGetRequirementsInfinite, RequirementListItem } from '@services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyles } from './styles';

const END_REACHED_THRESHOLD = 0.2;

interface RequirementItemProps {
  requirement: RequirementListItem;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  theme: ReturnType<typeof useTheme>;
}

const RequirementItem: React.FC<RequirementItemProps> = ({
  requirement,
  onPress,
  styles,
  theme,
}) => {
  const urgencyColor =
    requirement.urgency === 'urgent'
      ? theme.colors.error?.DEFAULT || '#EF4444'
      : theme.colors.warning?.DEFAULT || '#F59E0B';

  const statusColor =
    requirement.status === 'MATCHING'
      ? theme.colors.success?.DEFAULT || '#10B981'
      : requirement.status === 'CLOSED'
      ? theme.colors.text.tertiary
      : theme.colors.primary.DEFAULT;

  const materialsText = requirement.materials
    .map((m) => m.name)
    .join(', ')
    .slice(0, 60) + (requirement.materials.length > 0 && requirement.materials[0].name.length > 60 ? '...' : '');

  return (
    <TouchableOpacity
      style={styles.requirementCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header Section */}
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <Text variant="h4" fontWeight="bold" style={styles.requirementTitle} numberOfLines={2}>
            {requirement.title}
          </Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor + '15' }]}>
              <View style={[styles.badgeDot, { backgroundColor: urgencyColor }]} />
              <Text
                variant="captionSmall"
                fontWeight="semibold"
                style={[styles.urgencyBadgeText, { color: urgencyColor }]}
              >
                {requirement.urgency.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
              <View style={[styles.badgeDot, { backgroundColor: statusColor }]} />
              <Text
                variant="captionSmall"
                fontWeight="semibold"
                style={[styles.statusBadgeText, { color: statusColor }]}
              >
                {requirement.status}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.chevronContainer}>
          <AppIcon.ChevronRight width={18} height={18} color={theme.colors.text.tertiary} />
        </View>
      </View>

      {/* Description */}
      {requirement.description && (
        <Text variant="bodyMedium" style={styles.requirementDescription} numberOfLines={2}>
          {requirement.description}
        </Text>
      )}

      {/* Materials Section */}
      {materialsText && (
        <View style={styles.materialsContainer}>
          <View style={styles.materialIconContainer}>
            <AppIcon.Market width={14} height={14} color={theme.colors.primary.DEFAULT} />
          </View>
          <Text variant="bodySmall" style={styles.materialsText} numberOfLines={1}>
            {materialsText}
          </Text>
        </View>
      )}

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text variant="captionSmall" style={styles.detailLabel}>
            Quantity
          </Text>
          <Text variant="bodySmall" fontWeight="semibold" style={styles.detailValue}>
            {requirement.quantity} {requirement.quantity_unit}
          </Text>
        </View>
        {requirement.price && (
          <View style={styles.detailItem}>
            <Text variant="captionSmall" style={styles.detailLabel}>
              Price
            </Text>
            <Text variant="bodySmall" fontWeight="semibold" style={styles.detailValue}>
              ₹{requirement.price}
              {requirement.price_negotiable && (
                <Text variant="captionSmall" style={styles.negotiableText}> (Neg.)</Text>
              )}
            </Text>
          </View>
        )}
        <View style={styles.detailItem}>
          <Text variant="captionSmall" style={styles.detailLabel}>
            Location
          </Text>
          <Text variant="bodySmall" fontWeight="semibold" style={styles.detailValue} numberOfLines={1}>
            {requirement.location}
          </Text>
        </View>
        {requirement.responses_count > 0 && (
          <View style={styles.detailItem}>
            <Text variant="captionSmall" style={styles.detailLabel}>
              Responses
            </Text>
            <View style={styles.responseBadge}>
              <Text variant="bodySmall" fontWeight="semibold" style={styles.responseCount}>
                {requirement.responses_count}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.requirementFooter}>
        <View style={styles.footerLeft}>
          <Text variant="captionSmall" style={styles.dateText}>
            Posted {new Date(requirement.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
        {requirement.responses_count > 0 && (
          <View style={styles.footerRight}>
            <View style={styles.responseIndicator} />
            <Text variant="captionSmall" style={styles.responseText}>
              {requirement.responses_count} {requirement.responses_count === 1 ? 'response' : 'responses'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const RequirementsListScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<FlatList>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useGetRequirementsInfinite();

  const allRequirements = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.requirements || []);
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleScroll = useCallback(() => {
    // Handle scroll if needed
  }, []);

  const renderItem: ListRenderItem<RequirementListItem> = useCallback(
    ({ item }) => (
      <RequirementItem
        requirement={item}
        onPress={() => {
          // Navigate to detail screen if needed
          // navigation.navigate(SCREENS.MAIN.REQUIREMENT_DETAIL, { id: item.id });
        }}
        styles={styles}
        theme={theme}
      />
    ),
    [styles, theme]
  );

  const keyExtractor = useCallback((item: RequirementListItem) => `requirement-${item.id}`, []);

  const ListFooterComponent = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, styles, theme]);

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
          <Text variant="bodyMedium" style={styles.emptyText}>
            Loading requirements...
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <AppIcon.Market width={64} height={64} color={theme.colors.text.tertiary} />
        <Text variant="h4" fontWeight="semibold" style={styles.emptyTitle}>
          No Requirements Yet
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Start by posting your first buy requirement
        </Text>
      </View>
    );
  }, [isLoading, styles, theme]);

  const bottomPadding = insets.bottom + 16;

  return (
    <ScreenWrapper backgroundColor={theme.colors.surface.secondary} safeAreaEdges={[]}>
      <View style={styles.container}>
        <FlatList
          ref={scrollViewRef}
          data={allRequirements}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottomPadding },
          ]}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          onScroll={handleScroll}
          scrollEnabled={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="always"
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[theme.colors.primary.DEFAULT]}
              tintColor={theme.colors.primary.DEFAULT}
            />
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default RequirementsListScreen;
