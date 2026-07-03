export interface WarehouseFormData {
  name: string;
  location1: string;
  location2: string;
  state: string;
  city: string;
  pincode: string;
}

export interface WarehouseFormMapData {
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface WarehouseAddressFormProps {
  mapData: WarehouseFormMapData;
  existingLocation?: {
    id: string;
    isPrimary: boolean;
    name?: string;
    address?: string;
  } | null;
  /** When set (e.g. no map), submitted coordinates use this instead of mapData lat/lng */
  coordinatesOverride?: { latitude: number; longitude: number };
  /** When false, hides the optional location name field */
  showNameField?: boolean;
  onSubmit: (data: WarehouseFormData & { latitude: number; longitude: number }) => void;
  onCancel: () => void;
  submitLabel?: string;
}
