/**
 * useGeocoding Hook
 * Hook for converting between addresses and coordinates
 */

import { useState, useCallback } from 'react';
import { Coordinates, LocationAddress, Location } from '../types';
import {
  reverseGeocode,
  geocodeAddress,
  getLocationFromCoords,
} from '../services/geocodingService';

interface UseGeocodingReturn {
  loading: boolean;
  error: string | null;
  getAddressFromCoords: (coords: Coordinates) => Promise<LocationAddress | null>;
  getCoordsFromAddress: (address: string) => Promise<Location | null>;
  getFullLocation: (coords: Coordinates) => Promise<Location | null>;
}

export const useGeocoding = (): UseGeocodingReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get address from coordinates (reverse geocoding)
  const getAddressFromCoords = useCallback(
    async (coords: Coordinates): Promise<LocationAddress | null> => {
      setLoading(true);
      setError(null);

      try {
        const address = await reverseGeocode(coords);
        setLoading(false);
        return address;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get address';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    [],
  );

  // Get coordinates from address (forward geocoding)
  const getCoordsFromAddress = useCallback(
    async (address: string): Promise<Location | null> => {
      setLoading(true);
      setError(null);

      try {
        const location = await geocodeAddress(address);
        setLoading(false);
        return location;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get coordinates';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    [],
  );

  // Get full location data (coords + address)
  const getFullLocation = useCallback(
    async (coords: Coordinates): Promise<Location | null> => {
      setLoading(true);
      setError(null);

      try {
        const location = await getLocationFromCoords(coords);
        setLoading(false);
        return location;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    [],
  );

  return {
    loading,
    error,
    getAddressFromCoords,
    getCoordsFromAddress,
    getFullLocation,
  };
};

export default useGeocoding;
