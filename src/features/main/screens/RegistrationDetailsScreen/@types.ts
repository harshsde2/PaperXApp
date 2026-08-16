export type RegistrationRowType = 'value' | 'metric' | 'chip-list' | 'address' | 'detail-card';

export interface RegistrationRowVM {
  id: string;
  type: RegistrationRowType;
  label: string;
  value?: string;
  chips?: string[];
}

export interface RegistrationSectionVM {
  id: string;
  title: string;
  icon?: string | null;
  rows: RegistrationRowVM[];
  editable?: boolean;
  editKey?: string;
  edit?: Record<string, any>;
}
