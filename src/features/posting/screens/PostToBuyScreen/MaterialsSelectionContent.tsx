import React, { memo, useMemo, useCallback, useRef } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, ListRenderItem, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { Theme } from '@theme/types';
import { Material } from '@services/api';
import { MaterialItem } from './PostToBuyScreen';
import { createStyles } from './materialsSelectionStyles';

const END_REACHED_THRESHOLD = 0.2;

interface MaterialsSelectionContentProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedMaterialIds: Set<number> | number[];
  materials: Material[];
  filteredMaterials: Material[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  onToggle: (materialId: number) => void;
  onClear?: () => void;
  onLoadMore: () => void;
  onScroll: (event: any) => void;
  theme: Theme;
}

export const MaterialsSelectionContent = memo(({
  searchQuery,
  onSearchChange,
  selectedMaterialIds,
  materials,
  filteredMaterials,
  isLoading,
  isFetchingNextPage,
  onToggle,
  onClear,
  onLoadMore,
  onScroll,
  theme,
}: MaterialsSelectionContentProps) => {
  const styles = createStyles(theme);
  const scrollViewRef = useRef<FlatList>(null);

  // Convert Set to array if needed, and create a Set for lookups (optimized)
  const selectedIdsSet = useMemo(() => {
    if (Array.isArray(selectedMaterialIds)) {
      return new Set(selectedMaterialIds);
    }
    return selectedMaterialIds;
  }, [selectedMaterialIds]);

  const selectedCount = useMemo(() => {
    return Array.isArray(selectedMaterialIds) 
      ? selectedMaterialIds.length 
      : selectedMaterialIds.size;
  }, [selectedMaterialIds]);

  // Memoize the selection check function
  const isMaterialSelected = useCallback(
    (materialId: number) => selectedIdsSet.has(materialId),
    [selectedIdsSet],
  );

  // Optimized render function - only re-renders when selection changes for that specific item
  const renderMaterialItem: ListRenderItem<Material> = useCallback(
    ({ item }) => {
      const isSelected = isMaterialSelected(item.id);
      return (
        <MaterialItem
          material={item}
          isSelected={isSelected}
          onToggle={onToggle}
          styles={styles}
          theme={theme}
        />
      );
    },
    [isMaterialSelected, onToggle, styles, theme],
  );

  const keyExtractor = useCallback((item: Material) => `material-${item.id}`, []);

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

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="h4" fontWeight="semibold" style={styles.title}>
          Select Material
        </Text>
        {selectedCount > 0 && onClear && (
          <TouchableOpacity
            onPress={onClear}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Text variant="bodySmall" style={styles.clearButtonText}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {selectedCount > 0 && (
        <View style={styles.selectedCountContainer}>
          <Text variant="bodySmall" style={styles.selectedCountText}>
            1 material selected
          </Text>
        </View>
      )}
      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <AppIcon.Search
            width={18}
            height={18}
            color={theme.colors.text.tertiary}
          />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search materials"
          placeholderTextColor={theme.colors.text.tertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
        </View>
      ) : (
        <FlatList
          ref={scrollViewRef}
          data={filteredMaterials}
          renderItem={renderMaterialItem}
          keyExtractor={keyExtractor}
          ListFooterComponent={ListFooterComponent}
          contentContainerStyle={styles.listContent}
          onEndReached={onLoadMore}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          onScroll={onScroll}
          scrollEnabled={true}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={10}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true}
          updateCellsBatchingPeriod={50}
          getItemLayout={(data, index) => ({
            length: 60, // Approximate item height
            offset: 60 * index,
            index,
          })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {searchQuery ? 'No materials found' : 'No materials available'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
});

MaterialsSelectionContent.displayName = 'MaterialsSelectionContent';
