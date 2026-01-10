/**
 * usePlacesAutocomplete Hook
 * Hook for Google Places autocomplete functionality
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { PlacePrediction, PlaceDetails, Coordinates } from '../types';
import {
  searchPlaces,
  getPlaceDetails,
  searchNearbyPlaces,
  generateSessionToken,
} from '../services/placesService';

interface UsePlacesAutocompleteOptions {
  debounceMs?: number;
  minQueryLength?: number;
  nearbyLocation?: Coordinates;
}

interface UsePlacesAutocompleteReturn {
  predictions: PlacePrediction[];
  loading: boolean;
  error: string | null;
  search: (query: string) => void;
  selectPlace: (placeId: string) => Promise<PlaceDetails | null>;
  clearPredictions: () => void;
  selectedPlace: PlaceDetails | null;
}

export const usePlacesAutocomplete = (
  options: UsePlacesAutocompleteOptions = {},
): UsePlacesAutocompleteReturn => {
  const { debounceMs = 300, minQueryLength = 2, nearbyLocation } = options;

  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);

  const sessionTokenRef = useRef<string>(generateSessionToken());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Regenerate session token when a place is selected (per Google's recommendations)
  const refreshSessionToken = useCallback(() => {
    sessionTokenRef.current = generateSessionToken();
  }, []);

  // Search for places
  const search = useCallback(
    (query: string) => {
      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Clear if query is too short
      if (!query || query.length < minQueryLength) {
        setPredictions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Debounce the search
      debounceTimerRef.current = setTimeout(async () => {
        try {
          let results: PlacePrediction[];

          if (nearbyLocation) {
            results = await searchNearbyPlaces(
              nearbyLocation,
              query,
              50000, // 50km radius
            );
          } else {
            results = await searchPlaces(query, sessionTokenRef.current);
          }

          setPredictions(results);
          setLoading(false);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Search failed';
          setError(errorMessage);
          setPredictions([]);
          setLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs, minQueryLength, nearbyLocation],
  );

  // Select a place and get its details
  const selectPlace = useCallback(
    async (placeId: string): Promise<PlaceDetails | null> => {
      setLoading(true);
      setError(null);

      try {
        const details = await getPlaceDetails(placeId, sessionTokenRef.current);
        setSelectedPlace(details);
        setPredictions([]); // Clear predictions after selection
        refreshSessionToken(); // Generate new session token for next search
        setLoading(false);
        return details;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get place details';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    [refreshSessionToken],
  );

  // Clear predictions
  const clearPredictions = useCallback(() => {
    setPredictions([]);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    predictions,
    loading,
    error,
    search,
    selectPlace,
    clearPredictions,
    selectedPlace,
  };
};

export default usePlacesAutocomplete;
