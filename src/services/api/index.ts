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
  GetMaterialsResponse,
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
} from './brandApi/@types';
