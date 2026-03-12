import type { ReactNode } from 'react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastBannerProps {
  type: ToastType;
  title: string;
  message?: string | null;
  onClose?: () => void;
  /**
   * Optional right side content override (e.g. custom close icon).
   * If provided, this will render instead of the default close icon.
   */
  rightContent?: ReactNode;
}

