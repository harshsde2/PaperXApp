/**
 * AddressSearchBar Component
 * Search bar with Google Places autocomplete
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { usePlacesAutocomplete } from '../../hooks/usePlacesAutocomplete';
import { PlacePrediction, PlaceDetails, Coordinates } from '../../types';

export interface AddressSearchBarProps {
  placeholder?: string;
  onPlaceSelect: (place: PlaceDetails) => void;
  onCurrentLocationPress?: () => void;
  showCurrentLocationButton?: boolean;
  nearbyLocation?: Coordinates;
  containerStyle?: object;
}

const AddressSearchBar: React.FC<AddressSearchBarProps> = ({
  placeholder = 'Search address or pincode',
  onPlaceSelect,
  onCurrentLocationPress,
  showCurrentLocationButton = true,
  nearbyLocation,
  containerStyle,
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const {
    predictions,
    loading,
    search,
    selectPlace,
    clearPredictions,
  } = usePlacesAutocomplete({ nearbyLocation });

  const handleChangeText = useCallback(
    (text: string) => {
      setQuery(text);
      search(text);
    },
    [search],
  );

  const handleSelectPrediction = useCallback(
    async (prediction: PlacePrediction) => {
      Keyboard.dismiss();
      setQuery(prediction.fullText);

      // IMPORTANT: Call selectPlace BEFORE clearPredictions
      // because selectPlace looks for prediction data in the ref
      const details = await selectPlace(prediction.placeId);
      
      // Clear predictions after getting details
      clearPredictions();
      
      if (details) {
        console.log('[AddressSearchBar] Place selected with details:', details);
        onPlaceSelect(details);
      } else {
        console.warn('[AddressSearchBar] No details returned for prediction:', prediction);
        // Fallback: build details from prediction directly if selectPlace fails
        if (prediction.latitude !== undefined && prediction.longitude !== undefined) {
          const fallbackDetails: PlaceDetails = {
            placeId: prediction.placeId,
            name: prediction.mainText,
            latitude: prediction.latitude,
            longitude: prediction.longitude,
            address: prediction.address || {
              formattedAddress: prediction.fullText,
            },
            types: [],
          };
          console.log('[AddressSearchBar] Using fallback details:', fallbackDetails);
          onPlaceSelect(fallbackDetails);
        }
      }
    },
    [selectPlace, clearPredictions, onPlaceSelect],
  );

  const handleClear = useCallback(() => {
    setQuery('');
    clearPredictions();
  }, [clearPredictions]);

  const handleCurrentLocation = useCallback(() => {
    Keyboard.dismiss();
    clearPredictions();
    setQuery('');
    onCurrentLocationPress?.();
  }, [clearPredictions, onCurrentLocationPress]);

  const renderPrediction = ({ item }: { item: PlacePrediction }) => (
    <TouchableOpacity
      style={[styles.predictionItem, { borderBottomColor: theme.colors.border.primary }]}
      onPress={() => handleSelectPrediction(item)}
      activeOpacity={0.7}
    >
      <AppIcon.Location
        width={20}
        height={20}
        color={theme.colors.text.tertiary}
      />
      <View style={styles.predictionTextContainer}>
        <Text variant="bodyMedium" style={{ color: theme.colors.text.primary }}>
          {item.mainText}
        </Text>
        <Text variant="captionMedium" style={{ color: theme.colors.text.tertiary }}>
          {item.secondaryText}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Search Input */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.colors.surface.primary,
            borderColor: isFocused
              ? theme.colors.primary.DEFAULT
              : theme.colors.border.primary,
          },
        ]}
      >
        <AppIcon.Search
          width={20}
          height={20}
          color={theme.colors.text.tertiary}
        />
        <TextInput
          style={[styles.input, { color: theme.colors.text.primary }]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          value={query}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary.DEFAULT}
          />
        )}
        {query.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <AppIcon.Close
              width={20}
              height={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Current Location Button */}
      {showCurrentLocationButton && onCurrentLocationPress && (
        <TouchableOpacity
          style={[
            styles.currentLocationButton,
            { backgroundColor: theme.colors.surface.primary },
          ]}
          onPress={handleCurrentLocation}
          activeOpacity={0.7}
        >
          <AppIcon.Location
            width={20}
            height={20}
            color={theme.colors.primary.DEFAULT}
          />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.primary.DEFAULT, marginLeft: 8 }}
          >
            Use Current Location
          </Text>
        </TouchableOpacity>
      )}

      {/* Predictions List */}
      {predictions.length > 0 && (
        <View
          style={[
            styles.predictionsContainer,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.border.primary,
            },
          ]}
        >
          <FlatList
            data={predictions}
            renderItem={renderPrediction}
            keyExtractor={(item) => item.placeId}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 12,
  },
  predictionsContainer: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 250,
    overflow: 'hidden',
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  predictionTextContainer: {
    flex: 1,
  },
});

export default AddressSearchBar;
