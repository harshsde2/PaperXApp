/**
 * useCurrentLocation Hook
 * Hook for getting and watching the current device location
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Coordinates, LocationError, LocationPermissionStatus } from '../types';
import {
  getCurrentPosition,
  requestLocationPermission,
  checkLocationPermission,
  watchPosition,
  clearWatch,
  showPermissionDeniedAlert,
} from '../services/geolocationService';

interface UseCurrentLocationOptions {
  enableWatch?: boolean;
  requestOnMount?: boolean;
  showAlertOnDenied?: boolean;
}

interface UseCurrentLocationReturn {
  location: Coordinates | null;
  loading: boolean;
  error: LocationError | null;
  permissionStatus: LocationPermissionStatus;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Coordinates | null>;
  startWatching: () => void;
  stopWatching: () => void;
}

export const useCurrentLocation = (
  options: UseCurrentLocationOptions = {},
): UseCurrentLocationReturn => {
  const {
    enableWatch = false,
    requestOnMount = false,
    showAlertOnDenied = true,
  } = options;

  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('unavailable');
  
  const watchIdRef = useRef<number | null>(null);

  // Check permission on mount
  useEffect(() => {
    checkLocationPermission().then(setPermissionStatus);
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const status = await requestLocationPermission();
      setPermissionStatus(status);
      
      if (status === 'denied' && showAlertOnDenied) {
        showPermissionDeniedAlert();
      }
      
      return status === 'granted';
    } catch (err) {
      console.error('[useCurrentLocation] Permission request error:', err);
      return false;
    }
  }, [showAlertOnDenied]);

  // Get current location
  const getCurrentLocation = useCallback(async (): Promise<Coordinates | null> => {
    console.log('[useCurrentLocation] getCurrentLocation called');
    setLoading(true);
    setError(null);

    try {
      // Check/request permission first
      console.log('[useCurrentLocation] Checking permission...');
      let status = await checkLocationPermission();
      console.log('[useCurrentLocation] Permission status:', status);
      
      if (status !== 'granted') {
        console.log('[useCurrentLocation] Requesting permission...');
        status = await requestLocationPermission();
        console.log('[useCurrentLocation] New permission status:', status);
        setPermissionStatus(status);
        
        if (status !== 'granted') {
          console.log('[useCurrentLocation] Permission not granted');
          if (showAlertOnDenied) {
            showPermissionDeniedAlert();
          }
          setLoading(false);
          return null;
        }
      }

      console.log('[useCurrentLocation] Getting current position...');
      const coords = await getCurrentPosition();
      console.log('[useCurrentLocation] Got coords:', coords);
      setLocation(coords);
      setLoading(false);
      return coords;
    } catch (err: any) {
      console.error('[useCurrentLocation] Error:', err);
      const locationError: LocationError = {
        code: err?.code || -1,
        message: err?.message || 'Failed to get location',
      };
      setError(locationError);
      setLoading(false);
      return null;
    }
  }, [showAlertOnDenied]);

  // Start watching location
  const startWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      return; // Already watching
    }

    watchIdRef.current = watchPosition(
      (coords) => {
        setLocation(coords);
        setError(null);
      },
      (err) => {
        setError(err);
      },
    );
  }, []);

  // Stop watching location
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Request location on mount if enabled
  useEffect(() => {
    if (requestOnMount) {
      getCurrentLocation();
    }
  }, [requestOnMount, getCurrentLocation]);

  // Start watching if enabled
  useEffect(() => {
    if (enableWatch && permissionStatus === 'granted') {
      startWatching();
    }

    return () => {
      stopWatching();
    };
  }, [enableWatch, permissionStatus, startWatching, stopWatching]);

  return {
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    getCurrentLocation,
    startWatching,
    stopWatching,
  };
};

export default useCurrentLocation;
