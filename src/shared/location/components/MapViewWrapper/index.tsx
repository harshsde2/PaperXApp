/**
 * MapViewWrapper Component
 * A themed wrapper around react-native-maps MapView
 */

import React, { forwardRef, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, {
  MapViewProps,
  Marker,
  PROVIDER_GOOGLE,
  Region,
  MapMarker,
} from 'react-native-maps';
import { useTheme } from '@theme/index';
import { MarkerData, MapRegion } from '../../types';
import { DEFAULT_REGION, MAP_STYLE } from '../../constants';

export interface MapViewWrapperProps extends Omit<MapViewProps, 'provider' | 'style'> {
  markers?: MarkerData[];
  onMarkerPress?: (marker: MarkerData) => void;
  onMarkerDragEnd?: (marker: MarkerData, newCoords: { latitude: number; longitude: number }) => void;
  showUserLocation?: boolean;
  enableDraggableMarkers?: boolean;
  containerStyle?: object;
  mapStyle?: object;
}

const MapViewWrapper = forwardRef<MapView, MapViewWrapperProps>(
  (
    {
      markers = [],
      onMarkerPress,
      onMarkerDragEnd,
      showUserLocation = true,
      enableDraggableMarkers = false,
      containerStyle,
      mapStyle,
      initialRegion = DEFAULT_REGION,
      ...mapProps
    },
    ref,
  ) => {
    const theme = useTheme();

    const handleMarkerPress = useCallback(
      (marker: MarkerData) => {
        onMarkerPress?.(marker);
      },
      [onMarkerPress],
    );

    const handleMarkerDragEnd = useCallback(
      (marker: MarkerData, event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
        if (onMarkerDragEnd) {
          onMarkerDragEnd(marker, event.nativeEvent.coordinate);
        }
      },
      [onMarkerDragEnd],
    );

    const getMarkerColor = (marker: MarkerData): string => {
      if (marker.color) {
        return marker.color;
      }
      return marker.isPrimary
        ? theme.colors.primary.DEFAULT
        : theme.colors.error.DEFAULT;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <MapView
          ref={ref}
          provider={PROVIDER_GOOGLE}
          style={[styles.map, mapStyle]}
          initialRegion={initialRegion as Region}
          showsUserLocation={showUserLocation}
          showsMyLocationButton={showUserLocation}
          showsCompass={true}
          showsScale={true}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={Platform.OS === 'android'}
          customMapStyle={MAP_STYLE.length > 0 ? MAP_STYLE : undefined}
          {...mapProps}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              description={marker.description}
              pinColor={getMarkerColor(marker)}
              draggable={enableDraggableMarkers}
              onPress={() => handleMarkerPress(marker)}
              onDragEnd={(e) => handleMarkerDragEnd(marker, e)}
            />
          ))}
        </MapView>
      </View>
    );
  },
);

MapViewWrapper.displayName = 'MapViewWrapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapViewWrapper;
