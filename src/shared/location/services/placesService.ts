/**
 * Places Service
 * Handles place search and details
 *
 * NOTE:
 * - Currently uses OpenStreetMap Nominatim (free) for search and details.
 * - The previous Google Places implementation is kept commented and can be
 *   restored when Google APIs are configured.
 */

import { PlacePrediction, PlaceDetails, Coordinates } from '../types';
import { COUNTRY_RESTRICTION } from '../constants';

/**
 * Nominatim Search Response Types
 */
interface NominatimSearchResult {
  place_id: number;
  licence: string;
  osm_type?: string;
  osm_id?: number;
  lat: string;
  lon: string;
  class?: string;
  type?: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    road?: string;
    house_number?: string;
    suburb?: string;
    neighbourhood?: string;
  };
}

interface NominatimLookupResponse extends Array<NominatimSearchResult> {}

/**
 * Search for places using Nominatim
 */
export const searchPlaces = async (
  query: string,
  sessionToken?: string,
): Promise<PlacePrediction[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);

    // Limit by country if COUNTRY_RESTRICTION is set (e.g., "in" for India)
    // Nominatim uses "countrycodes" parameter with ISO 3166-1alpha2 country codes
    const countryParam = COUNTRY_RESTRICTION
      ? `&countrycodes=${COUNTRY_RESTRICTION.toLowerCase()}`
      : '';

    const url = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&addressdetails=1&limit=10${countryParam}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PaperXApp/1.0 (contact: dev@paperx.app)',
        Referer: 'https://paperx.app',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NominatimSearchResult[] = await response.json();

    if (!data || !data.length) {
      return [];
    }

    return data.map(result => {
      const parts = result.display_name.split(',');
      const mainText = parts[0]?.trim() || result.display_name;
      const secondaryText = parts.slice(1).join(',').trim();

      const address = result.address || {};
      const city =
        address.city || address.town || address.village || address.county;

      return {
        placeId: result.place_id.toString(),
        mainText,
        secondaryText,
        fullText: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: {
          formattedAddress: result.display_name,
          streetAddress: mainText || undefined,
          city,
          state: address.state,
          country: address.country,
          pincode: address.postcode,
          placeId: result.place_id.toString(),
        },
      };
    });
  } catch (error) {
    console.error('[Places] Search error (Nominatim):', error);
    throw error;
  }
};

/**
 * Get place details by place ID using Nominatim lookup
 */
export const getPlaceDetails = async (
  placeId: string,
  sessionToken?: string,
): Promise<PlaceDetails> => {
  try {
    const url = `https://nominatim.openstreetmap.org/lookup?format=json&addressdetails=1&place_ids=${placeId}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PaperXApp/1.0 (contact: dev@paperx.app)',
        Referer: 'https://paperx.app',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NominatimLookupResponse = await response.json();

    if (!data || !data.length) {
      throw new Error('Place not found');
    }

    const result = data[0];
    const address = result.address || {};

    // Build street address / name
    let streetAddress = '';
    if (result.display_name) {
      const parts = result.display_name.split(',');
      streetAddress = parts[0]?.trim() || '';
    }
    if (!streetAddress && address.road) {
      streetAddress = address.road;
    }

    const city =
      address.city || address.town || address.village || address.county;

    return {
      placeId: result.place_id.toString(),
      name: streetAddress || city || result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: {
        formattedAddress: result.display_name,
        streetAddress: streetAddress || undefined,
        city,
        state: address.state,
        country: address.country,
        pincode: address.postcode,
        placeId: result.place_id.toString(),
      },
      // Map Nominatim class/type to a simple types array
      types: [result.class, result.type].filter(Boolean) as string[],
    };
  } catch (error) {
    console.error('[Places] Get details error (Nominatim):', error);
    throw error;
  }
};

/**
 * Search for places near a location
 * For Nominatim, we reuse the same searchPlaces function and ignore radius.
 */
export const searchNearbyPlaces = async (
  coords: Coordinates,
  query: string,
  radius: number = 50000, // 50km default
): Promise<PlacePrediction[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  // For now, delegate to searchPlaces (Nominatim does not support a simple nearby search
  // in the same way; we can add viewbox-bounded searches later if needed).
  return searchPlaces(query);
};

/**
 * Generate a unique session token for Places API
 * Session tokens group autocomplete requests for billing optimization
 */
export const generateSessionToken = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
