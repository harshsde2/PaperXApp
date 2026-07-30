import type { RegistrationRowVM } from '../../@types';

export interface DetailSectionProps {
  title: string;
  icon?: string | null;
  rows: RegistrationRowVM[];
  /** Shows an Edit affordance in the header when true. */
  editable?: boolean;
  /** Called when the user taps Edit. */
  onEdit?: () => void;
}
