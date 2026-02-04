/**
 * PaymentConfirmationScreen Types
 */

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface ListingDetails {
  id?: string;
  title: string;
  referenceNumber: string;
  grade: string;
  materialName: string;
  quantity: string;
  quantityUnit: string;
  urgency: string;
  imageUrl?: string;
  tags: string[];
}

export interface CostBreakdownItem {
  label: string;
  amount: number;
  isTotal?: boolean;
}

export interface PaymentConfirmationRouteParams {
  listingDetails: ListingDetails;
  formData: any;
  requirementType?: 'dealer' | 'brand'; // Optional flag to identify requirement type
}

export type PaymentConfirmationScreenNavigationProp = NativeStackNavigationProp<any>;

export type PaymentConfirmationScreenRouteProp = RouteProp<
  { PaymentConfirmation: PaymentConfirmationRouteParams },
  'PaymentConfirmation'
>;

export interface PaymentConfirmationScreenProps {
  navigation: PaymentConfirmationScreenNavigationProp;
  route: PaymentConfirmationScreenRouteProp;
}

// Pricing Constants (can be moved to a config later)
export const POSTING_COSTS = {
  STANDARD_FEE: 50,
  URGENCY_BOOST: 20,
  VAT_PERCENTAGE: 20,
} as const;
