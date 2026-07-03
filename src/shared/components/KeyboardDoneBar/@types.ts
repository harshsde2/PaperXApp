export interface KeyboardDoneBarProps {
  /** Text shown on the dismiss button. Defaults to "Done". */
  label?: string;
  /** Optional extra handler called after the keyboard is dismissed. */
  onDone?: () => void;
}
