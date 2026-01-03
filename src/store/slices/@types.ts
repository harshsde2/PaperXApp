/**
 * Store Slice Type Definitions
 * All type definitions for Redux slices consolidated here per .cursorrules
 */

import { User } from '@shared/types';
import { UserRole } from '@shared/types';
import { ReactNode } from 'react';

/**
 * Auth Slice Types
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
}

export interface SetCredentialsPayload {
  user: User;
  token: string;
}

/**
 * Role Slice Types
 */
export interface RoleState {
  primaryRole: UserRole | null;
  secondaryRole: UserRole | null;
  activeRole: UserRole | null; // Currently active role (primary or secondary)
  availableRoles: UserRole[]; // Array of user's roles
}

export interface SetRolesPayload {
  primaryRole: UserRole;
  secondaryRole?: UserRole;
}

/**
 * UI Slice Types
 */
export interface ModalState {
  isOpen: boolean;
  type: string | null;
  props?: Record<string, any>;
}

export interface UIState {
  isLoading: boolean;
  loadingMessage: string | null;
  modal: ModalState;
  toast: {
    message: string | null;
    type: 'success' | 'error' | 'warning' | 'info' | null;
  };
  bottomSheet: {
    isOpen: boolean;
    content: ReactNode | null;
  };
}

export interface SetLoadingPayload {
  isLoading: boolean;
  message?: string;
}

export interface OpenModalPayload {
  type: string;
  props?: Record<string, any>;
}

export interface ShowToastPayload {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

