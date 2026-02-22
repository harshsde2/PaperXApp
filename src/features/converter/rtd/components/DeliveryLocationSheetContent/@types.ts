import type { Theme } from '@theme/types';
import type { SavedLocation } from '../../screens/ConverterRTDAddProductScreen/@types';

export interface DeliveryLocationSheetContentProps {
  userLocations: SavedLocation[];
  selectedLocationId?: number;
  selectedSource?: 'saved' | 'manual';
  onSelectSavedLocation: (location: SavedLocation) => void;
  onAddLocation: () => void;
  theme: Theme;
  ListComponent: React.ComponentType<any>;
}
