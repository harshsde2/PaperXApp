/**
 * RequirementSummaryCard Types
 */

export interface RequirementSummaryCardProps {
  title: string;
  subtitle: string;
  /** When the requirement was posted. If set, shows elapsed timer (count up from 0 to end). */
  startDate?: string | Date;
  /** When the session period ends (e.g. 24h or from backend). Optional; defaults to 24h from start. */
  endDate?: string | Date;
}
