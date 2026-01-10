/**
 * Location Module
 * Reusable location functionality for maps, geocoding, and places
 * 
 * Usage:
 * ```tsx
 * import {
 *   // Components
 *   LocationPicker,
 *   MapViewWrapper,
 *   AddressSearchBar,
 *   
 *   // Hooks
 *   useCurrentLocation,
 *   useGeocoding,
 *   usePlacesAutocomplete,
 *   
 *   // Services
 *   getCurrentPosition,
 *   reverseGeocode,
 *   searchPlaces,
 *   
 *   // Types
 *   Location,
 *   Coordinates,
 *   MarkerData,
 * } from '@shared/location';
 * ```
 */

// Components
export {
  MapViewWrapper,
  AddressSearchBar,
  LocationPicker,
} from './components';
export type {
  MapViewWrapperProps,
  AddressSearchBarProps,
  LocationPickerProps,
} from './components';

// Hooks
export {
  useCurrentLocation,
  useGeocoding,
  usePlacesAutocomplete,
} from './hooks';

// Services
export {
  // Geolocation
  requestLocationPermission,
  checkLocationPermission,
  getCurrentPosition,
  watchPosition,
  clearWatch,
  openLocationSettings,
  showPermissionDeniedAlert,
  
  // Geocoding
  reverseGeocode,
  geocodeAddress,
  getLocationFromCoords,
  validatePincode,
  
  // Places
  searchPlaces,
  getPlaceDetails,
  searchNearbyPlaces,
  generateSessionToken,
} from './services';

// Types
export type {
  Coordinates,
  LocationAddress,
  Location,
  MapRegion,
  PlacePrediction,
  PlaceDetails,
  LocationError,
  LocationPermissionStatus,
  MarkerData,
  LocationPickerConfig,
  AddressSearchConfig,
} from './types';

// Constants
export {
  GOOGLE_MAPS_API_KEYS,
  getGoogleMapsApiKey,
  getServerApiKey,
  DEFAULT_REGION,
  ZOOM_LEVELS,
  COUNTRY_RESTRICTION,
  GOOGLE_PLACES_API,
  MAP_STYLE,
  LOCATION_ERROR_CODES,
  GEOLOCATION_CONFIG,
} from './constants';
