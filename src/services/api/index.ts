/**
 * API Services Barrel Export
 * Central export point for all API-related functionality
 */

// ============================================
// API CLIENT
// ============================================

export { api, default as apiClient } from './client';

// ============================================
// QUERY CLIENT
// ============================================

export { queryClient, queryKeys } from './queryClient';

// ============================================
// BASE TYPES
// ============================================

export type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  PaginatedResponse,
  PaginationParams,
  FilterParams,
  UserProfile,
} from './types';
export { ERROR_CODES } from './types';

// ============================================
// AUTH API
// ============================================

export * from './authApi/authApi';
export type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './authApi/@types';

// ============================================
// USER API
// ============================================

export * from './userApi/userApi';
export type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadUdyamRequest,
  UploadUdyamResponse,
  SwitchRoleRequest,
  SwitchRoleResponse,
  UserRole,
} from './userApi/@types';

// ============================================
// REFERENCE DATA API
// ============================================

export * from './referenceApi/referenceApi';
export type {
  // Common
  IdName,
  // Materials
  Material,
  MaterialGrade,
  GetMaterialsResponse,
  GetMaterialsPaginatedResponse,
  GetMaterialsParams,
  MaterialDetails,
  GetMaterialDetailsResponse,
  // Machines
  MachineType,
  Machine,
  GetMachinesParams,
  GetMachinesResponse,
  // Material Finishes
  FinishType,
  MaterialFinish,
  GetMaterialFinishesParams,
  GetMaterialFinishesResponse,
  GetMaterialFinishesPaginatedResponse,
  // Material Mills
  MaterialMill,
  GetMaterialMillsParams,
  GetMaterialMillsResponse,
  // Material Thickness Types
  ThicknessUnit,
  MaterialThicknessType,
  GetMaterialThicknessTypesParams,
  GetMaterialThicknessTypesResponse,
  // Brands
  Brand,
  GetBrandsResponse,
} from './referenceApi/@types';

// ============================================
// DEALER API
// ============================================

export * from './dealerApi/dealerApi';
export type {
  // Common Types
  AgentType,
  UrgencyType,
  OpportunityStatus,
  SessionStatus,
  QuoteStatus,
  Location,
  ThicknessRange,
  // Legacy Registration Types
  DealerMaterialsRequest,
  DealerMaterialsResponse,
  DealerMillBrandRequest,
  DealerMillBrandResponse,
  DealerMaterialSpecsRequest,
  DealerMaterialSpecsResponse,
  DealerThicknessRequest,
  DealerThicknessResponse,
  WarehouseLocation,
  DealerWarehousesRequest,
  DealerWarehousesResponse,
  CompleteDealerRegistrationRequest,
  CompleteDealerRegistrationResponse,
  // Profile Types
  DealerMaterial,
  CompleteDealerProfileRequest,
  CompleteDealerProfileResponse,
  // Dashboard Types
  DealerDashboardStats,
  DealerDashboardResponse,
  // Opportunity Types
  OpportunityListItem,
  GetOpportunitiesParams,
  GetOpportunitiesResponse,
  OpportunityDetail,
  GetOpportunityDetailResponse,
  AcceptOpportunityResponse,
  DeclineOpportunityRequest,
  DeclineOpportunityResponse,
  // Session Types
  SessionListItem,
  SessionDetail,
  GetSessionDetailResponse,
  GetSessionHistoryParams,
  GetSessionHistoryResponse,
  // Chat Types
  ChatMessage,
  GetChatMessagesParams,
  GetChatMessagesResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
  // Quote Types
  Quote,
  SubmitQuoteRequest,
  SubmitQuoteResponse,
  // Notification Types
  NotificationType,
  DealerNotification,
  GetNotificationsParams,
  GetNotificationsResponse,
  MarkNotificationReadResponse,
  MarkAllNotificationsReadResponse,
  // Post Requirement Types
  InquiryType,
  IntentType,
  ThicknessUnit,
  QuantityUnit,
  PriceUnit,
  PostRequirementRequest,
  PostRequirementResponse,
  PostRequirementMaterial,
  // Get Requirements Types
  GetRequirementsParams,
  GetRequirementsResponse,
  RequirementListItem,
  RequirementMaterial,
} from './dealerApi/@types';

// ============================================
// MACHINE DEALER API
// ============================================

export * from './machineDealerApi/machineDealerApi';
export type {
  // Common Types
  MachineCondition,
  MachineIntent,
  ListingStatus,
  // Profile Types
  CompleteMachineDealerProfileRequest,
  CompleteMachineDealerProfileResponse,
  // Dashboard Types
  MachineDealerDashboardStats,
  MachineDealerDashboardResponse,
  // Post Machine Types
  PostMachineRequest,
  PostMachineResponse,
  // Listing Types
  MachineListingItem,
  GetListingsParams,
  GetListingsResponse,
  // Requirement Types
  MachineRequirementItem,
  GetRequirementsParams,
  GetRequirementsResponse,
} from './machineDealerApi/@types';

