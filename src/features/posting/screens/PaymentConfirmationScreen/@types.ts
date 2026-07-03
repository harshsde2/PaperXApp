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
  requirementType?: 'dealer' | 'brand' | 'converter' | 'machineDealer';
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

/** Display-only estimate for direct pay copy; server uses `WALLET_INR_PER_CREDIT`. */
export const DIRECT_PAY_INR_PER_CREDIT = 1 as const;
