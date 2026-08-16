export type LegalDocType = 'terms' | 'privacy';

export interface LegalSection {
  heading: string;
  /** Body paragraphs, rendered one below the other. */
  paragraphs?: string[];
  /** Optional bulleted list rendered after the paragraphs. */
  bullets?: string[];
}

export interface LegalDocument {
  title: string;
  /** Short line shown under the title (e.g. last-updated date). */
  effectiveDate: string;
  sections: LegalSection[];
}

export interface LegalModalProps {
  visible: boolean;
  /** Which document to show. */
  docType: LegalDocType;
  onClose: () => void;
}
