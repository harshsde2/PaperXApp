import type { UpdateProfileResponse } from './@types';

export interface NormalizedPostingLocation {
  id: number;
  type: string;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string | null;
  source?: string;
  backend_location_id?: number;
}

const SYNTHETIC_IDS = {
  converterFactory: -2001,
  brandLocation: -3001,
  machineDealerLocation: -4001,
} as const;

const toLocationString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

const parseCoordinateString = (value: unknown): string | null => {
  const str = toLocationString(value).trim();
  if (!str) return null;
  const num = Number(str);
  if (!Number.isFinite(num)) return null;
  return String(num);
};

const buildAddress = (address: unknown, city: unknown, state: unknown): string => {
  const addressText = toLocationString(address).trim();
  const cityText = toLocationString(city).trim();
  const stateText = toLocationString(state).trim();

  if (addressText) return addressText;
  if (cityText && stateText) return `${cityText}, ${stateText}`;
  return cityText || stateText;
};

const createLocation = (params: {
  id: number;
  backendLocationId?: number;
  source?: string;
  type: string;
  address?: unknown;
  city?: unknown;
  state?: unknown;
  latitude?: unknown;
  longitude?: unknown;
}): NormalizedPostingLocation | null => {
  const latitude = parseCoordinateString(params.latitude);
  const longitude = parseCoordinateString(params.longitude);

  if (!latitude || !longitude) return null;

  const city = toLocationString(params.city).trim();
  const state = toLocationString(params.state).trim();

  return {
    id: params.id,
    backend_location_id: params.backendLocationId,
    source: params.source,
    type: params.type,
    address: buildAddress(params.address, city, state),
    latitude,
    longitude,
    city,
    state: state || null,
  };
};

const normalizePostingLocationsFromBackend = (
  postingLocations: UpdateProfileResponse['posting_locations']
): NormalizedPostingLocation[] => {
  if (!Array.isArray(postingLocations)) return [];

  return postingLocations
    .map((location, index) => {
      const idCandidate = Number(location?.id);
      const source = toLocationString(location?.source).trim();
      const sourceType = source || 'saved_location';
      const id = Number.isFinite(idCandidate) ? idCandidate : -(1000 + index + 1);
      const backendLocationId = source === 'dealer_saved' && Number.isFinite(idCandidate) ? idCandidate : undefined;

      return createLocation({
        id,
        backendLocationId,
        source,
        type: sourceType,
        address: location?.address || location?.label,
        city: location?.city,
        state: location?.state,
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
    })
    .filter((location): location is NormalizedPostingLocation => !!location);
};

export const normalizePostingLocationsFromProfile = (
  profile: Partial<UpdateProfileResponse> | null | undefined
): NormalizedPostingLocation[] => {
  if (!profile) return [];

  const backendLocations = normalizePostingLocationsFromBackend(profile.posting_locations);
  if (backendLocations.length > 0) return backendLocations;

  const fallbackLocations: NormalizedPostingLocation[] = [];

  if (Array.isArray(profile.locations)) {
    profile.locations.forEach((location, index) => {
      const rawId = Number(location?.id);
      const locationId = Number.isFinite(rawId) ? rawId : -(5000 + index + 1);
      const normalized = createLocation({
        id: locationId,
        backendLocationId: Number.isFinite(rawId) && rawId > 0 ? rawId : undefined,
        source: 'dealer_saved',
        type: toLocationString(location?.type).trim() || 'warehouse',
        address: location?.address,
        city: location?.city,
        state: location?.state,
        latitude: location?.latitude,
        longitude: location?.longitude,
      });

      if (normalized) fallbackLocations.push(normalized);
    });
  }

  if (profile.dealer?.locations?.length) {
    profile.dealer.locations.forEach((location, index) => {
      const rawId = Number(location?.id);
      const locationId = Number.isFinite(rawId) ? rawId : -(6000 + index + 1);
      const normalized = createLocation({
        id: locationId,
        backendLocationId: Number.isFinite(rawId) && rawId > 0 ? rawId : undefined,
        source: 'dealer_saved',
        type: toLocationString(location?.type).trim() || 'warehouse',
        address: location?.address,
        city: location?.city,
        state: location?.state,
        latitude: location?.latitude,
        longitude: location?.longitude,
      });

      if (normalized) fallbackLocations.push(normalized);
    });
  }

  const converterLocation = createLocation({
    id: SYNTHETIC_IDS.converterFactory,
    source: 'converter_factory',
    type: 'factory',
    address: profile.converter?.factory_address,
    city: profile.converter?.factory_city,
    state: profile.converter?.factory_state,
    latitude: profile.converter?.factory_latitude,
    longitude: profile.converter?.factory_longitude,
  });
  if (converterLocation) fallbackLocations.push(converterLocation);

  const brandLocation = createLocation({
    id: SYNTHETIC_IDS.brandLocation,
    source: 'brand_location',
    type: 'office',
    address: profile.brand?.location,
    city: profile.brand?.city,
    state: profile.brand?.state,
    latitude: profile.brand?.latitude,
    longitude: profile.brand?.longitude,
  });
  if (brandLocation) fallbackLocations.push(brandLocation);

  const machineDealerProfile = profile.machine_dealer ?? profile.machineDealer;
  const machineDealerLocation = createLocation({
    id: SYNTHETIC_IDS.machineDealerLocation,
    source: 'machine_dealer_location',
    type: 'office',
    address: machineDealerProfile?.location,
    city: machineDealerProfile?.city,
    state: '',
    latitude: machineDealerProfile?.latitude,
    longitude: machineDealerProfile?.longitude,
  });
  if (machineDealerLocation) fallbackLocations.push(machineDealerLocation);

  // Keep unique source+coordinates combinations.
  const seen = new Set<string>();
  return fallbackLocations.filter(location => {
    const key = `${location.source}:${location.latitude}:${location.longitude}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
