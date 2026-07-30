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
  /** When true, the section shows an Edit affordance. */
  editable?: boolean;
  /** Stable key that maps to an editor archetype (see EDITOR_REGISTRY). */
  editKey?: string;
  /** Raw current values used to prefill the section editor. */
  edit?: Record<string, any>;
}

export interface RegistrationDetails {
  role: string | null;
  lastUpdatedAt: string;
  sections: RegistrationDetailsSection[];
}
