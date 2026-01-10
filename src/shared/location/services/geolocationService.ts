/**
 * Geolocation Service
 * Handles getting current device location using GPS
 */

import Geolocation, { GeoPosition, GeoError } from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid, Linking, Alert } from 'react-native';
import { Coordinates, LocationError, LocationPermissionStatus } from '../types';
import { GEOLOCATION_CONFIG, LOCATION_ERROR_CODES } from '../constants';

/**
 * Request location permission from the user
 */
export const requestLocationPermission = async (): Promise<LocationPermissionStatus> => {
  try {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return mapIosPermissionStatus(status);
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'PaperX needs access to your location to show warehouses on the map.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return 'granted';
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        return 'denied';
      } else {
        return 'restricted';
      }
    }

    return 'unavailable';
  } catch (error) {
    console.error('[Geolocation] Permission request error:', error);
    return 'unavailable';
  }
};

/**
 * Check current location permission status
 */
export const checkLocationPermission = async (): Promise<LocationPermissionStatus> => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return mapIosPermissionStatus(status);
  }

  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted ? 'granted' : 'denied';
  }

  return 'unavailable';
};

/**
 * Map iOS permission status to our standard status
 */
const mapIosPermissionStatus = (status: string): LocationPermissionStatus => {
  switch (status) {
    case 'granted':
      return 'granted';
    case 'denied':
      return 'denied';
    case 'disabled':
      return 'disabled';
    case 'restricted':
      return 'restricted';
    default:
      return 'unavailable';
  }
};

/**
 * Get current device location
 */
export const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    try {
      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          console.log('[Geolocation] Position received:', position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: GeoError) => {
          console.error('[Geolocation] getCurrentPosition error:', error);
          const locationError: LocationError = {
            code: error.code,
            message: getErrorMessage(error.code),
          };
          reject(locationError);
        },
        GEOLOCATION_CONFIG,
      );
    } catch (error) {
      console.error('[Geolocation] Unexpected error in getCurrentPosition:', error);
      reject({
        code: LOCATION_ERROR_CODES.INTERNAL_ERROR,
        message: 'An unexpected error occurred while getting your location.',
      });
    }
  });
};

/**
 * Watch device location changes
 */
export const watchPosition = (
  onSuccess: (coords: Coordinates) => void,
  onError: (error: LocationError) => void,
): number => {
  return Geolocation.watchPosition(
    (position: GeoPosition) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error: GeoError) => {
      onError({
        code: error.code,
        message: getErrorMessage(error.code),
      });
    },
    {
      ...GEOLOCATION_CONFIG,
      distanceFilter: 10, // Update every 10 meters
    },
  );
};

/**
 * Stop watching location
 */
export const clearWatch = (watchId: number): void => {
  Geolocation.clearWatch(watchId);
};

/**
 * Get human-readable error message
 */
const getErrorMessage = (code: number): string => {
  switch (code) {
    case LOCATION_ERROR_CODES.PERMISSION_DENIED:
      return 'Location permission denied. Please enable location access in settings.';
    case LOCATION_ERROR_CODES.POSITION_UNAVAILABLE:
      return 'Unable to determine your location. Please try again.';
    case LOCATION_ERROR_CODES.TIMEOUT:
      return 'Location request timed out. Please try again.';
    case LOCATION_ERROR_CODES.PLAY_SERVICE_NOT_AVAILABLE:
      return 'Google Play Services not available.';
    case LOCATION_ERROR_CODES.SETTINGS_NOT_SATISFIED:
      return 'Location settings are not satisfied.';
    default:
      return 'An unknown error occurred while getting your location.';
  }
};

/**
 * Open device location settings
 */
export const openLocationSettings = (): void => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

/**
 * Show permission denied alert with option to open settings
 */
export const showPermissionDeniedAlert = (): void => {
  Alert.alert(
    'Location Permission Required',
    'PaperX needs access to your location to show warehouses on the map. Please enable location access in your device settings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: openLocationSettings },
    ],
  );
};
