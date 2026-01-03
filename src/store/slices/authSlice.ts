import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@shared/types';
import type { AuthState, SetCredentialsPayload } from './@types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<SetCredentialsPayload>
    ) => {
      console.log('[AuthSlice] setCredentials called with:', {
        hasUser: !!action.payload.user,
        hasToken: !!action.payload.token,
        userMobile: action.payload.user?.mobile,
      });
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.otpVerified = true;
      console.log('[AuthSlice] State updated, isAuthenticated:', true);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setOTPSent: (state, action: PayloadAction<boolean>) => {
      state.otpSent = action.payload;
    },
    setOTPVerified: (state, action: PayloadAction<boolean>) => {
      state.otpVerified = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setCredentials,
  setLoading,
  setError,
  clearError,
  setOTPSent,
  setOTPVerified,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
