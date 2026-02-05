/**
 * Reference Data API Types
 * Types for materials, machines, finishes, mills, brands, etc.
 */

// ============================================
// COMMON TYPES
// ============================================

export interface IdName {
  id: number;
  name: string;
}

// ============================================
// MATERIALS
// ============================================

export interface MaterialGrade {
  id: number;
  name: string;
}

export interface Material {
  id: number;
  name: string;
  category: string;
  grades: MaterialGrade[];
  code?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetMaterialsResponse {
  success: boolean;
  message: string;
  data: Material[];
}

// Paginated Materials Response
export interface GetMaterialsPaginatedResponse {
  success: boolean;
  message: string;
  data: Material[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface GetMaterialsParams {
  page?: number;
  per_page?: number;
}

export interface MaterialDetails {
  id: number;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  finishes?: MaterialFinish[];
  coatings?: MaterialFinish[];
  grades?: MaterialGrade[];
  variants?: MaterialFinish[];
  mills?: MaterialMill[];
  thickness_types?: MaterialThicknessType[];
}

export interface GetMaterialDetailsResponse {
  material: MaterialDetails;
}

// ============================================
// MACHINES
// ============================================

export type MachineType =
  | 'printing'
  | 'die_cutting'
  | 'folding_gluing'
  | 'rigid_box'
  | 'lamination'
  | 'corrugation'
  | 'converting'
  | 'binding'
  | 'finishing'
  | 'paper_bag_cup'
  | 'auxiliary'
  | 'specialty'
  | 'other';

export interface Machine {
  id: number;
  name: string;
  type?: string;
  brand?: string;
  model?: string;
  description?: string;
  specifications?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetMachinesParams {
  /** Backend machines.type filter: printing, die_cutting, folding_gluing, rigid_box, corrugation, lamination, converting, binding, finishing, paper_bag_cup, auxiliary, specialty */
  type?: string;
  category?: string;
}

export interface GetMachinesResponse {
  machines: Machine[];
}

// ============================================
// MATERIAL FINISHES
// ============================================

export type FinishType = 'finish' | 'coating' | 'grade' | 'variant' | 'surface';

export interface MaterialFinish {
  id: number;
  name: string;
  material_id: number | null;
  type: FinishType | string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetMaterialFinishesParams {
  material_id?: number;
  type?: FinishType;
  page?: number;
  per_page?: number;
}

export interface GetMaterialFinishesResponse {
  success: boolean;
  message: string;
  data: MaterialFinish[];
  meta?: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export interface GetMaterialFinishesPaginatedResponse {
  success: boolean;
  message: string;
  data: MaterialFinish[];
  meta: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

// ============================================
// MATERIAL MILLS
// ============================================

export interface MaterialMill {
  id: number;
  name: string;
  material_id: number;
  code?: string;
  location?: string;
  country?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetMaterialMillsParams {
  material_id: number;
}

export interface GetMaterialMillsResponse {
  mills: MaterialMill[];
}

// ============================================
// MATERIAL THICKNESS TYPES
// ============================================

export type ThicknessUnit = 'GSM' | 'MM' | 'MICRON';

export interface MaterialThicknessType {
  id: number;
  name: string;
  material_id: number;
  unit: ThicknessUnit;
  min_value?: number;
  max_value?: number;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetMaterialThicknessTypesParams {
  material_id: number;
}

export interface GetMaterialThicknessTypesResponse {
  thickness_types: MaterialThicknessType[];
}

// ============================================
// BRANDS (MILLS)
// ============================================

export interface Brand {
  id: number;
  name: string;
  code?: string;
  logo_url?: string;
  website?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetBrandsResponse {
  brands: Brand[];
}
