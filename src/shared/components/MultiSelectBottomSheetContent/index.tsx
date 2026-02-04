import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { MultiSelectBottomSheetContentProps } from './@types';
import { createStyles } from './styles';

const ITEM_HEIGHT = 52;

export const MultiSelectBottomSheetContent = memo(({
  title,
  searchQuery,
  onSearchChange,
  items,
  selectedIds: initialSelectedIds,
  onSelect,
  onDeselect,
  theme,
  placeholder = 'Search...',
}: MultiSelectBottomSheetContentProps) => {
  const styles = createStyles(theme);
  
  // Manage local state for selections to update UI immediately
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>(initialSelectedIds || []);
  
  // Manage local search query to prevent clearing
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery || '');
  
  // Sync local search query with prop when it changes externally (e.g., on open)
  useEffect(() => {
    if (searchQuery !== undefined) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);
  
  // Sync local selected IDs with initial prop
  useEffect(() => {
    if (initialSelectedIds) {
      setLocalSelectedIds(initialSelectedIds);
    }
  }, [initialSelectedIds]);

  const filteredItems = useMemo(() => {
    if (!items || !Array.isArray(items) || items.length === 0) return [];
    if (!localSearchQuery || typeof localSearchQuery !== 'string' || !localSearchQuery.trim()) return items;
    
    try {
      const query = localSearchQuery.toLowerCase().trim();
      return items.filter((item) => {
        if (!item || !item.name || typeof item.name !== 'string') return false;
        return item.name.toLowerCase().includes(query);
      });
    } catch (error) {
      console.error('Error filtering items:', error);
      return items;
    }
  }, [localSearchQuery, items]);

  const handleToggle = useCallback(
    (item: { id: number; name: string }) => {
      const isSelected = localSelectedIds.includes(item.id);
      if (isSelected) {
        // Remove from local state
        setLocalSelectedIds((prev) => prev.filter((id) => id !== item.id));
        // Notify parent
        onDeselect(item.id);
      } else {
        // Add to local state
        setLocalSelectedIds((prev) => [...prev, item.id]);
        // Notify parent
        onSelect(item.id);
      }
    },
    [localSelectedIds, onSelect, onDeselect]
  );

  const renderItem = useCallback(
    ({ item }: { item: { id: number; name: string } }) => {
      const isSelected = localSelectedIds.includes(item.id);
      return (
        <TouchableOpacity
          style={[styles.item, isSelected && styles.itemSelected]}
          onPress={() => handleToggle(item)}
          activeOpacity={0.7}
        >
          <Text
            variant="bodyMedium"
            style={[styles.itemText, isSelected && styles.itemTextSelected]}
          >
            {item.name}
          </Text>
          {isSelected && (
            <AppIcon.TickCheckedBox width={20} height={20} color={theme.colors.primary.DEFAULT} />
          )}
        </TouchableOpacity>
      );
    },
    [localSelectedIds, handleToggle, styles, theme]
  );

  const keyExtractor = useCallback((item: { id: number; name: string }) => item.id.toString(), []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <Text variant="h4" fontWeight="semibold" style={styles.title}>
        {title}
      </Text>
      {localSelectedIds.length > 0 && (
        <View style={styles.selectedCount}>
          <Text variant="captionSmall" style={styles.selectedCountText}>
            {localSelectedIds.length} selected
          </Text>
        </View>
      )}
      <View style={styles.searchContainer}>
        <AppIcon.Location
          width={18}
          height={18}
          color={theme.colors.text.tertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          value={localSearchQuery}
          onChangeText={(text) => {
            setLocalSearchQuery(text);
            // Also notify parent for external state management
            onSearchChange(text);
          }}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={filteredItems}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled
        bounces={false}
        renderItem={renderItem}
        showsVerticalScrollIndicator
        removeClippedSubviews
        maxToRenderPerBatch={15}
        windowSize={10}
        initialNumToRender={15}
        getItemLayout={getItemLayout}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyMedium" style={styles.emptyText}>
              {localSearchQuery ? 'No items found' : 'Start typing to search'}
            </Text>
          </View>
        }
      />
    </View>
  );
});

MultiSelectBottomSheetContent.displayName = 'MultiSelectBottomSheetContent';

export default MultiSelectBottomSheetContent;
export type { MultiSelectBottomSheetContentProps } from './@types';
