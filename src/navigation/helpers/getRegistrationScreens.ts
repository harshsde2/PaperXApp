/**
 * Registration Flow Helper
 * 
 * Defines role-specific registration screen sequences and provides
 * helper functions for navigation between registration screens.
 */

import { SCREENS } from '../constants';
import { ROLES } from '@utils/constants';

type UserRole = typeof ROLES[keyof typeof ROLES];
type ScreenName = string;

/**
 * Role-specific registration screen sequences
 * Each role has a defined flow of screens the user must complete
 */
export const REGISTRATION_FLOWS: Record<UserRole, ScreenName[]> = {
  // Dealer Registration Flow
  [ROLES.DEALER]: [
    SCREENS.AUTH.MATERIALS,           // Step 1: Materials selection
    SCREENS.AUTH.MILL_BRAND_DETAILS,  // Step 2: Mill & Brand details
    SCREENS.AUTH.MATERIAL_SPECS,      // Step 3: Material specs (Grades, Finishes)
    SCREENS.AUTH.SELECT_THICKNESS,    // Step 4: Thickness selection
    SCREENS.AUTH.MANAGE_WAREHOUSES,   // Step 5: Warehouse management
  ],

  // Converter Registration Flow
  [ROLES.CONVERTER]: [
    SCREENS.AUTH.CONVERTER_REGISTRATION,      // Step 1: Converter type selection
    SCREENS.AUTH.FINISHED_PRODUCTS,   // Step 2: Finished products
    SCREENS.AUTH.MACHINERY,           // Step 3: Machinery selection
    SCREENS.AUTH.SCRAP_GENERATION,    // Step 4: Scrap categories
    SCREENS.AUTH.PRODUCTION_CAPACITY, // Step 5: Production capacity
    SCREENS.AUTH.RAW_MATERIALS,       // Step 6: Raw materials used
    SCREENS.AUTH.FACTORY_LOCATION,    // Step 7: Factory location
    SCREENS.AUTH.CONFIRM_REGISTRATION,// Step 8: Confirm & submit
  ],

  // Brand Registration Flow (minimal)
  [ROLES.BRAND]: [
    SCREENS.AUTH.BRAND_REGISTRATION,  // Step 1: Brand details & type selection
  ],

  // Machine Dealer Registration Flow
  [ROLES.MACHINE_DEALER]: [
    SCREENS.AUTH.MACHINE_DEALER_REGISTRATION, // Step 1: Contact info, email, business location
  ],

  // Mill Registration Flow (placeholder - screens to be created)
  [ROLES.MILL]: [
    // TODO: Add mill specific screens when created
    // SCREENS.AUTH.MILL_REGISTRATION,
    // SCREENS.AUTH.MILL_PRODUCT_PORTFOLIO,
    // SCREENS.AUTH.MILL_DEALER_MAPPING,
  ],

  // Scrap Dealer Registration Flow (placeholder - screens to be created)
  [ROLES.SCRAP_DEALER]: [
    // TODO: Add scrap dealer specific screens when created
    // SCREENS.AUTH.SCRAP_DEALER_REGISTRATION,
    // SCREENS.AUTH.SCRAP_TYPES,
  ],
};

/**
 * Get the first registration screen for a given role
 * @param role - User role (dealer, converter, brand, etc.)
 * @returns First screen name for the role's registration flow, or null if no screens defined
 */
export const getFirstRegistrationScreen = (role: UserRole): ScreenName | null => {
  const screens = REGISTRATION_FLOWS[role];
  if (!screens || screens.length === 0) {
    // Role has no specific registration screens, go directly to verification
    return SCREENS.AUTH.VERIFICATION_STATUS;
  }
  return screens[0];
};

/**
 * Get the next registration screen in the flow
 * @param role - User role (dealer, converter, brand, etc.)
 * @param currentScreen - Current screen name
 * @returns Next screen name, or VERIFICATION_STATUS if at end of flow
 */
export const getNextRegistrationScreen = (
  role: UserRole,
  currentScreen: ScreenName
): ScreenName => {
  const screens = REGISTRATION_FLOWS[role];
  
  if (!screens || screens.length === 0) {
    return SCREENS.AUTH.VERIFICATION_STATUS;
  }

  const currentIndex = screens.indexOf(currentScreen);
  
  // If current screen not found or is the last screen, go to verification
  if (currentIndex === -1 || currentIndex >= screens.length - 1) {
    // For converter, the last screen is ConfirmRegistration which handles its own submission
    // Other roles go to VerificationStatus
    if (role === ROLES.CONVERTER && currentScreen === SCREENS.AUTH.CONFIRM_REGISTRATION) {
      return SCREENS.AUTH.VERIFICATION_STATUS;
    }
    return SCREENS.AUTH.VERIFICATION_STATUS;
  }

  return screens[currentIndex + 1];
};

/**
 * Get the previous registration screen in the flow
 * @param role - User role (dealer, converter, brand, etc.)
 * @param currentScreen - Current screen name
 * @returns Previous screen name, or null if at start of flow
 */
export const getPreviousRegistrationScreen = (
  role: UserRole,
  currentScreen: ScreenName
): ScreenName | null => {
  const screens = REGISTRATION_FLOWS[role];
  
  if (!screens || screens.length === 0) {
    return null;
  }

  const currentIndex = screens.indexOf(currentScreen);
  
  if (currentIndex <= 0) {
    return null;
  }

  return screens[currentIndex - 1];
};

/**
 * Get the current step number in the registration flow
 * @param role - User role
 * @param currentScreen - Current screen name
 * @returns Object with current step and total steps
 */
export const getRegistrationProgress = (
  role: UserRole,
  currentScreen: ScreenName
): { currentStep: number; totalSteps: number } => {
  const screens = REGISTRATION_FLOWS[role];
  
  if (!screens || screens.length === 0) {
    return { currentStep: 1, totalSteps: 1 };
  }

  const currentIndex = screens.indexOf(currentScreen);
  
  return {
    currentStep: currentIndex >= 0 ? currentIndex + 1 : 1,
    totalSteps: screens.length,
  };
};

/**
 * Check if the current screen is the last in the registration flow
 * @param role - User role
 * @param currentScreen - Current screen name
 * @returns true if this is the last screen before verification
 */
export const isLastRegistrationScreen = (
  role: UserRole,
  currentScreen: ScreenName
): boolean => {
  const screens = REGISTRATION_FLOWS[role];
  
  if (!screens || screens.length === 0) {
    return true;
  }

  const currentIndex = screens.indexOf(currentScreen);
  return currentIndex === screens.length - 1;
};

/**
 * Get all registration screens for a role
 * @param role - User role
 * @returns Array of screen names
 */
export const getRegistrationScreens = (role: UserRole): ScreenName[] => {
  return REGISTRATION_FLOWS[role] || [];
};

export default {
  REGISTRATION_FLOWS,
  getFirstRegistrationScreen,
  getNextRegistrationScreen,
  getPreviousRegistrationScreen,
  getRegistrationProgress,
  isLastRegistrationScreen,
  getRegistrationScreens,
};

