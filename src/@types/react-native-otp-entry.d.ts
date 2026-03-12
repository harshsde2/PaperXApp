declare module 'react-native-otp-entry' {
  import type { Ref } from 'react';
  import type { ViewStyle, TextStyle } from 'react-native';

  export interface OtpInputTheme {
    containerStyle?: ViewStyle;
    pinCodeContainerStyle?: ViewStyle;
    pinCodeTextStyle?: TextStyle;
    focusedPinCodeContainerStyle?: ViewStyle;
  }

  export interface OtpInputProps {
    numberOfDigits?: number;
    onTextChange?: (text: string) => void;
    onFilled?: (code: string) => void;
    focusColor?: string;
    theme?: OtpInputTheme;
  }

  export interface OtpInputRef {
    setValue?: (value: string) => void;
    clear?: () => void;
  }

  export const OtpInput: React.ForwardRefExoticComponent<
    OtpInputProps & React.RefAttributes<OtpInputRef>
  >;

  export type { OtpInputRef };
}

