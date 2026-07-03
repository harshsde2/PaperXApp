import type { BottomSheetModalProps } from '@gorhom/bottom-sheet';

export type GorhomBottomSheetModalProps = BottomSheetModalProps & {
  /**
   * When true, renders a sticky "Done" button pinned to the visible bottom of the
   * sheet at every snap point (via gorhom's BottomSheetFooter). Tapping it closes
   * the sheet — useful for multi-select sheets where there is no tap-to-dismiss.
   */
  doneFooter?: boolean;
  /** Label for the Done button. Defaults to "Done". */
  doneLabel?: string;
};
