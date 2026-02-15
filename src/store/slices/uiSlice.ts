import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import type {
  UIState,
  SetLoadingPayload,
  OpenModalPayload,
  ShowToastPayload,
} from './@types';

const initialState: UIState = {
  isLoading: false,
  loadingMessage: null,
  modal: {
    isOpen: false,
    type: null,
    props: undefined,
  },
  toast: {
    message: null,
    type: null,
  },
  bottomSheet: {
    isOpen: false,
    content: null,
  },
  messagesUnreadCount: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<SetLoadingPayload>
    ) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || null;
    },
    openModal: (
      state,
      action: PayloadAction<OpenModalPayload>
    ) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        props: action.payload.props,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        props: undefined,
      };
    },
    showToast: (
      state,
      action: PayloadAction<ShowToastPayload>
    ) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast = {
        message: null,
        type: null,
      };
    },
    openBottomSheet: (state, action: PayloadAction<ReactNode>) => {
      state.bottomSheet = {
        isOpen: true,
        content: action.payload,
      };
    },
    closeBottomSheet: (state) => {
      state.bottomSheet = {
        isOpen: false,
        content: null,
      };
    },
    setMessagesUnreadCount: (state, action: PayloadAction<number>) => {
      state.messagesUnreadCount = Math.max(0, action.payload);
    },
  },
});

export const {
  setLoading,
  openModal,
  closeModal,
  showToast,
  hideToast,
  openBottomSheet,
  closeBottomSheet,
  setMessagesUnreadCount,
} = uiSlice.actions;

export default uiSlice.reducer;

