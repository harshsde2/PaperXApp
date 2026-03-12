declare module 'react-native-otp-verify' {
  type OtpListener = (message: string) => void;

  interface RNOtpVerifyType {
    getHash(): Promise<string[]>;
    startOtpListener(callback: OtpListener): void;
    removeListener(): void;
    requestHint?(): Promise<string>;
  }

  const RNOtpVerify: RNOtpVerifyType;
  export default RNOtpVerify;
}

