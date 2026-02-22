import type { ReactNode } from 'react';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

export interface EmptyStateProps {
  /** Main line (e.g. "No RTD products yet") */
  title: string;
  /** Supporting line */
  description?: string;
  /** Icon element (e.g. AppIcon.Market). Omit for minimal variant. */
  icon?: ReactNode;
  /** Primary button; if provided, shown below description */
  action?: EmptyStateAction;
  /** 'card' = dashed border card + optional icon; 'minimal' = simple centered block */
  variant?: 'minimal' | 'card';
}
