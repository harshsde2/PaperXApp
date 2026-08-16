import type { ReactNode } from 'react';

export interface ConfirmModalProps {
  /** Whether the modal is visible. */
  visible: boolean;
  /** Heading text. */
  title: string;
  /** Body/description text. */
  message?: string;
  /** Confirm button label. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Cancel button label. Defaults to "Cancel". */
  cancelLabel?: string;
  /** Called when the confirm button is pressed. */
  onConfirm: () => void;
  /** Called when the cancel button / backdrop / hardware back is used. */
  onCancel: () => void;
  /** Renders the confirm button in a destructive (red) style. */
  destructive?: boolean;
  /** Optional icon shown at the top of the modal. */
  icon?: ReactNode;
  /** Disables the buttons and shows a spinner on confirm. */
  loading?: boolean;
  testID?: string;
}
