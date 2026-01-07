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

export interface Material {
  id: number;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetMaterialsResponse {
  materials: Material[];
}

export interface MaterialDetails {
  id: number;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  finishes?: MaterialFinish[];
  coatings?: MaterialFinish[];
  grades?: MaterialFinish[];
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
  | 'lamination'
  | 'corrugation'
  | 'other';

export interface Machine {
  id: number;
  name: string;
  type: MachineType;
  brand?: string;
  model?: string;
  description?: string;
  specifications?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetMachinesParams {
  type?: MachineType;
}

export interface GetMachinesResponse {
  machines: Machine[];
}

// ============================================
// MATERIAL FINISHES
// ============================================

export type FinishType = 'finish' | 'coating' | 'grade' | 'variant';

export interface MaterialFinish {
  id: number;
  name: string;
  material_id: number;
  type: FinishType;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetMaterialFinishesParams {
  material_id: number;
  type?: FinishType;
}

export interface GetMaterialFinishesResponse {
  finishes: MaterialFinish[];
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

