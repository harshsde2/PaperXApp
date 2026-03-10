import type { RegistrationRowVM } from '../../@types';

export interface DetailSectionProps {
  title: string;
  icon?: string | null;
  rows: RegistrationRowVM[];
}
