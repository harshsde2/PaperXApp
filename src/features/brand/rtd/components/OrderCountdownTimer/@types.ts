export interface OrderCountdownTimerProps {
  deadline: string;
  onExpired?: () => void;
}
