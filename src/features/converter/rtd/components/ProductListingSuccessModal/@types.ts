export interface ProductListingSuccessModalProps {
  visible: boolean;
  productName: string;
  onViewListing: () => void;
  onAddAnother: () => void;
  /** When true, shows "Product Updated!" instead of "Product Listed!" */
  isUpdate?: boolean;
}
