// Common types used across the application

export type UserRole = 'dealer' | 'converter' | 'brand' | 'machineDealer' | 'mill' | 'scrapDealer';

export interface User {
  id: string;
  mobile: string;
  primaryRole: UserRole;
  secondaryRole?: UserRole;
  isVerified: boolean;
}

// Add more common types as needed

