import type { PickedImage } from '@shared/utils/imagePicker';

export interface ImagePickerProps {
  /** Current selection (newly picked file). */
  value: PickedImage | null;
  /** Called when user selects or clears the image. */
  onChange: (image: PickedImage | null) => void;
  /** Optional existing URL for preview when value is null (e.g. edit mode). */
  previewUri?: string | null;
  /** Placeholder text when no image (e.g. "Add product photo"). */
  placeholderText?: string;
  /** Hint text below placeholder (e.g. "PNG, JPG up to 10MB"). */
  hintText?: string;
  /** Show "Take photo" option using camera. */
  showCamera?: boolean;
  /** Disable pick and clear actions. */
  disabled?: boolean;
  /** Preview box aspect ratio (width/height). Default 1 (square). */
  aspectRatio?: number;
}
