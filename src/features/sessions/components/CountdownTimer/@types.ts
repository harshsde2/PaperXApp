/**
 * CountdownTimer Types
 */

export interface CountdownTimerProps {
  targetDate: string | Date;
  onExpire?: () => void;
  compact?: boolean;
  showLabel?: boolean;
  label?: string;
}
