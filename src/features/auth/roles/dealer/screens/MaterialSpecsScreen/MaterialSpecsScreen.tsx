import React, { useState, useMemo, useCallback, useRef, memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
} from 'react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
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
  const [customSpecs, setCustomSpecs] = useState<string[]>([]);
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);

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

  const totalSelectedCount = selectedOptions.size + customSpecs.length;

  const handleClearAll = useCallback(() => {
    setSelectedOptions(new Set());
    setCustomSpecs([]);
    setCustomInput('');
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

    const finish_names = [
      ...selectedFinishes.map(f => f.name).filter((n): n is string => Boolean(n)),
      ...customSpecs,
    ];

    const materialSpecsData = {
      finish_ids: selectedFinishes.filter(f => f.type === 'finish').map(f => f.id).filter((id): id is number => id !== undefined),
      coating_ids: selectedFinishes.filter(f => f.type === 'coating').map(f => f.id).filter((id): id is number => id !== undefined),
      surface_ids: selectedFinishes.filter(f => f.type === 'surface').map(f => f.id).filter((id): id is number => id !== undefined),
      grade_ids: selectedFinishes.filter(f => f.type === 'grade').map(f => f.id).filter((id): id is number => id !== undefined),
      variant_ids: selectedFinishes.filter(f => f.type === 'variant').map(f => f.id).filter((id): id is number => id !== undefined),
      custom_specs: customSpecs,
      finish_names,
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
  }, [selectedOptions, allFinishes, customSpecs, onSpecsSelected, onBrandDetailsSelected, materialKey, navigation]);

  const handleAddCustom = useCallback(() => {
    const trimmed = customInput.trim();
    if (trimmed) {
      setCustomSpecs(prev => [...prev, trimmed]);
      setCustomInput('');
    }
  }, [customInput]);

  const handleRemoveCustomSpec = useCallback((index: number) => {
    setCustomSpecs(prev => prev.filter((_, i) => i !== index));
  }, []);

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

  const buttonHeight = 120;
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
          <CustomButton
            title="Retry"
            onPress={() => refetch()}
            variant="primary"
            size="md"
          />
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
            Select Finishes / Coating / Grade / Certifications
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
        </View>
      </ScreenWrapper>

      <Modal
        visible={isCustomModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCustomModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsCustomModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text variant="h4" fontWeight="semibold" style={styles.modalTitle}>
                Add custom spec
              </Text>
              <TouchableOpacity
                onPress={() => setIsCustomModalVisible(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <AppIcon.Close width={24} height={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.customInput}
              placeholder="Type specific grade or finish..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={customInput}
              onChangeText={setCustomInput}
            />
            {customSpecs.length > 0 && (
              <View style={[styles.optionsGrid, { marginTop: theme.spacing[3] }]}>
                {customSpecs.map((spec, index) => (
                  <TouchableOpacity
                    key={`custom-${index}-${spec}`}
                    style={[styles.optionChip, styles.optionChipSelected]}
                    onPress={() => handleRemoveCustomSpec(index)}
                    activeOpacity={0.7}
                  >
                    <Text variant="bodyMedium" style={styles.optionChipTextSelected}>
                      {spec}
                    </Text>
                    <AppIcon.Close
                      width={14}
                      height={14}
                      color={theme.colors.text.inverse}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.modalActions}>
              <CustomButton
                title="Cancel"
                onPress={() => setIsCustomModalVisible(false)}
                variant="outline"
                size="md"
                style={styles.modalCancelButton}
              />
              <CustomButton
                title="Add"
                onPress={handleAddCustom}
                variant="gradient"
                size="md"
                disabled={!customInput.trim()}
                gradientColors={[
                  theme.colors.primary[400],
                  theme.colors.primary.DEFAULT,
                ]}
                gradientStart={{ x: 0, y: 0 }}
                gradientEnd={{ x: 1, y: 1 }}
                style={styles.modalAddButton}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
        <View style={styles.bottomActionsRow}>
          <CustomButton
            title={`Add Custom${customSpecs.length > 0 ? ` (${customSpecs.length})` : ''}`}
            onPress={() => setIsCustomModalVisible(true)}
            variant="outline"
            size="md"
            leftIcon={<AppIcon.PlusCircle width={18} height={18} color={theme.colors.primary.DEFAULT} />}
            textStyle={{ color: theme.colors.primary.DEFAULT }}
            style={styles.addCustomButton}
          />
          <CustomButton
            title="Confirm"
            onPress={handleConfirm}
            variant="gradient"
            size="md"
            fullWidth={false}
            disabled={totalSelectedCount === 0}
            gradientColors={[
              theme.colors.primary[400],
              theme.colors.primary[600],
              theme.colors.primary.DEFAULT,
            ]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 1, y: 1 }}
            rightIcon={<AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />}
            style={styles.confirmButton}
          />
        </View>
      </FloatingBottomContainer>
    </>
  );
};

export default MaterialSpecsScreen;
