/**
 * useDocumentPicker Hook
 * Reusable hook for picking documents (PDF, images, etc.) from device
 * Can be used anywhere in the app
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import {
  pick,
  types,
  type DocumentPickerOptions,
  type DocumentPickerResponse,
} from '@react-native-documents/picker';

export interface DocumentPickerFile {
  uri: string;
  name: string;
  size: number;
  type: string;
}

export interface UseDocumentPickerOptions {
  /**
   * Allowed file types - use types from @react-native-documents/picker
   * Default: [types.images, types.pdf]
   * Options: types.images, types.pdf, types.video, types.audio, types.allFiles, etc.
   */
  allowedTypes?: string[];
  /**
   * Maximum file size in bytes
   * Default: 5MB (5 * 1024 * 1024)
   */
  maxSize?: number;
  /**
   * Whether to allow multiple file selection
   * Default: false
   */
  allowMultiple?: boolean;
  /**
   * Custom error messages
   */
  errorMessages?: {
    fileTooLarge?: string;
    invalidFileType?: string;
    pickerCancelled?: string;
    pickerError?: string;
  };
}

export interface UseDocumentPickerReturn {
  /**
   * Selected file(s)
   */
  selectedFiles: DocumentPickerFile[];
  /**
   * Whether picker is currently active
   */
  isPicking: boolean;
  /**
   * Pick a document
   */
  pickDocument: () => Promise<DocumentPickerFile[] | null>;
  /**
   * Clear selected files
   */
  clearFiles: () => void;
}

/**
 * Hook for picking documents from device
 * 
 * @example
 * ```tsx
 * const { selectedFiles, isPicking, pickDocument, clearFiles } = useDocumentPicker({
 *   allowedTypes: ['application/pdf', 'image/jpeg'],
 *   maxSize: 5 * 1024 * 1024, // 5MB
 * });
 * 
 * const handlePick = async () => {
 *   const files = await pickDocument();
 *   if (files) {
 *     console.log('Selected files:', files);
 *   }
 * };
 * ```
 */
export const useDocumentPicker = (
  options: UseDocumentPickerOptions = {}
): UseDocumentPickerReturn => {
  const {
    allowedTypes = [types.images, types.pdf],
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowMultiple = false,
    errorMessages = {},
  } = options;

  const [selectedFiles, setSelectedFiles] = useState<DocumentPickerFile[]>([]);
  const [isPicking, setIsPicking] = useState(false);

  const defaultErrorMessages = {
    fileTooLarge: `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(0)}MB. Please select a smaller file.`,
    invalidFileType: 'Please select a valid file type (PDF or image).',
    pickerCancelled: 'File selection was cancelled.',
    pickerError: 'Failed to pick document. Please try again.',
    ...errorMessages,
  };

  const pickDocument = async (): Promise<DocumentPickerFile[] | null> => {
    try {
      setIsPicking(true);

      // Configure picker options (import mode by default - files are copied automatically)
      const pickOptions: DocumentPickerOptions = {
        type: allowedTypes,
        allowMultiSelection: allowMultiple,
        mode: 'import', // Import mode copies files to app's cache directory
      };

      // Pick document(s) - returns array, use destructuring for single file
      const results = await pick(pickOptions);

      if (!results || results.length === 0) {
        // User cancelled
        return null;
      }

      // Process selected files
      const validFiles: DocumentPickerFile[] = [];

      for (const result of results) {
        // Validate file size
        const fileSize = result.size || 0;
        if (fileSize > maxSize) {
          Alert.alert('File Too Large', defaultErrorMessages.fileTooLarge);
          continue;
        }

        // Get file type from result
        const fileType = result.type || 'application/octet-stream';

        // Add valid file
        validFiles.push({
          uri: result.uri,
          name: result.name || 'Document',
          size: fileSize,
          type: fileType,
        });
      }

      if (validFiles.length === 0) {
        return null;
      }

      // Update state
      setSelectedFiles(validFiles);

      return validFiles;
    } catch (error: any) {
      // Check if user cancelled
      if (error?.isCancel || error?.code === 'DOCUMENT_PICKER_CANCELED' || error?.message?.includes('cancel')) {
        return null;
      }

      console.error('Document picker error:', error);
      Alert.alert('Error', defaultErrorMessages.pickerError);
      return null;
    } finally {
      setIsPicking(false);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  return {
    selectedFiles,
    isPicking,
    pickDocument,
    clearFiles,
  };
};

