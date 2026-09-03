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
    CONVERTER_REGISTRATION: 'ConverterRegistration',
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
    /**
     * Brand's Ready-to-Dispatch catalogue as a bottom tab. Deliberately a
     * different route name from SCREENS.BRAND_RTD.MARKETPLACE (which stays a
     * pushed stack screen) so the two navigators don't share a route name.
     */
    RTD: 'RTDMarketplace',
    MARKET_INSIGHT: 'MarketScreen',
    ARTICLE_DETAIL: 'ArticleDetail',
    CAPACITY: 'Capacity',
    SESSIONS: 'Sessions',
    PROFILE: 'Profile',
    CONTACT_SUPPORT: 'ContactSupport',
    POST: 'Post',
    POST_TO_BUY: 'PostToBuy',
    POST_TO_SELL_MACHINE: 'PostToSellMachine',
    POST_TO_BUY_MACHINE: 'PostToBuyMachine',
    POST_BRAND_REQUIREMENT: 'PostBrandRequirement',
    POST_JOBWORK_FIND: 'PostJobworkFind',
    POST_JOBWORK_GIVE: 'PostJobworkGive',
    REQUIREMENTS: 'Requirements',
    PAYMENT_CONFIRMATION: 'PaymentConfirmation',
    MATCHMAKING_SUCCESS: 'MatchmakingSuccess',
    NOTIFICATIONS: 'Notifications',
    RESPONSES: 'Responses',
    REGISTRATION_DETAILS: 'RegistrationDetails',
    EDIT_REGISTRATION_SECTION: 'EditRegistrationSection',
  },
  WALLET: {
    MAIN: 'WalletMain',
    CREDIT_PACKS: 'CreditPacks',
    TRANSACTION_HISTORY: 'TransactionHistory',
    ADD_CUSTOM_CREDITS: 'AddCustomCredits',
  },
  INVOICES: {
    LIST: 'InvoiceList',
    DETAIL: 'InvoiceDetail',
  },
  SESSIONS: {
    DASHBOARD: 'SessionDashboard',
    DETAILS: 'SessionDetails',
    RESPONDER_DETAILS: 'ResponderDetails',
    LOCKED: 'SessionLocked',
    CHAT: 'SessionChat',
    INQUIRY_CHAT_THREADS: 'InquiryChatThreads',
    STRUCTURED_CHAT: 'StructuredChat',
  },
  // Converter RTD (Ready-to-Dispatch) - converter only
  CONVERTER_RTD: {
    LISTING: 'ConverterRTDListing',
    LISTING_PACK: 'ConverterRTDListingPack',
    ADD_PRODUCT: 'ConverterRTDAddProduct',
    MY_PRODUCTS: 'ConverterRTDMyProducts',
    ORDER_HISTORY: 'ConverterRTDOrderHistory',
    ORDER_DETAIL: 'ConverterRTDOrderDetail',
  },
  // Brand RTD (Ready-to-Dispatch) - brand browsing & ordering
  BRAND_RTD: {
    MARKETPLACE: 'BrandRTDMarketplace',
    PRODUCT_DETAIL: 'BrandRTDProductDetail',
    REQUEST_ORDER: 'BrandRTDRequestOrder',
    ORDER_DETAIL: 'BrandRTDOrderDetail',
    MY_ORDERS: 'BrandRTDMyOrders',
  },
} as const;

// Role types
export type UserRole = 'dealer' | 'machine-dealer' | 'converter' | 'brand';

// Tab configurations for each role
export const TAB_CONFIGS: Record<
  UserRole,
  {
    name: string;
    label: string;
    icon: string;
    /** Render the navigator header for this tab (default false). */
    showHeader?: boolean;
  }[]
> = {
  dealer: [
    { name: SCREENS.MAIN.DASHBOARD, label: 'Dashboard', icon: 'Dashboard' },
    { name: SCREENS.MAIN.MARKET, label: 'Insights', icon: 'MarketIcon' },
    { name: SCREENS.MAIN.SESSIONS, label: 'Sessions', icon: 'Sessions' },
    { name: SCREENS.MAIN.SETTINGS, label: 'Settings', icon: 'Settings' },
  ],
  'machine-dealer': [
    { name: SCREENS.MAIN.DASHBOARD, label: 'Dashboard', icon: 'Dashboard' },
    { name: SCREENS.MAIN.MARKET, label: 'Insights', icon: 'MarketIcon' },
    { name: SCREENS.MAIN.SESSIONS, label: 'Sessions', icon: 'Sessions' },
    { name: SCREENS.MAIN.SETTINGS, label: 'Settings', icon: 'Settings' },
  ],
  converter: [
    { name: SCREENS.MAIN.HOME, label: 'Home', icon: 'Home' },
    { name: SCREENS.MAIN.MARKET, label: 'Insights', icon: 'MarketIcon' },
    { name: SCREENS.MAIN.SESSIONS, label: 'Sessions', icon: 'Sessions' },
    // { name: SCREENS.MAIN.INQUIRIES, label: 'Inquiries', icon: 'Inquiries' },
    { name: SCREENS.MAIN.SETTINGS, label: 'Settings', icon: 'Settings' },
    // { name: SCREENS.MAIN.CAPACITY, label: 'Capacity', icon: 'Capacity' },
  ],
  brand: [
    { name: SCREENS.MAIN.HOME, label: 'Home', icon: 'Home' },
    // Brands get the RTD catalogue here instead of Insights.
    // showHeader: this screen sets its own CustomHeader (filter button) via
    // setOptions, which needs the navigator's header enabled to render.
    { name: SCREENS.MAIN.RTD, label: 'RTD', icon: 'Order', showHeader: true },
    { name: SCREENS.MAIN.INQUIRIES, label: 'Inquiries', icon: 'Inquiries' },
    { name: SCREENS.MAIN.SETTINGS, label: 'Settings', icon: 'Settings' },
  ],
} as const;
