/**
 * Location Module Types
 * Shared types for location-related functionality
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationAddress {
  formattedAddress: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  placeId?: string;
}

export interface Location extends Coordinates {
  address?: LocationAddress;
  name?: string;
}

export interface MapRegion extends Coordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
}

export interface PlaceDetails extends Location {
  placeId: string;
  name: string;
  types?: string[];
}

export interface LocationError {
  code: number;
  message: string;
}

export type LocationPermissionStatus = 
  | 'granted'
  | 'denied'
  | 'disabled'
  | 'restricted'
  | 'unavailable';

export interface MarkerData extends Coordinates {
  id: string;
  title?: string;
  description?: string;
  isPrimary?: boolean;
  color?: string;
}

export interface LocationPickerConfig {
  initialRegion?: MapRegion;
  markers?: MarkerData[];
  allowMultipleMarkers?: boolean;
  showUserLocation?: boolean;
  showSearchBar?: boolean;
  enableDraggableMarkers?: boolean;
}

export interface AddressSearchConfig {
  placeholder?: string;
  countryRestriction?: string;
  showCurrentLocation?: boolean;
  recentAddresses?: LocationAddress[];
}
