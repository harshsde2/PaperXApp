export type RegistrationRowType = 'value' | 'metric' | 'chip-list' | 'address' | 'detail-card';

export interface RegistrationDetailsRow {
  id: string;
  type: RegistrationRowType;
  label: string;
  value?: string;
  chips?: string[];
}

export interface RegistrationDetailsSection {
  id: string;
  title: string;
  icon?: string | null;
  rows: RegistrationDetailsRow[];
}

export interface RegistrationDetails {
  role: string | null;
  lastUpdatedAt: string;
  sections: RegistrationDetailsSection[];
}
