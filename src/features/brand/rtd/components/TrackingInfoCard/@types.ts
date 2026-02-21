export interface TrackingInfoCardProps {
  trackingNumber: string | null;
  courierService: string | null;
  onCopyTracking?: () => void;
}
