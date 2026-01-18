export const SCREENS = {
  AUTH: {
    SPLASH: 'Splash',
    LOGIN: 'Login',
    SIGNUP: 'Signup',
    OTP_VERIFICATION: 'OTPVerification',
    COMPANY_DETAILS: 'CompanyDetails',
    ROLE_SELECTION: 'RoleSelection',
    VERIFICATION_STATUS: 'VerificationStatus',
    MATERIALS: 'Materials',
    MILL_BRAND_DETAILS: 'MillBrandDetails',
    MATERIAL_SPECS: 'MaterialSpecs',
    SELECT_THICKNESS: 'SelectThickness',
    MANAGE_WAREHOUSES: 'ManageWarehouses',
    CONVERTER_TYPE: 'ConverterType',
    FINISHED_PRODUCTS: 'FinishedProducts',
    MACHINERY: 'Machinery',
    SCRAP_GENERATION: 'ScrapGeneration',
    PRODUCTION_CAPACITY: 'ProductionCapacity',
    RAW_MATERIALS: 'RawMaterials',
    FACTORY_LOCATION: 'FactoryLocation',
    CONFIRM_REGISTRATION: 'ConfirmRegistration',
    BRAND_REGISTRATION: 'BrandRegistration',
    MACHINE_DEALER_REGISTRATION: 'MachineDealerRegistration',
  },
  MAIN: {
    // Tab Screens
    TABS: 'MainTabs',
    HOME: 'Home',
    DASHBOARD: 'Dashboard',
    MESSAGES: 'Messages',
    MARKET: 'Market',
    SETTINGS: 'Settings',
    INQUIRIES: 'Inquiries',
    CAPACITY: 'Capacity',
    SESSIONS: 'Sessions',
    PROFILE: 'Profile',
    POST: 'Post',
    POST_TO_BUY: 'PostToBuy',
    REQUIREMENTS: 'Requirements',
  },
  WALLET: {
    MAIN: 'WalletMain',
    CREDIT_PACKS: 'CreditPacks',
    TRANSACTION_HISTORY: 'TransactionHistory',
    ADD_CUSTOM_CREDITS: 'AddCustomCredits',
  },
} as const;

// Role types
export type UserRole = 'dealer' | 'machine-dealer' | 'converter' | 'brand';

// Tab configurations for each role
export const TAB_CONFIGS: Record<UserRole, { name: string; label: string; icon: string }[]> = {
  dealer: [
    { name: SCREENS.MAIN.DASHBOARD, label: 'Dashboard', icon: 'Dashboard' },
    { name: SCREENS.MAIN.MESSAGES, label: 'Messages', icon: 'Messages' },
    { name: SCREENS.MAIN.MARKET, label: 'Market', icon: 'Market' },
    { name: SCREENS.MAIN.SETTINGS, label: 'Settings', icon: 'Settings' },
  ],
  'machine-dealer': [
    { name: SCREENS.MAIN.DASHBOARD, label: 'Dashboard', icon: 'Dashboard' },
    { name: SCREENS.MAIN.SESSIONS, label: 'Sessions', icon: 'Sessions' },
    { name: SCREENS.MAIN.PROFILE, label: 'Profile', icon: 'Profile' },
  ],
  converter: [
    { name: SCREENS.MAIN.HOME, label: 'Home', icon: 'Home' },
    { name: SCREENS.MAIN.INQUIRIES, label: 'Inquiries', icon: 'Inquiries' },
    { name: SCREENS.MAIN.MESSAGES, label: 'Messages', icon: 'Messages' },
    { name: SCREENS.MAIN.CAPACITY, label: 'Capacity', icon: 'Capacity' },
  ],
  brand: [
    { name: SCREENS.MAIN.HOME, label: 'Home', icon: 'Home' },
    { name: SCREENS.MAIN.INQUIRIES, label: 'Inquiries', icon: 'Inquiries' },
    { name: SCREENS.MAIN.MESSAGES, label: 'Messages', icon: 'Messages' },
    { name: SCREENS.MAIN.PROFILE, label: 'Profile', icon: 'Profile' },
  ],
} as const;
