import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { useGetTodayMarketInsight } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { useNavigationHelpers } from '@navigation/helpers';
import { useAppSelector } from '@store/hooks';
import { useTheme } from '@theme/index';
import type { RootState } from '@store/index';
import {
  FILTER_CHIPS,
  getCategoryColor,
  type FilterChipItem,
  type FilterChipLabel,
  type MarketInsightArticle,
} from './@types';
import { createStyles } from './styles';
import { FilterChipRow } from './components/FilterChipRow';
import { FeaturedNewsCard } from './components/FeaturedNewsCard';
import { StandardNewsCard } from './components/StandardNewsCard';
import { NewsCardSkeleton } from './components/NewsCardSkeleton';

const formatHeadlineDate = (insightDate?: string): string => {
  const date = insightDate ? new Date(insightDate) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  }).format(safeDate);
};

const normalizeCategory = (category?: string): FilterChipLabel => {
  if (!category) {
    return 'Market Prices';
  }

  const matchedCategory = FILTER_CHIPS.find((chip) => chip === category);
  return matchedCategory && matchedCategory !== 'All' ? matchedCategory : 'Market Prices';
};

const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'PX';
  }
  return trimmed.charAt(0).toUpperCase();
};

const MarketScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const navigation = useNavigationHelpers();
  const [activeFilter, setActiveFilter] = useState<FilterChipLabel>('All');
  const user = useAppSelector((state: RootState) => state.auth.user);
  const todayInsightQuery = useGetTodayMarketInsight();
  const allArticles = todayInsightQuery.data?.articles ?? [];
  const companyName = user?.company_name || user?.companyName || 'PaperX';
  const headlineSubtitle = `${formatHeadlineDate(todayInsightQuery.data?.insight_date)} · ${allArticles.length} article${
    allArticles.length === 1 ? '' : 's'
  }`;

  const chipItems = useMemo<FilterChipItem[]>(
    () =>
      FILTER_CHIPS.map((label) => ({
        label,
        count:
          label === 'All'
            ? allArticles.length
            : allArticles.filter((article) => normalizeCategory(article.category) === label).length,
      })),
    [allArticles],
  );

  const filteredArticles = useMemo(() => {
    if (activeFilter === 'All') {
      return allArticles;
    }

    return allArticles.filter((article) => normalizeCategory(article.category) === activeFilter);
  }, [activeFilter, allArticles]);

  const handleRefresh = useCallback(() => {
    todayInsightQuery.refetch();
  }, [todayInsightQuery]);

  const handleOpenArticle = useCallback(
    (article: MarketInsightArticle) => {
      navigation.navigate(SCREENS.MAIN.ARTICLE_DETAIL, { article });
    },
    [navigation],
  );

  const renderArticleItem = useCallback(
    ({ item, index }: { item: MarketInsightArticle; index: number }) => {
      const categoryColor = getCategoryColor(theme, normalizeCategory(item.category));
      const isFeatured = index === 0 || index % 4 === 0;

      if (isFeatured) {
        return (
          <FeaturedNewsCard
            article={item}
            categoryColor={categoryColor}
            onPress={handleOpenArticle}
          />
        );
      }

      return (
        <StandardNewsCard
          article={item}
          categoryColor={categoryColor}
          onPress={handleOpenArticle}
        />
      );
    },
    [handleOpenArticle, theme],
  );

  const headerComponent = useMemo(
    () => (
      <View style={[styles.headerContainer, { paddingTop: insets.top + theme.spacing[2] }]}>
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.8} style={styles.avatarButton}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <Text variant="captionLarge" style={styles.avatarInitials}>
                {getInitials(companyName)}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.iconButton}>
            <Icon name="bell" size={18} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroBlock}>
          <Text variant="h3" style={styles.heroTitle}>
            Paper Industry Insights
          </Text>
          <Text variant="bodySmall" style={styles.heroSubtitle}>
            {headlineSubtitle}
          </Text>
        </View>

        <FilterChipRow
          chips={chipItems}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />
      </View>
    ),
    [
      activeFilter,
      chipItems,
      companyName,
      headlineSubtitle,
      insets.top,
      setActiveFilter,
      styles.avatarButton,
      styles.avatarImage,
      styles.avatarInitials,
      styles.headerContainer,
      styles.heroBlock,
      styles.heroSubtitle,
      styles.heroTitle,
      styles.iconButton,
      styles.topBar,
      theme,
      user?.avatar,
    ],
  );

  if (todayInsightQuery.isError && !todayInsightQuery.data) {
    return (
      <View style={styles.container}>
        <View style={styles.stateContainer}>
          <Text variant="h6" style={styles.stateTitle}>
            Unable to load market news
          </Text>
          <Text variant="bodySmall" style={styles.stateDescription}>
            {todayInsightQuery.error instanceof Error
              ? todayInsightQuery.error.message
              : 'Something went wrong while fetching today news feed.'}
          </Text>
          <CustomButton
            title="Try Again"
            variant="primary"
            size="md"
            onPress={handleRefresh}
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  if (todayInsightQuery.isLoading && !todayInsightQuery.data) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.loadingContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.loadingHeader, { paddingTop: insets.top + theme.spacing[2] }]}>
            <View style={styles.loadingHeaderTopRow}>
              <View>
                <Text variant="h3" style={styles.heroTitle}>
                  Paper Industry Insights
                </Text>
                <Text variant="bodySmall" style={styles.heroSubtitle}>
                  {headlineSubtitle}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.loadingCardsWrapper}>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredArticles}
        keyExtractor={(item, index) => `${item.url}_${index}`}
        renderItem={renderArticleItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        ListHeaderComponent={headerComponent}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        ListEmptyComponent={
          <View style={styles.emptyFilterContainer}>
            <Text variant="h6" style={styles.emptyFilterTitle}>
              No articles in this category today
            </Text>
            <Text variant="bodySmall" style={styles.emptyFilterSubtitle}>
              Try another filter chip or refresh to fetch the latest market coverage.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={todayInsightQuery.isRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
      />
    </View>
  );
};

export default MarketScreen;
