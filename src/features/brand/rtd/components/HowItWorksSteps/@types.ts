import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

export interface HowItWorksStep {
  icon: FC<SvgProps>;
  title: string;
  description: string;
}

export interface HowItWorksStepsProps {
  /** Optional title override for the card heading. */
  title?: string;
}
