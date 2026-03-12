export interface OTPInputProps {
  /** Number of OTP digits */
  length?: number;
  /** Controlled value (optional) so parent can programmatically set OTP */
  value?: string;
  /** Callback when all digits are filled */
  onComplete: (otp: string) => void;
}

