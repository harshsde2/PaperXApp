/**
 * Location Module Constants
 * API Keys and configuration for location services
 */

import { Platform } from 'react-native';

// Google Maps API Keys
export const GOOGLE_MAPS_API_KEYS = {
  ANDROID: 'AIzaSyAqC2sr4Uai_6nFgDAeZytrbpAoDvorvh0',
  IOS: 'AIzaSyAKNIzVRmthsfYNHfjuEpIJJwZvJ1R5qTA',
  SERVER: 'AIzaSyAwU3Rx7Db9Ub25tNlcSsso6rP1p2ixmO4', // For Places & Geocoding API
};

// Get the appropriate API key based on platform
export const getGoogleMapsApiKey = () => {
  return Platform.OS === 'ios' 
    ? GOOGLE_MAPS_API_KEYS.IOS 
    : GOOGLE_MAPS_API_KEYS.ANDROID;
};

// Server API key for Places/Geocoding (used in JS)
export const getServerApiKey = () => GOOGLE_MAPS_API_KEYS.SERVER;

// Default region (India center)
export const DEFAULT_REGION = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 15,
  longitudeDelta: 15,
};

// Default zoom levels
export const ZOOM_LEVELS = {
  COUNTRY: { latitudeDelta: 15, longitudeDelta: 15 },
  STATE: { latitudeDelta: 5, longitudeDelta: 5 },
  CITY: { latitudeDelta: 0.5, longitudeDelta: 0.5 },
  NEIGHBORHOOD: { latitudeDelta: 0.05, longitudeDelta: 0.05 },
  STREET: { latitudeDelta: 0.01, longitudeDelta: 0.01 },
  BUILDING: { latitudeDelta: 0.005, longitudeDelta: 0.005 },
};

// Country restriction for Places API (India)
export const COUNTRY_RESTRICTION = 'in';

// Google Places API endpoints
export const GOOGLE_PLACES_API = {
  AUTOCOMPLETE: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
  DETAILS: 'https://maps.googleapis.com/maps/api/place/details/json',
  GEOCODE: 'https://maps.googleapis.com/maps/api/geocode/json',
};

// Map styling (optional - for custom map appearance)
export const MAP_STYLE = [
  // Add custom map styling here if needed
  // Example: { featureType: 'poi', stylers: [{ visibility: 'off' }] }
];

// Location error codes
export const LOCATION_ERROR_CODES = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
  PLAY_SERVICE_NOT_AVAILABLE: 4,
  SETTINGS_NOT_SATISFIED: 5,
  INTERNAL_ERROR: -1,
};

// Geolocation configuration - Platform specific
export const GEOLOCATION_CONFIG = Platform.select({
  ios: {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 10000,
    distanceFilter: 0,
  },
  android: {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 10000,
    distanceFilter: 0,
    forceRequestLocation: true,
    forceLocationManager: true, // Use LocationManager instead of Fused Location Provider
    showLocationDialog: true,
  },
  default: {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 10000,
  },
}) as {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  distanceFilter?: number;
  forceRequestLocation?: boolean;
  forceLocationManager?: boolean;
  showLocationDialog?: boolean;
};
