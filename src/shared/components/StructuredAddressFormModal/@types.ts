import type { WarehouseAddressFormProps } from '@shared/components/WarehouseAddressForm/@types';

export interface StructuredAddressFormModalProps
  extends Pick<
    WarehouseAddressFormProps,
    | 'mapData'
    | 'existingLocation'
    | 'coordinatesOverride'
    | 'showNameField'
    | 'onSubmit'
    | 'submitLabel'
  > {
  visible: boolean;
  title: string;
  onDismiss: () => void;
}
