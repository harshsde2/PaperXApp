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
 * Convert coordinates to address (Reverse Geocoding)
 */
export const reverseGeocode = async (coords: Coordinates): Promise<LocationAddress> => {
  try {
    const url = `${GOOGLE_PLACES_API.GEOCODE}?latlng=${coords.latitude},${coords.longitude}&key=${getServerApiKey()}&language=en`;
    
    const response = await fetch(url);
    const data: GeocodingResponse = await response.json();

    if (data.status !== 'OK' || !data.results.length) {
      throw new Error(data.error_message || 'No results found');
    }

    const result = data.results[0];
    return parseAddressComponents(result);
  } catch (error) {
    console.error('[Geocoding] Reverse geocode error:', error);
    throw error;
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
 * Get full location data from coordinates
 */
export const getLocationFromCoords = async (coords: Coordinates): Promise<Location> => {
  const address = await reverseGeocode(coords);
  return {
    ...coords,
    address,
  };
};

/**
 * Validate pincode format (India)
 */
export const validatePincode = (pincode: string): boolean => {
  // Indian pincode: 6 digits, first digit cannot be 0
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};
