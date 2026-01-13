import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '@shared/types';
import type { RoleState, SetRolesPayload } from './@types';

const initialState: RoleState = {
  primaryRole: null,
  secondaryRole: null,
  activeRole: null,
  availableRoles: [],
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles: (
      state,
      action: PayloadAction<SetRolesPayload>
    ) => {
      const newAvailableRoles = action.payload.secondaryRole
        ? [action.payload.primaryRole, action.payload.secondaryRole]
        : [action.payload.primaryRole];
      
      state.primaryRole = action.payload.primaryRole;
      state.secondaryRole = action.payload.secondaryRole || null;
      state.availableRoles = newAvailableRoles;
      
      // Only set activeRole to primary if:
      // 1. activeRole is not set yet, OR
      // 2. current activeRole is not in the new available roles
      if (!state.activeRole || !newAvailableRoles.includes(state.activeRole)) {
        state.activeRole = action.payload.primaryRole;
      }
      // Otherwise, preserve the current activeRole
    },
    setActiveRole: (state, action: PayloadAction<UserRole>) => {
      if (state.availableRoles.includes(action.payload)) {
        state.activeRole = action.payload;
      }
    },
    switchRole: (state) => {
      // Toggle between primary and secondary if both exist
      if (state.secondaryRole && state.primaryRole) {
        state.activeRole =
          state.activeRole === state.primaryRole
            ? state.secondaryRole
            : state.primaryRole;
      }
    },
    clearRoles: (state) => {
      state.primaryRole = null;
      state.secondaryRole = null;
      state.activeRole = null;
      state.availableRoles = [];
    },
  },
});

export const { setRoles, setActiveRole, switchRole, clearRoles } =
  roleSlice.actions;

export default roleSlice.reducer;

