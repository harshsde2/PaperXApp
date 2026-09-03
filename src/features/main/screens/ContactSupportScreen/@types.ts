export interface ContactMethod {
  id: string;
  /** Emoji glyph shown in the tinted circle. */
  glyph: string;
  /** Small label above the value, e.g. "Call us". */
  label: string;
  /** The displayed value, e.g. "+91 99695 08795". */
  value: string;
  /** The deep link to open on tap (tel: / mailto:). */
  url: string;
}
