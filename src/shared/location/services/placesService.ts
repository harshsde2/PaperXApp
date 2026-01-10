/**
 * Places Service
 * Handles Google Places API for address autocomplete and place details
 */

import { PlacePrediction, PlaceDetails, Coordinates } from '../types';
import { GOOGLE_PLACES_API, getServerApiKey, COUNTRY_RESTRICTION } from '../constants';

interface AutocompleteResponse {
  predictions: AutocompletePrediction[];
  status: string;
  error_message?: string;
}

interface AutocompletePrediction {
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  description: string;
  types: string[];
}

interface PlaceDetailsResponse {
  result: PlaceDetailsResult;
  status: string;
  error_message?: string;
}

interface PlaceDetailsResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: AddressComponent[];
  types: string[];
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/**
 * Search for places using autocomplete
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
    let url = `${GOOGLE_PLACES_API.AUTOCOMPLETE}?input=${encodedQuery}&key=${getServerApiKey()}&components=country:${COUNTRY_RESTRICTION}&types=address`;
    
    if (sessionToken) {
      url += `&sessiontoken=${sessionToken}`;
    }

    const response = await fetch(url);
    const data: AutocompleteResponse = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.warn('[Places] Autocomplete warning:', data.status, data.error_message);
    }

    if (!data.predictions) {
      return [];
    }

    return data.predictions.map((prediction) => ({
      placeId: prediction.place_id,
      mainText: prediction.structured_formatting.main_text,
      secondaryText: prediction.structured_formatting.secondary_text,
      fullText: prediction.description,
    }));
  } catch (error) {
    console.error('[Places] Search error:', error);
    throw error;
  }
};

/**
 * Get place details by place ID
 */
export const getPlaceDetails = async (
  placeId: string,
  sessionToken?: string,
): Promise<PlaceDetails> => {
  try {
    let url = `${GOOGLE_PLACES_API.DETAILS}?place_id=${placeId}&key=${getServerApiKey()}&fields=name,formatted_address,geometry,address_components,types,place_id`;
    
    if (sessionToken) {
      url += `&sessiontoken=${sessionToken}`;
    }

    const response = await fetch(url);
    const data: PlaceDetailsResponse = await response.json();

    if (data.status !== 'OK') {
      throw new Error(data.error_message || `Failed to get place details: ${data.status}`);
    }

    const result = data.result;
    const addressComponents = parseAddressComponents(result.address_components);

    return {
      placeId: result.place_id,
      name: result.name,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      address: {
        formattedAddress: result.formatted_address,
        ...addressComponents,
        placeId: result.place_id,
      },
      types: result.types,
    };
  } catch (error) {
    console.error('[Places] Get details error:', error);
    throw error;
  }
};

/**
 * Parse address components from place details
 */
const parseAddressComponents = (components: AddressComponent[]) => {
  const getComponent = (types: string[]): string | undefined => {
    const component = components.find((c) =>
      types.some((type) => c.types.includes(type))
    );
    return component?.long_name;
  };

  const streetNumber = getComponent(['street_number']);
  const route = getComponent(['route']);
  const sublocality = getComponent(['sublocality', 'sublocality_level_1']);
  
  let streetAddress = '';
  if (streetNumber && route) {
    streetAddress = `${streetNumber} ${route}`;
  } else if (route) {
    streetAddress = route;
  } else if (sublocality) {
    streetAddress = sublocality;
  }

  return {
    streetAddress: streetAddress || undefined,
    city: getComponent(['locality', 'administrative_area_level_2']),
    state: getComponent(['administrative_area_level_1']),
    country: getComponent(['country']),
    pincode: getComponent(['postal_code']),
  };
};

/**
 * Search for places near a location
 */
export const searchNearbyPlaces = async (
  coords: Coordinates,
  query: string,
  radius: number = 50000, // 50km default
): Promise<PlacePrediction[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${GOOGLE_PLACES_API.AUTOCOMPLETE}?input=${encodedQuery}&key=${getServerApiKey()}&location=${coords.latitude},${coords.longitude}&radius=${radius}&components=country:${COUNTRY_RESTRICTION}&types=address`;

    const response = await fetch(url);
    const data: AutocompleteResponse = await response.json();

    if (!data.predictions) {
      return [];
    }

    return data.predictions.map((prediction) => ({
      placeId: prediction.place_id,
      mainText: prediction.structured_formatting.main_text,
      secondaryText: prediction.structured_formatting.secondary_text,
      fullText: prediction.description,
    }));
  } catch (error) {
    console.error('[Places] Nearby search error:', error);
    throw error;
  }
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
