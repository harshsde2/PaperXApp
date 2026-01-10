import React, { memo, useMemo, useCallback } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { ICity } from 'country-state-city';
import { Text } from '@shared/components/Text';
import { CityItem } from '@shared/components/CityItem';
import { AppIcon } from '@assets/svgs';
import { CitySelectionContentProps } from './@types';
import { createStyles } from './styles';

export const CitySelectionContent = memo(({
  searchQuery,
  onSearchChange,
  selectedCity,
  selectedStateName,
  cities,
  onSelect,
  theme,
}: CitySelectionContentProps) => {
  const styles = createStyles(theme);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    const query = searchQuery.toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(query));
  }, [cities, searchQuery]);

  const renderItem = useCallback(
    ({ item }: { item: ICity }) => (
      <CityItem
        item={item}
        isSelected={selectedCity === item.name}
        onSelect={onSelect}
        theme={theme}
      />
    ),
    [selectedCity, onSelect, theme]
  );

  const keyExtractor = useCallback(
    (item: ICity) => `${item.name}-${item.stateCode}`,
    []
  );

  return (
    <View style={styles.container}>
      <Text variant="h4" fontWeight="semibold" style={styles.title}>
        Select City
      </Text>
      {selectedStateName && (
        <Text variant="captionMedium" style={styles.subtitle}>
          {selectedStateName}
        </Text>
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
          placeholder="Search City"
          placeholderTextColor={theme.colors.text.tertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <FlatList
        data={filteredCities}
        keyExtractor={keyExtractor}
        style={styles.container}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled
        bounces={false}
        renderItem={renderItem}
        showsVerticalScrollIndicator
        removeClippedSubviews
        maxToRenderPerBatch={15}
        windowSize={10}
        initialNumToRender={15}
        getItemLayout={(_, index) => ({ length: 52, offset: 52 * index, index })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyMedium" style={styles.emptyText}>
              {searchQuery ? 'No cities found' : 'No cities available for this state'}
            </Text>
          </View>
        }
      />
    </View>
  );
});
