import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import type { DeliveryLocationSheetContentProps } from './@types';
import { createStyles } from './styles';

export const DeliveryLocationSheetContent: React.FC<DeliveryLocationSheetContentProps> = ({
  userLocations,
  selectedLocationId,
  selectedSource,
  onSelectSavedLocation,
  onAddLocation,
  theme,
  ListComponent,
}) => {
  const styles = createStyles(theme);

  const renderItem = useCallback(
    ({ item: location }: { item: DeliveryLocationSheetContentProps['userLocations'][0] }) => {
      const isSelected = selectedSource === 'saved' && selectedLocationId === location.id;
      return (
        <TouchableOpacity
          style={[styles.locationOption, isSelected && styles.locationOptionSelected]}
          onPress={() => onSelectSavedLocation(location)}
          activeOpacity={0.7}
        >
          <View style={styles.locationOptionContent}>
            <Text variant="bodyMedium" style={styles.locationOptionTitle}>
              {location.address || location.city}
            </Text>
            <Text variant="captionSmall" style={styles.locationOptionSubtitle}>
              {location.type === 'warehouse' ? 'Warehouse' : location.type}
              {location.city && ` • ${location.city}`}
              {location.state && `, ${location.state}`}
            </Text>
          </View>
          {isSelected && (
            <AppIcon.TickCheckedBox
              width={20}
              height={20}
              color={theme.colors.primary.DEFAULT}
            />
          )}
        </TouchableOpacity>
      );
    },
    [selectedLocationId, selectedSource, onSelectSavedLocation, theme, styles],
  );

  const ListHeaderComponent = useCallback(
    () =>
      userLocations.length > 0 ? (
        <Text
          variant="captionSmall"
          style={styles.sectionLabel}
        >
          Your Saved Locations ({userLocations.length})
        </Text>
      ) : null,
    [userLocations.length, styles.sectionLabel],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyMessage}>
        <Text variant="bodyMedium" style={styles.emptyMessageText}>
          No saved locations.{'\n'}Add a location on the map below.
        </Text>
      </View>
    ),
    [styles.emptyMessage, styles.emptyMessageText],
  );

  const ListFooterComponent = useCallback(
    () => (
      <TouchableOpacity
        style={styles.addLocationRow}
        onPress={onAddLocation}
        activeOpacity={0.7}
      >
        <AppIcon.Location
          width={20}
          height={20}
          color={theme.colors.primary.DEFAULT}
        />
        <View style={styles.addLocationText}>
          <Text variant="bodyMedium" fontWeight="medium" style={{ color: theme.colors.primary.DEFAULT }}>
            Add location on map
          </Text>
          <Text variant="captionSmall" style={styles.locationOptionSubtitle}>
            Choose a custom delivery location
          </Text>
        </View>
        <AppIcon.ChevronRight
          width={16}
          height={16}
          color={theme.colors.primary.DEFAULT}
        />
      </TouchableOpacity>
    ),
    [onAddLocation, theme, styles.addLocationRow, styles.addLocationText, styles.locationOptionSubtitle],
  );

  const keyExtractor = useCallback((item: { id: number }) => `location-${item.id}`, []);

  return (
    <ListComponent
      data={userLocations}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator
    />
  );
};
