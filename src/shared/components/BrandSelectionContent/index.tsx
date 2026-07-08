import React, { memo, useMemo, useCallback } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { BrandItem, BrandItemData } from '@shared/components/BrandItem';
import { AppIcon } from '@assets/svgs';
import { BrandSelectionContentProps, SelectedBrand } from './@types';
import { createStyles } from './styles';
import { Brand } from '@services/api';

const ITEM_HEIGHT = 52;

export const BrandSelectionContent = memo(({
  searchQuery,
  onSearchChange,
  selectedBrand,
  brands,
  isLoading,
  isError,
  onRetry,
  onSelect,
  theme,
  ListComponent = FlatList,
  onAddCustom,
  isAddingCustom = false,
}: BrandSelectionContentProps) => {
  const styles = createStyles(theme);

  const trimmedQuery = searchQuery.trim();

  const filteredBrands = useMemo(() => {
    if (!trimmedQuery) return brands;
    const query = trimmedQuery.toLowerCase();
    return brands.filter((brand) => brand.name.toLowerCase().includes(query));
  }, [trimmedQuery, brands]);

  const hasExactMatch = useMemo(
    () => brands.some((brand) => brand.name.toLowerCase() === trimmedQuery.toLowerCase()),
    [brands, trimmedQuery]
  );

  const handleSelect = useCallback(
    (brand: BrandItemData) => {
      onSelect({ id: brand.id, name: brand.name });
    },
    [onSelect]
  );

  const renderItem = useCallback(
    ({ item }: { item: Brand }) => (
      <BrandItem
        item={{ id: item.id, name: item.name }}
        isSelected={selectedBrand?.id === item.id}
        onSelect={handleSelect}
        theme={theme}
      />
    ),
    [selectedBrand, handleSelect, theme]
  );

  const keyExtractor = useCallback((item: Brand) => item.id.toString(), []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
          <Text variant="bodySmall" style={styles.loadingText}>
            Loading brands...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Text variant="bodyMedium" style={styles.errorText}>
            Failed to load brands
          </Text>
          <TouchableOpacity onPress={onRetry}>
            <Text variant="bodySmall" style={styles.retryText}>
              Tap to retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyMedium" style={styles.emptyText}>
          {searchQuery ? 'No brands found' : 'Start typing to search brands'}
        </Text>
      </View>
    );
  }, [isLoading, isError, searchQuery, onRetry, styles, theme]);

  const ListFooterComponent = useCallback(() => {
    if (!onAddCustom || !trimmedQuery || hasExactMatch) return null;
    return (
      <TouchableOpacity
        style={styles.addCustomRow}
        onPress={() => onAddCustom(trimmedQuery)}
        disabled={isAddingCustom}
        activeOpacity={0.7}
      >
        {isAddingCustom ? (
          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
        ) : (
          <AppIcon.PlusCircle width={20} height={20} color={theme.colors.primary.DEFAULT} />
        )}
        <Text variant="bodyMedium" fontWeight="medium" style={styles.addCustomText}>
          Add "{trimmedQuery}"
        </Text>
      </TouchableOpacity>
    );
  }, [onAddCustom, trimmedQuery, hasExactMatch, isAddingCustom, styles, theme]);

  const listHeader = (
    <View style={styles.listHeader}>
      <Text variant="h4" fontWeight="semibold" style={styles.title}>
        Select Mill / Brand
      </Text>
      <View style={styles.searchContainer}>
        <AppIcon.Location
          width={18}
          height={18}
          color={theme.colors.text.tertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search brands..."
          placeholderTextColor={theme.colors.text.tertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
    </View>
  );

  return (
    <ListComponent
      data={filteredBrands}
      keyExtractor={keyExtractor}
      style={styles.container}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={listHeader}
      ListFooterComponent={ListFooterComponent}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      bounces={false}
      renderItem={renderItem}
      showsVerticalScrollIndicator
      removeClippedSubviews
      maxToRenderPerBatch={15}
      windowSize={10}
      initialNumToRender={15}
      getItemLayout={getItemLayout}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
});

BrandSelectionContent.displayName = 'BrandSelectionContent';

export type { SelectedBrand, BrandSelectionContentProps } from './@types';
