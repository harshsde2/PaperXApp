import React, { useState, useMemo, useCallback, useRef, memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { AppIcon } from '@assets/svgs';
import { useTheme, Theme } from '@theme/index';
import { MaterialSpecsScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useGetMaterialFinishesInfinite, MaterialFinish } from '@services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const END_REACHED_THRESHOLD = 0.2;

interface SpecItemProps {
  finish: MaterialFinish;
  isSelected: boolean;
  onToggle: (finishId: number) => void;
  styles: ReturnType<typeof createStyles>;
  theme: Theme;
}

const SpecItem = memo(
  ({ finish, isSelected, onToggle, styles, theme }: SpecItemProps) => {
    const handlePress = useCallback(() => {
      onToggle(finish.id);
    }, [finish.id, onToggle]);

    return (
      <TouchableOpacity
        style={[styles.materialItem, { paddingLeft: theme.spacing[4] }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.materialItemContent}>
          <Text variant="bodyMedium" style={styles.materialItemName}>
            {finish.name}
          </Text>
        </View>
        {isSelected ? (
          <AppIcon.TickCheckedBox
            width={24}
            height={24}
            color={theme.colors.primary.DEFAULT}
          />
        ) : (
          <AppIcon.UntickCheckedBox
            width={24}
            height={24}
            color={theme.colors.text.primary}
          />
        )}
      </TouchableOpacity>
    );
  },
);

SpecItem.displayName = 'SpecItem';

const MaterialSpecsScreen = () => {
  const navigation = useNavigation<MaterialSpecsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'MaterialSpecs'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  // Get params from route
  const { onSpecsSelected, materialKey, onBrandDetailsSelected } = route.params || {};

  // Fetch material finishes from API with pagination (no material_id needed)
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMaterialFinishesInfinite(50);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Set<number>>(new Set());
  const [customInput, setCustomInput] = useState('');

  const isLoadingMoreRef = useRef(false);
  const scrollViewRef = useRef<FlatList>(null);

  // Flatten all pages into a single array and deduplicate
  const allFinishes = useMemo(() => {
    if (!data?.pages) return [];
    const allFinishesList = data.pages.flatMap(page => page.finishes);
    
    // Deduplicate by name (normalized) to avoid duplicates across pages
    const finishesMap = new Map<string, MaterialFinish>();
    allFinishesList.forEach(finish => {
      const key = (finish.name || '').toLowerCase().trim();
      if (!finishesMap.has(key)) {
        finishesMap.set(key, finish);
      }
    });
    
    return Array.from(finishesMap.values());
  }, [data?.pages]);

  const toggleOption = useCallback((finishId: number) => {
    setSelectedOptions(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(finishId)) {
        newSelected.delete(finishId);
      } else {
        newSelected.add(finishId);
      }
      return newSelected;
    });
  }, []);

  const isSelected = useCallback(
    (finishId: number) => selectedOptions.has(finishId),
    [selectedOptions],
  );

  // Filter finishes based on search query
  const filteredFinishes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allFinishes;
    
    return allFinishes.filter(finish =>
      finish.name.toLowerCase().includes(query)
    );
  }, [allFinishes, searchQuery]);

  const totalSelectedCount = selectedOptions.size;

  // //todo: add custom specs to the material specs data
  // totalSelectedCount = 1

  const handleClearAll = useCallback(() => {
    setSelectedOptions(new Set());
  }, []);

  const handleConfirm = useCallback(() => {
    // Prepare selected finishes data
    const selectedFinishes = Array.from(selectedOptions).map(id => {
      const finish = allFinishes.find(f => f.id === id);
      return {
        id: finish?.id,
        name: finish?.name,
        type: finish?.type,
      };
    });

    const materialSpecsData = {
      finish_ids: selectedFinishes.filter(f => f.type === 'finish').map(f => f.id).filter((id): id is number => id !== undefined),
      coating_ids: selectedFinishes.filter(f => f.type === 'coating').map(f => f.id).filter((id): id is number => id !== undefined),
      surface_ids: selectedFinishes.filter(f => f.type === 'surface').map(f => f.id).filter((id): id is number => id !== undefined),
      grade_ids: selectedFinishes.filter(f => f.type === 'grade').map(f => f.id).filter((id): id is number => id !== undefined),
      variant_ids: selectedFinishes.filter(f => f.type === 'variant').map(f => f.id).filter((id): id is number => id !== undefined),
      custom_specs: customInput.trim() ? [customInput.trim()] : [],
    };

    if (onSpecsSelected) {
      // Called from Materials screen via callback (after thickness selection)
      onSpecsSelected(materialSpecsData);
      
      // If onBrandDetailsSelected is provided, navigate to MillBrandDetailsScreen
      if (onBrandDetailsSelected) {
        navigation.navigate(SCREENS.AUTH.MILL_BRAND_DETAILS, {
          onBrandDetailsSelected,
          materialKey,
        });
        return;
      }
      
      // Otherwise, close both modals and return to MaterialsScreen
      if (navigation.canGoBack()) {
        navigation.pop(2);
      } else {
        navigation.goBack();
      }
      return;
    }

    // Fallback: existing flow if no callback is provided
    navigation.goBack();
  }, [selectedOptions, allFinishes, customInput, onSpecsSelected, onBrandDetailsSelected, materialKey, navigation]);

  const handleAddCustom = () => {
    if (customInput.trim()) {
      // Custom specs are stored separately, not as finish IDs
      // They'll be included in the material_specs.custom_specs array
      setCustomInput('');
    }
  };

  const handleLoadMore = useCallback(() => {
    if (isLoadingMoreRef.current || isFetchingNextPage) {
      return;
    }

    const canLoadMore = hasNextPage !== false;

    if (!canLoadMore) {
      return;
    }

    isLoadingMoreRef.current = true;

    fetchNextPage().catch(error => {
      console.error('Error fetching next page:', error);
      isLoadingMoreRef.current = false;
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  React.useEffect(() => {
    if (!isFetchingNextPage) {
      const timer = setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isFetchingNextPage]);

  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      if (!contentSize.height || !layoutMeasurement.height) {
        return;
      }

      const distanceFromEnd =
        contentSize.height - (layoutMeasurement.height + contentOffset.y);
      const paddingToBottom = 500;

      const isCloseToBottom = distanceFromEnd < paddingToBottom;
      const canLoadMore =
        (hasNextPage !== false) &&
        !isFetchingNextPage &&
        !isLoadingMoreRef.current;

      if (isCloseToBottom && canLoadMore) {
        handleLoadMore();
      }
    },
    [hasNextPage, isFetchingNextPage, handleLoadMore],
  );

  const renderItem: ListRenderItem<MaterialFinish> = useCallback(
    ({ item }) => {
      return (
        <SpecItem
          finish={item}
          isSelected={isSelected(item.id)}
          onToggle={toggleOption}
          styles={styles}
          theme={theme}
        />
      );
    },
    [styles, theme, isSelected, toggleOption],
  );

  const keyExtractor = useCallback((item: MaterialFinish) => `finish-${item.id}`, []);

  const ListFooterComponent = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View
          style={{ paddingVertical: theme.spacing[4], alignItems: 'center' }}
        >
          <ActivityIndicator
            size="small"
            color={theme.colors.primary.DEFAULT}
          />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, theme]);

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={{ paddingVertical: theme.spacing[8], alignItems: 'center' }}>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.text.tertiary }}
        >
          {searchQuery
            ? 'No specs found matching your search'
            : 'No specs available'}
        </Text>
      </View>
    );
  }, [isLoading, searchQuery, theme]);

  const buttonHeight = 100;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  if (isLoading) {
    return (
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
      >
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <ActivityIndicator
            size="large"
            color={theme.colors.primary.DEFAULT}
          />
          <Text
            variant="bodyMedium"
            style={{
              marginTop: theme.spacing[4],
              color: theme.colors.text.secondary,
            }}
          >
            Loading specs...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
      >
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.error.DEFAULT,
              marginBottom: theme.spacing[4],
            }}
          >
            Failed to load specs
          </Text>
          <TouchableOpacity
            style={[styles.button, { paddingHorizontal: theme.spacing[6] }]}
            onPress={() => refetch()}
          >
            <Text variant="buttonMedium" style={styles.buttonText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <>
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
      >
        <View style={[styles.container, { paddingBottom: bottomPadding }]}>
          <Text variant="h3" fontWeight="bold" style={styles.title}>
            Select Finishes / Coating / Grade / Variant
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Specify technical attributes for your request. Multiple selections allowed.
          </Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <AppIcon.Search
                width={20}
                height={20}
                color={theme.colors.text.tertiary}
              />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search specs (e.g., Gloss, Coated)"
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            ref={scrollViewRef}
            data={filteredFinishes}
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
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={50}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
          />

          {/* <Card style={styles.card}>
            <View style={styles.customInputSection}>
              <View style={styles.customInputLabel}>
                <Text style={{ fontSize: 16 }}>✏️</Text>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.sectionTitle}>
                  Can't find what you need?
                </Text>
              </View>
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  placeholder="Type specific grade or finish..."
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={customInput}
                  onChangeText={setCustomInput}
                />
                <TouchableOpacity onPress={handleAddCustom} activeOpacity={0.7} style={styles.addButton}>
                  <Text style={{ fontSize: 20, color: theme.colors.primary.DEFAULT }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card> */}
        </View>
      </ScreenWrapper>

      <FloatingBottomContainer>
        <View style={styles.footerTop}>
          <Text variant="bodyMedium" style={styles.footerItemCount}>
            {totalSelectedCount} item{totalSelectedCount !== 1 ? 's' : ''} selected
          </Text>
          {totalSelectedCount > 0 && (
            <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7} style={styles.clearAllButton}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.clearAllButtonText}>
                Clear all
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.confirmButton, totalSelectedCount === 0 && { opacity: 0.5 }]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={totalSelectedCount === 0}
        >
          <Text variant="buttonMedium" style={styles.confirmButtonText}>
            Confirm Selection
          </Text>
          <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />
        </TouchableOpacity>
      </FloatingBottomContainer>
    </>
  );
};

export default MaterialSpecsScreen;
