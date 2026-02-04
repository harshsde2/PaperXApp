export interface ConverterRegistrationFormData {
  converter_type_ids: number[];
  converter_type_custom?: string;
  finished_product_ids: number[];
  machine_ids: number[];
  scrap_type_ids?: number[];
  raw_material_ids: number[];
  capacity_daily?: number;
  capacity_monthly?: number;
  capacity_unit: string;
  factory_address: string;
  factory_city: string;
  factory_state: string;
  factory_location?: string;
  factory_latitude: number;
  factory_longitude: number;
}
