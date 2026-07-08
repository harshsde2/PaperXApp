export type InvoiceKind = 'credit_pack' | 'direct_pay' | 'rtd_platform_fee';

export interface InvoiceListItem {
  key: string;
  invoice_no: string;
  kind: InvoiceKind;
  title: string;
  base_amount_inr: number;
  gst_percent: number;
  gst_amount_inr: number;
  total_inr: number;
  credits: number | null;
  currency: string;
  paid_at: string | null;
  razorpay_payment_id: string | null;
  razorpay_order_id: string;
  receipt: string;
  status: 'PAID';
}

export interface InvoiceBillTo {
  name: string | null;
  company_name: string | null;
  gstin: string | null;
  city: string | null;
  state: string | null;
}

export interface InvoiceSeller {
  name: string;
  legal_name: string;
  address: string;
  gstin: string;
  email: string;
  phone: string;
}

export interface InvoiceDetail extends InvoiceListItem {
  bill_to: InvoiceBillTo;
  seller: InvoiceSeller;
  download_url: string;
}

export interface InvoicesPaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface GetInvoicesResponse {
  data: InvoiceListItem[];
  meta: InvoicesPaginationMeta;
}
