/**
 * LocationPicker Component
 * Full-featured location picker with map and search
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import MapView, { Region, MapPressEvent } from 'react-native-maps';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import MapViewWrapper from '../MapViewWrapper';
import AddressSearchBar from '../AddressSearchBar';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useGeocoding } from '../../hooks/useGeocoding';
import { Location, MarkerData, MapRegion, PlaceDetails, Coordinates } from '../../types';
import { DEFAULT_REGION, ZOOM_LEVELS } from '../../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface LocationPickerProps {
  initialLocation?: Location;
  existingMarkers?: MarkerData[];
  onLocationSelect: (location: Location) => void;
  onCancel?: () => void;
  showExistingMarkers?: boolean;
  allowMapTap?: boolean;
  confirmButtonText?: string;
  title?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLocation,
  existingMarkers = [],
  onLocationSelect,
  onCancel,
  showExistingMarkers = true,
  allowMapTap = true,
  confirmButtonText = 'Confirm Location',
  title = 'Select Location',
}) => {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    initialLocation || null,
  );
  const [region, setRegion] = useState<MapRegion>(
    initialLocation
      ? {
          ...initialLocation,
          ...ZOOM_LEVELS.NEIGHBORHOOD,
        }
      : DEFAULT_REGION,
  );
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const { getCurrentLocation, loading: locationLoading } = useCurrentLocation();
  const { getFullLocation } = useGeocoding();

  // Animate to region
  const animateToRegion = useCallback(
    (newRegion: MapRegion, duration: number = 500) => {
      mapRef.current?.animateToRegion(newRegion, duration);
    },
    [],
  );

  // Handle map press to drop pin
  const handleMapPress = useCallback(
    async (event: MapPressEvent) => {
      if (!allowMapTap) return;

      const { coordinate } = event.nativeEvent;
      setIsLoadingAddress(true);

      // Set location immediately with coordinates
      setSelectedLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });

      // Animate to the selected location
      animateToRegion({
        ...coordinate,
        ...ZOOM_LEVELS.STREET,
      });

      // Get address for the coordinates
      try {
        const location = await getFullLocation(coordinate);
        if (location) {
          setSelectedLocation(location);
        }
      } catch (error) {
        console.error('[LocationPicker] Error getting address:', error);
      } finally {
        setIsLoadingAddress(false);
      }
    },
    [allowMapTap, animateToRegion, getFullLocation],
  );

  // Handle place selection from search
  const handlePlaceSelect = useCallback(
    (place: PlaceDetails) => {
      const newLocation: Location = {
        latitude: place.latitude,
        longitude: place.longitude,
        address: place.address,
        name: place.name,
      };

      setSelectedLocation(newLocation);
      animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        ...ZOOM_LEVELS.STREET,
      });
    },
    [animateToRegion],
  );

  // Handle current location button
  const handleCurrentLocation = useCallback(async () => {
    setIsLoadingAddress(true);
    
    try {
      console.log('[LocationPicker] handleCurrentLocation called');
      const coords = await getCurrentLocation();
      console.log('[LocationPicker] Got coords:', coords);
      
      if (coords) {
        // Animate to current location
        animateToRegion({
          ...coords,
          ...ZOOM_LEVELS.NEIGHBORHOOD,
        });

        // Get full location with address
        try {
          const location = await getFullLocation(coords);
          if (location) {
            setSelectedLocation(location);
          } else {
            setSelectedLocation(coords);
          }
        } catch (error) {
          console.error('[LocationPicker] Error getting full location:', error);
          setSelectedLocation(coords);
        }
      } else {
        console.log('[LocationPicker] No coords returned, using default location');
        // If no coords, show an alert
        Alert.alert(
          'Location Not Available',
          'Unable to get your current location. Please search for an address or tap on the map to select a location.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('[LocationPicker] Error in handleCurrentLocation:', error);
      Alert.alert(
        'Location Error',
        'There was an error getting your location. Please try again or search for an address.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingAddress(false);
    }
  }, [getCurrentLocation, animateToRegion, getFullLocation]);

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback(
    async (_marker: MarkerData, newCoords: Coordinates) => {
      setIsLoadingAddress(true);
      setSelectedLocation({
        latitude: newCoords.latitude,
        longitude: newCoords.longitude,
      });

      try {
        const location = await getFullLocation(newCoords);
        if (location) {
          setSelectedLocation(location);
        }
      } catch (error) {
        console.error('[LocationPicker] Error getting address:', error);
      } finally {
        setIsLoadingAddress(false);
      }
    },
    [getFullLocation],
  );

  // Handle confirm
  const handleConfirm = useCallback(() => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  }, [selectedLocation, onLocationSelect]);

  // Build markers array
  const allMarkers: MarkerData[] = [
    ...(showExistingMarkers ? existingMarkers : []),
    ...(selectedLocation
      ? [
          {
            id: 'selected',
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            title: selectedLocation.name || 'Selected Location',
            description: selectedLocation.address?.formattedAddress,
            isPrimary: true,
          },
        ]
      : []),
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <AppIcon.Close
              width={24}
              height={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        )}
        <Text variant="h5" fontWeight="bold" style={{ color: theme.colors.text.primary }}>
          {title}
        </Text>
        <View style={styles.cancelButton} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <AddressSearchBar
          onPlaceSelect={handlePlaceSelect}
          onCurrentLocationPress={handleCurrentLocation}
          showCurrentLocationButton={true}
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapViewWrapper
          ref={mapRef}
          markers={allMarkers}
          initialRegion={region}
          onPress={handleMapPress}
          onMarkerDragEnd={handleMarkerDragEnd}
          enableDraggableMarkers={true}
          showUserLocation={true}
        />

        {/* Loading Overlay */}
        {(locationLoading || isLoadingAddress) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
          </View>
        )}

        {/* Center Crosshair (optional, for when no location is selected) */}
        {!selectedLocation && (
          <View style={styles.crosshairContainer} pointerEvents="none">
            <View style={[styles.crosshair, { backgroundColor: theme.colors.primary.DEFAULT }]} />
          </View>
        )}
      </View>

      {/* Selected Address Card */}
      {selectedLocation && (
        <View style={[styles.addressCard, { backgroundColor: theme.colors.surface.primary }]}>
          <View style={styles.addressHeader}>
            <AppIcon.Location
              width={24}
              height={24}
              color={theme.colors.primary.DEFAULT}
            />
            <View style={styles.addressTextContainer}>
              {selectedLocation.name && (
                <Text variant="bodyMedium" fontWeight="semibold" style={{ color: theme.colors.text.primary }}>
                  {selectedLocation.name}
                </Text>
              )}
              {selectedLocation.address?.formattedAddress ? (
                <Text variant="captionMedium" style={{ color: theme.colors.text.secondary }} numberOfLines={2}>
                  {selectedLocation.address.formattedAddress}
                </Text>
              ) : (
                <Text variant="captionMedium" style={{ color: theme.colors.text.tertiary }}>
                  {isLoadingAddress ? 'Getting address...' : 'Tap to get address'}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Confirm Button */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface.primary }]}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor: selectedLocation
                ? theme.colors.primary.DEFAULT
                : theme.colors.surface.secondary,
            },
          ]}
          onPress={handleConfirm}
          disabled={!selectedLocation}
          activeOpacity={0.8}
        >
          <Text
            variant="buttonMedium"
            style={{
              color: selectedLocation
                ? theme.colors.text.inverse
                : theme.colors.text.tertiary,
            }}
          >
            {confirmButtonText}
          </Text>
          {selectedLocation && (
            <AppIcon.ArrowRight
              width={20}
              height={20}
              color={theme.colors.text.inverse}
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cancelButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshair: {
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.5,
  },
  addressCard: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  addressTextContainer: {
    flex: 1,
    gap: 4,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
});

export default LocationPicker;
