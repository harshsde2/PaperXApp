/**
 * Geocoding Service
 * Handles converting between addresses and coordinates using Google Geocoding API
 */

import { Coordinates, LocationAddress, Location } from '../types';
import { GOOGLE_PLACES_API, getServerApiKey, COUNTRY_RESTRICTION } from '../constants';

interface GeocodingResponse {
  results: GeocodingResult[];
  status: string;
  error_message?: string;
}

interface GeocodingResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: AddressComponent[];
  place_id: string;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/**
 * Nominatim API Response Interface
 */
interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type?: string;
  osm_id?: number;
  lat: string;
  lon: string;
  class?: string;
  type?: string;
  place_rank?: number;
  importance?: number;
  addresstype?: string;
  name?: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state_district?: string;
    state?: string;
    'ISO3166-2-lvl4'?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    road?: string;
    house_number?: string;
    suburb?: string;
    neighbourhood?: string;
  };
  boundingbox?: string[];
}

/** Nominatim allows 1 request per second; track last request time for rate limiting */
let lastNominatimRequestTime = 0;
const NOMINATIM_MIN_INTERVAL_MS = 1100;

const waitForNominatimRateLimit = (): Promise<void> => {
  const now = Date.now();
  const elapsed = now - lastNominatimRequestTime;
  if (elapsed >= NOMINATIM_MIN_INTERVAL_MS) {
    lastNominatimRequestTime = now;
    return Promise.resolve();
  }
  const waitMs = NOMINATIM_MIN_INTERVAL_MS - elapsed;
  return new Promise((resolve) =>
    setTimeout(() => {
      lastNominatimRequestTime = Date.now();
      resolve();
    }, waitMs)
  );
};

/**
 * Convert coordinates to address using Nominatim (Reverse Geocoding)
 * Using OpenStreetMap Nominatim API (free alternative to Google)
 * Rate-limited to 1 request per second per Nominatim usage policy.
 */
export const reverseGeocodeNominatim = async (coords: Coordinates): Promise<LocationAddress> => {
  try {
    await waitForNominatimRateLimit();

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PaperXApp/1.0 (contact: dev@paperx.app)',
        'Referer': 'https://paperx.app',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NominatimResponse = await response.json();

    if (!data || !data.display_name) {
      throw new Error('No results found');
    }

    return parseNominatimAddress(data);
  } catch (error) {
    console.error('[Geocoding] Nominatim reverse geocode error:', error);
    throw error;
  }
};

/**
 * Parse Nominatim response to LocationAddress format
 */
const parseNominatimAddress = (data: NominatimResponse): LocationAddress => {
  const address = data.address || {};
  
  // Build street address / location name
  // Priority: name field > road > suburb > neighbourhood > first part of display_name
  let streetAddress = '';
  if (data.name) {
    streetAddress = data.name;
  } else if (address.house_number && address.road) {
    streetAddress = `${address.house_number} ${address.road}`;
  } else if (address.road) {
    streetAddress = address.road;
  } else if (address.suburb) {
    streetAddress = address.suburb;
  } else if (address.neighbourhood) {
    streetAddress = address.neighbourhood;
  } else if (data.display_name) {
    // Extract first part of display_name (usually the most specific location)
    const parts = data.display_name.split(',');
    streetAddress = parts[0]?.trim() || '';
  }

  // Get city (can be city, town, or village)
  const city = address.city || address.town || address.village || address.county;

  return {
    formattedAddress: data.display_name,
    streetAddress: streetAddress || undefined,
    city: city,
    state: address.state,
    country: address.country,
    pincode: address.postcode,
    placeId: data.place_id?.toString(),
  };
};

/**
 * Convert coordinates to address using Google Geocoding API (reverse)
 */
const reverseGeocodeGoogle = async (coords: Coordinates): Promise<LocationAddress> => {
  const url = `${GOOGLE_PLACES_API.GEOCODE}?latlng=${coords.latitude},${coords.longitude}&key=${getServerApiKey()}&language=en`;
  const response = await fetch(url);
  const data: GeocodingResponse = await response.json();
  if (data.status !== 'OK' || !data.results.length) {
    throw new Error(data.error_message || 'No results found');
  }
  const result = data.results[0];
  return parseAddressComponents(result);
};

/**
 * Convert coordinates to address (Reverse Geocoding)
 * Uses Nominatim first (free); falls back to Google on 509/429 or other errors.
 */
export const reverseGeocode = async (coords: Coordinates): Promise<LocationAddress> => {
  try {
    return await reverseGeocodeNominatim(coords);
  } catch (error) {
    console.warn('[Geocoding] Nominatim failed, trying Google fallback:', error);
    try {
      return await reverseGeocodeGoogle(coords);
    } catch (googleError) {
      console.error('[Geocoding] Reverse geocode error (Nominatim + Google failed):', googleError);
      throw error;
    }
  }
};

/**
 * Convert address to coordinates (Forward Geocoding)
 */
export const geocodeAddress = async (address: string): Promise<Location> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${GOOGLE_PLACES_API.GEOCODE}?address=${encodedAddress}&key=${getServerApiKey()}&region=${COUNTRY_RESTRICTION}`;
    
    const response = await fetch(url);
    const data: GeocodingResponse = await response.json();

    if (data.status !== 'OK' || !data.results.length) {
      throw new Error(data.error_message || 'No results found');
    }

    const result = data.results[0];
    const addressData = parseAddressComponents(result);

    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      address: addressData,
    };
  } catch (error) {
    console.error('[Geocoding] Geocode address error:', error);
    throw error;
  }
};

/**
 * Parse address components from Google response
 */
const parseAddressComponents = (result: GeocodingResult): LocationAddress => {
  const components = result.address_components;
  
  const getComponent = (types: string[]): string | undefined => {
    const component = components.find((c) =>
      types.some((type) => c.types.includes(type))
    );
    return component?.long_name;
  };

  const getShortComponent = (types: string[]): string | undefined => {
    const component = components.find((c) =>
      types.some((type) => c.types.includes(type))
    );
    return component?.short_name;
  };

  // Build street address from components
  const streetNumber = getComponent(['street_number']);
  const route = getComponent(['route']);
  const sublocality = getComponent(['sublocality', 'sublocality_level_1', 'sublocality_level_2']);
  
  let streetAddress = '';
  if (streetNumber && route) {
    streetAddress = `${streetNumber} ${route}`;
  } else if (route) {
    streetAddress = route;
  } else if (sublocality) {
    streetAddress = sublocality;
  }

  return {
    formattedAddress: result.formatted_address,
    streetAddress: streetAddress || undefined,
    city: getComponent(['locality', 'administrative_area_level_2']),
    state: getComponent(['administrative_area_level_1']),
    country: getComponent(['country']),
    pincode: getComponent(['postal_code']),
    placeId: result.place_id,
  };
};

/**
 * Get full location data from coordinates.
 * On geocoding failure, returns coords with a minimal address so the pin can still be saved.
 */
export const getLocationFromCoords = async (coords: Coordinates): Promise<Location> => {
  try {
    const address = await reverseGeocode(coords);
    return { ...coords, address };
  } catch {
    return {
      ...coords,
      address: {
        formattedAddress: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`,
        city: undefined,
        state: undefined,
        country: undefined,
        pincode: undefined,
        placeId: undefined,
      },
    };
  }
};

/**
 * Validate pincode format (India)
 */
export const validatePincode = (pincode: string): boolean => {
  // Indian pincode: 6 digits, first digit cannot be 0
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};
