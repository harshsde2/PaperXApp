/**
 * RequirementSummaryCard Types
 */

export interface RequirementSummaryCardProps {
  title: string;
  subtitle: string;
  countdown?: {
    hours: number;
    mins: number;
    secs: number;
  };
}
