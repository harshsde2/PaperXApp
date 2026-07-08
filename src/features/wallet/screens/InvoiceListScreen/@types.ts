import type { InvoiceListItem } from '@services/api';

export interface InvoiceCardProps {
  invoice: InvoiceListItem;
  onPress: (invoice: InvoiceListItem) => void;
}
