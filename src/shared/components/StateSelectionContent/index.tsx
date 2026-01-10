import React, { memo, useMemo, useCallback } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { State, IState } from 'country-state-city';
import { Text } from '@shared/components/Text';
import { StateItem } from '@shared/components/StateItem';
import { AppIcon } from '@assets/svgs';
import { StateSelectionContentProps } from './@types';
import { createStyles } from './styles';

const INDIA_COUNTRY_CODE = 'IN';
const INDIAN_STATES = State.getStatesOfCountry(INDIA_COUNTRY_CODE);

export const StateSelectionContent = memo(({
  searchQuery,
  onSearchChange,
  selectedState,
  onSelect,
  theme,
}: StateSelectionContentProps) => {
  const styles = createStyles(theme);

  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return INDIAN_STATES;
    const query = searchQuery.toLowerCase();
    return INDIAN_STATES.filter((s) => s.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const renderItem = useCallback(
    ({ item }: { item: IState }) => (
      <StateItem
        item={item}
        isSelected={selectedState === item.name}
        onSelect={onSelect}
        theme={theme}
      />
    ),
    [selectedState, onSelect, theme]
  );

  const keyExtractor = useCallback((item: IState) => item.isoCode, []);

  return (
    <View style={styles.container}>
      <Text variant="h4" fontWeight="semibold" style={styles.title}>
        Select State
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
          placeholder="Search State"
          placeholderTextColor={theme.colors.text.tertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <FlatList
        data={filteredStates}
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
              No states found
            </Text>
          </View>
        }
      />
    </View>
  );
});
