/**
 * ElapsedTimer Types
 * Timer that counts UP from 0 (when session was posted) to end time (24h or backend).
 */

export interface ElapsedTimerProps {
  /** When the session was posted (start time). */
  startDate: string | Date;
  /** When the session period ends (e.g. 24h from start or from backend). If omitted, uses 24h from start. */
  endDate?: string | Date;
  compact?: boolean;
  showLabel?: boolean;
  label?: string;
}

export interface ElapsedTime {
  hours: number;
  minutes: number;
  seconds: number;
}