// ============================================
// CONVERTER API
// ============================================

export * from './converterApi/converterApi';
export type {
  // Profile Types
  CompleteConverterProfileRequest,
  CompleteConverterProfileResponse,
  // Dashboard Types
  ConverterDashboardStats,
  ConverterDashboardResponse,
  // Order Types
  OrderStatus,
  ConverterOrderItem,
  // Material Request Types
  MaterialRequestItem,
  // Reference Types
  ConverterType,
  FinishedProduct,
  ScrapType,
} from './converterApi/@types';

// ============================================
// BRAND API
// ============================================

export * from './brandApi/brandApi';
export type {
  // Profile Types
  CompleteBrandProfileRequest,
  CompleteBrandProfileResponse,
  // Dashboard Types
  BrandDashboardStats,
  BrandDashboardResponse,
  // Requirement Types
  RequirementStatus,
  BrandRequirementItem,
  // Session Types
  BrandSessionStatus,
  BrandSessionItem,
  // Reference Types
  BrandType,
  // Post Requirement Types
  BrandRequirementType,
  BrandPackagingType,
  BrandTimeline,
  PostBrandRequirementRequest,
  PostBrandRequirementResponse,
} from './brandApi/@types';

// ============================================
// DASHBOARD API (Unified for all roles)
// ============================================

export {
  useGetDashboard,
  useGetDealerDashboard,
  useGetMachineDealerDashboard,
  useGetConverterDashboard,
  useGetBrandDashboard,
} from './dashboardApi';

export type {
  DashboardRole,
  DashboardData,
  GetDashboardParams,
  GetDashboardResponse,
  DealerDashboardData,
  MachineDealerDashboardData,
  ConverterDashboardData,
  BrandDashboardData,
  RecentSession,
  RecentInquiry,
  ActiveSession,
  NewInquiry,
  MachineOpportunity,
} from './dashboardApi';

// ============================================
// WALLET API
// ============================================

export * from './walletApi/walletApi';
export type {
  // Enums & Constants
  WalletStatus,
  TransactionDirection,
  PaymentMethod,
  AddedTransactionType,
  DeductedTransactionType,
  TransactionType,
  // Balance
  WalletBalance,
  GetWalletBalanceResponse,
  // Credit Packs
  CreditPack,
  GetCreditPacksResponse,
  // Calculate
  CalculateCreditsRequest,
  CalculateCreditsResponse,
  // Purchase
  PurchaseCreditsFromPackRequest,
  PurchaseCreditsCustomRequest,
  PurchaseCreditsRequest,
  PurchaseCreditsResponse,
  // Add
  AddCreditsRequest,
  AddCreditsResponse,
  // Deduct
  DeductCreditsRequest,
  DeductCreditsSuccessResponse,
  DeductCreditsErrorResponse,
  DeductCreditsResponse,
  // Transactions
  WalletTransaction,
  GetTransactionsParams,
  TransactionsPagination,
  GetTransactionsResponse,
  // Error
  InsufficientBalanceError,
  // Hook Return Types
  UseWalletReturn,
} from './walletApi/@types';

// ============================================
// SESSION API (Unified for all roles)
// ============================================

export {
  useGetActiveSessions,
  useGetActiveSessionsInfinite,
  useGetSessionHistory,
  useGetSessionHistoryInfinite,
  useGetSessionDetail,
  useFetchSessionByInquiry,
  useLockSession,
  useRepublishSession,
  useMarkDealFailed,
  useGetMatchmakingResponses,
  useExpressInterest,
  useDeclineInquiry,
} from './sessionApi/sessionApi';
export type { GetSessionByInquiryResponse } from './sessionApi/sessionApi';
export type {
  // Common Types
  SessionStatus,
  SessionStatusLabel,
  SessionFilter,
  HistoryFilter,
  // Session Item
  SessionItem,
  // Countdown
  SessionCountdown,
  // Matching Progress
  MatchingProgress,
  // Active Sessions
  ActiveSessionListItem,
  GetActiveSessionsParams,
  GetActiveSessionsResponse,
  // History
  HistorySessionListItem,
  HistoryMonthGroup,
  GetSessionHistoryParams,
  GetSessionHistoryResponse,
  // Session Detail
  SelectedPartner,
  SessionDetail,
  GetSessionDetailResponse,
  // Lock Session
  LockSessionRequest,
  LockSessionResponse,
  // Republish Session
  RepublishSessionResponse,
  // Mark Deal Failed
  MarkDealFailedResponse,
  // Matchmaking Responses
  MatchmakingResponseItem,
  MatchmakingResponseDealer,
  MatchmakingResponsesCountdown,
  GetMatchmakingResponsesResponse,
  GetMatchmakingResponsesParams,
} from './sessionApi/@types';
